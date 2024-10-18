import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RecordSubscription, UnsubscribeFunc } from "pocketbase";

import { Channel } from "@/interfaces/chat.interface";
import { Collections, PbUtils } from "@/pb.utils";
import { Action, ActionType } from "@/state/action";
import { CurrentStateContext, DispatchContext } from "@/state/state.context";

const ChannelsMenu = () => {
  const [joinedChannels, setJoinedChannels] = useState<Channel[]>([]);
  const currentState = useContext(CurrentStateContext);
  const dispatch = useContext(DispatchContext);
  const { t } = useTranslation();

  useEffect(() => {
    PbUtils.getJoinedChannels().then((channels) => {
      setJoinedChannels(channels);
    });
  }, [currentState.channel.id]);

  const updateChannels = () => {
    PbUtils.getJoinedChannels().then((channels) => {
      setJoinedChannels(channels);
    });
  };

  const callback = async (e: RecordSubscription<Channel>) => {
    console.log("Message updated", e);
    if (
      e.action === "create" &&
      e.record.users.includes((await PbUtils.getUserProfile()).id)
    ) {
      updateChannels();
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    let unsubscribe: UnsubscribeFunc | null = null;

    const fetchChannels = async () => {
      try {
        const resultList = await PbUtils.getMessages(currentState.channel.id);

        if (isSubscribed) {
          setMessages(resultList);
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
  }, []);

  const handleClick = (channel: Channel) => {
    const action: Action = {
      type: ActionType.SET_CURRENT_CHANNEL,
      payload: {
        channel: channel,
      },
    };

    dispatch && dispatch(action);
  };

  return (
    <div className="menu_container alt_menu_container">
      <div className="alt_menu_content">
        <h3>{t("channels")}</h3>
        <div className="alt_menu_list">
          {joinedChannels.map((channel) => (
            <button
              key={channel.id}
              className="alt_menu_item"
              onClick={() => handleClick(channel)}
            >
              <p>{channel.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelsMenu;
