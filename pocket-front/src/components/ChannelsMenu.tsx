import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Channel } from "@/interfaces/chat.interface";
import { PbUtils } from "@/pb.utils";
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
