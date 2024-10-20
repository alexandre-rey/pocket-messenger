import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RecordModel, RecordSubscription, UnsubscribeFunc } from "pocketbase";

import { Channel } from "@/interfaces/chat.interface";
import { Collections, PbUtils } from "@/pb.utils";
import { Action, ActionType } from "@/state/action";
import { CurrentStateContext, DispatchContext } from "@/state/state.context";

const ChannelsMenu = () => {
  const [currentChannels, setJoinedChannels] = useState<Channel[]>([]);
  const [oldChannels, setOldChannels] = useState<Channel[]>([]);
  const currentState = useContext(CurrentStateContext);
  const dispatch = useContext(DispatchContext);
  const { t } = useTranslation();

  const newMessagesChannelIds: string [] = [];

  const updateChannels = () => {
    PbUtils.getJoinedChannels().then((channels) => {
      setOldChannels(currentChannels);
      setJoinedChannels(channels);
    });
  };

  useEffect(() => {
    updateChannels();
  }, [currentState.channel.id]);

  const callback = (e: RecordSubscription<RecordModel>) => {
    console.log("Message updated", e);

    PbUtils.getUserProfile().then((user) => {
      if (e.record.users.includes(user.id)) {
        updateChannels();
      }
    });
  };

  useEffect(() => {
    let isSubscribed = true;
    let unsubscribe: UnsubscribeFunc | null = null;

    PbUtils.subscribeToCollection(Collections.CHANNELS, callback)
      .then((unsub) => {
        if (isSubscribed) {
          unsubscribe = unsub;
        } else {
          unsub();
        }
      })
      .catch((error) => {
        console.error("Failed to subscribe to channels", error);
      });

    return () => {
      isSubscribed = false;
      unsubscribe && unsubscribe();
    }

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


  for (const currentChannel of currentChannels) {
    const lastUpdate = new Date(currentChannel.lastMessage);
    if (!oldChannels.find((oldChannel) => oldChannel.id === currentChannel.id)
      || oldChannels.find((oldChannel) => (oldChannel.id === currentChannel.id && new Date(oldChannel.lastMessage) > lastUpdate))) {
      newMessagesChannelIds.push(currentChannel.id);
    }
  }

  console.log('newMessagesChannelIds', newMessagesChannelIds);

  return (
    <div className="menu_container alt_menu_container">
      <div className="alt_menu_content">
        <h3>{t("channels")}</h3>
        <div className="alt_menu_list">
          {currentChannels.map((channel) => (
            <button
              key={channel.id}
              className="alt_menu_item"
              onClick={() => handleClick(channel)}
            >
              <p> {newMessagesChannelIds.includes(channel.id) ? (<strong>{channel.name}</strong>) : channel.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelsMenu;
