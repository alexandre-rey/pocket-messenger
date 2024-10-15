import { RecordModel, RecordSubscription, UnsubscribeFunc } from "pocketbase";
import { Channel, ChannelOverview, Message } from "./interfaces";
import pb from "./pocketbase";

export enum Collections {
    CHANNELS = "channels",
    CHANNELS_OVERVIEW = "channelsOverview",
    MESSAGES = "messages",
    USERS_OVERVIEW = "usersOverview",
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
}