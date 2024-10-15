import { RecordModel, RecordSubscription, UnsubscribeFunc } from "pocketbase";
import pb from "./pocketbase";
import { Channel, ChannelOverview, Message } from "./interfaces/chat.interface";
import { Member, SignUpForm, UserProfile } from "./interfaces/user.interface";

export enum Collections {
    CHANNELS = "channels",
    CHANNELS_OVERVIEW = "channelsOverview",
    MESSAGES = "messages",
    USERS_OVERVIEW = "usersOverview",
    USERS = "users",
}

export class PbUtils {

    public static async getChannelsOverview(): Promise<ChannelOverview[]> {
        return await pb
            .collection(Collections.CHANNELS_OVERVIEW)
            .getFullList<ChannelOverview>({
                sort: '-userCount'
            });
    }

    public static async createChannel(channelName: string): Promise<void> {
        await pb.collection(Collections.CHANNELS).create<ChannelOverview>({
            name: channelName,
            isPublic: true,
            isActive: true,
        });
    }

    public static async joinChannel(channelId: string): Promise<void> {
        pb.collection(Collections.CHANNELS).update(channelId, {
            "users+": pb.authStore.model?.id,
        });
    }

    public static async getMessages(channelId: string): Promise<Message[]> {
        return await pb
            .collection(Collections.MESSAGES)
            .getFullList<Message>({
                filter: `channel='${channelId}'`,
                expand: 'sentBy',
                sort: 'created',
            });
    }

    public static async subscribeToCollection(
        collection: Collections,
        callback: (e: RecordSubscription<RecordModel>) => void,
    ): Promise<UnsubscribeFunc> {
        return pb.collection(collection).subscribe('*', callback);
    }

    public static async sendMessage(
        content: string,
        channelId: string
    ): Promise<void> {
        await pb.collection(Collections.MESSAGES).create({
            content: content,
            channel: channelId,
            sentBy: pb.authStore.model?.id,
        });

        pb.collection(Collections.CHANNELS).update(channelId, {
            lastMessage: new Date()
        });
    }

    public static async getJoinedChannels(): Promise<Channel[]> {
        return pb.collection<Channel>(Collections.CHANNELS).getFullList<Channel>({
            filter: 'users ~ \'' + pb.authStore.model?.id + '\'',
        })
    }

    public static async getUserProfile(): Promise<UserProfile> {
        return (await pb.collection<UserProfile>(Collections.USERS).authRefresh()).record;
    }

    public static getUsername(): string {
        return pb.authStore.model?.username || '';
    }

    public static async login(username: string, password: string): Promise<void> {
        await pb.collection(Collections.USERS).authWithPassword(username, password);
    }

    public static clearAuth(): void {
        pb.authStore.clear();
    }

    public static async updateUser(userProfile: UserProfile): Promise<void> {
        const formData = new FormData();
        formData.append('username', userProfile.username);
        formData.append('email', userProfile.email);
        formData.append('oldPassword', userProfile.oldPassword);
        formData.append('password', userProfile.password);
        formData.append('passwordConfirm', userProfile.passwordConfirm);

        if (userProfile.avatar) {
            formData.append('avatar', userProfile.avatar);
        }

        await pb.collection(Collections.USERS).update(userProfile.id, formData);
    }

    public static async registerUser(signUpForm: SignUpForm): Promise<void> {
        const formData = new FormData();
        formData.append('username', signUpForm.username);
        formData.append('email', signUpForm.email);
        formData.append('password', signUpForm.password);
        formData.append('passwordConfirm', signUpForm.passwordConfirm);
        if (signUpForm.avatar) {
            formData.append('avatar', signUpForm.avatar);
        }

        await pb.collection(Collections.USERS).create(formData);
    }

    public static async getChannelMembers(channelId: string): Promise<Member[]> {
        return pb.collection<Channel>(Collections.CHANNELS).getOne(channelId).then((channel) => {
            let filterStr = '';

            for (let i = 0; i < channel.users.length; i++) {
                filterStr += 'id=\'' + channel.users[i] + '\'' + (i === channel.users.length - 1 ? '' : ' || ');
            }

            console.log('Filter string:', filterStr);

            return pb.collection(Collections.USERS_OVERVIEW).getFullList<Member>({
                filter: filterStr,
            }).then((result) => {
                console.log('Members:', result);
                return result;
            });
        });
    }

    public static async openPrivateChat(username: string, memberId: string): Promise<{ channelName: string, channelId: string }> {
        const currentUsernames = [this.getUsername(), username];
        const possibleNames = [currentUsernames.join('-'), currentUsernames.reverse().join('-')];

        const channels = await pb.collection<Channel>(Collections.CHANNELS).getFullList<Channel>({
            filter: `name='${possibleNames[0]}' || name='${possibleNames[1]}'`,
        });

        if (channels.length > 0) {
            return {
                channelName: channels[0].name,
                channelId: channels[0].id,
            };
        }

        const newChannel = await pb.collection<Channel>(Collections.CHANNELS).create<Channel>({
            name: possibleNames[0],
            isPublic: false,
            isActive: true,
            users: [pb.authStore.model?.id, memberId],
        });

        return {
            channelName: newChannel.name,
            channelId: newChannel.id,
        };
    }
}