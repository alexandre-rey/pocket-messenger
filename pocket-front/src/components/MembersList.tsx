import { Channel } from "@/interfaces";
import pb, { BASE_URL } from "@/pocketbase";
import { CurrentStateContext } from "@/state/state.context";
import { useContext, useEffect, useState } from "react";

const MembersList = () => {

    const currentState = useContext(CurrentStateContext);


    const [members, setMembers] = useState<{ username: string, id: string, avatar: string }[]>([]);

    useEffect(() => {
        pb.collection<Channel>('channels').getOne(currentState.channelId).then((channel) => {
            let filterStr = '';

            for (let i = 0; i < channel.users.length; i++) {
                filterStr += 'id=\'' + channel.users[i] + '\'' + (i === channel.users.length - 1 ? '' : ' || ');
            }

            console.log('Filter string:', filterStr);

            pb.collection('usersOverview').getFullList<{ username: string, id: string, avatar: string }>({
                filter: filterStr,
            }).then((result) => {
                console.log('Members:', result);
                setMembers(result);
            });
        });
    }, [currentState.channelId]);

    return (
        <div className='menu_container members_container no_margin'>
            <div className='members_content'>
                <h3>Members</h3>
                <div className='members_list'>
                    {members.map((member) => (
                        <div key={member.id} className='members_member'>
                            <img
                                alt='avatar'
                                className='members_avatar'
                                src={
                                    BASE_URL + '/api/files/users/' +
                                    member.id +
                                    '/' +
                                    member.avatar
                                }
                            />
                            <p>{member.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default MembersList;