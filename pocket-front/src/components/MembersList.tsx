import { BASE_URL } from "@/pocketbase";
import { CurrentStateContext } from "@/state/state.context";
import { useContext, useEffect, useState } from "react";

import '../styles/members.list.css';
import { PbUtils } from "@/pb.utils";
import { Member } from "@/interfaces/user.interface";
import { useTranslation } from "react-i18next";

const MembersList = () => {

    const currentState = useContext(CurrentStateContext);
    const { t } = useTranslation();
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        PbUtils.getChannelMembers(currentState.channelId).then((members) => {
            setMembers(members);
        });
    }, [currentState.channelId]);

    return (
        <div className='menu_container alt_menu_container no_margin'>
            <div className='alt_menu_content'>
                <h3>{t('members')}</h3>
                <div className='alt_menu_list'>
                    {members.map((member) => (
                        <div key={member.id} className='alt_menu_item'>
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