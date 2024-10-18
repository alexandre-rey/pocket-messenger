import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CurrentStateContext, DispatchContext } from "@/state/state.context";
import { BASE_URL } from "@/pocketbase";
import "../styles/members.list.css";
import { PbUtils } from "@/pb.utils";
import { Member } from "@/interfaces/user.interface";
import { Action, ActionType } from "@/state/action";
import { PageType } from "@/state/state";

const MembersList = () => {
  const currentState = useContext(CurrentStateContext);
  const dispatch = useContext(DispatchContext);
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    PbUtils.getChannelMembers(currentState.channel.id).then((members) => {
      setMembers(members);
    });
  }, [currentState.channel.id]);

  const openPrivateChat = async (username: string, memberId: string) => {
    const channel = await PbUtils.openPrivateChat(username, memberId);
    const action: Action = {
      type: ActionType.SET_CURRENT_CHANNEL,
      payload: {
        channel: channel,
        currentPage: PageType.CONVERSATIONS,
      },
    };

    dispatch && dispatch(action);
  };

  return (
    <div className="menu_container alt_menu_container no_margin">
      <div className="alt_menu_content">
        <h3>{t("members")}</h3>
        <div className="alt_menu_list">
          {members.map((member) => (
            <button
              key={member.id}
              className="alt_menu_item"
              onClick={() => openPrivateChat(member.username, member.id)}
            >
              <img
                alt="avatar"
                className="members_avatar"
                src={
                  BASE_URL +
                  "/api/files/users/" +
                  member.id +
                  "/" +
                  member.avatar
                }
              />
              <p>{member.username}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersList;
