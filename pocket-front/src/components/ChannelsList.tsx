import { useContext, useEffect, useState } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import "../styles/channels.list.css";
import { useTranslation } from "react-i18next";

import { DispatchContext } from "../state/state.context";
import { Action, ActionType } from "../state/action";

import { PageType } from "@/state/state";
import { PbUtils } from "@/pb.utils";
import { Channel, ChannelOverview } from "@/interfaces/chat.interface";

const ChannelsList = () => {
  const [channels, setChannels] = useState<ChannelOverview[]>([]);
  const [newChannel, setNewChannel] = useState("");
  const { trackEvent } = useMatomo();
  const dispatch = useContext(DispatchContext);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const resultList = await PbUtils.getChannelsOverview();

        setChannels(resultList);
      } catch (error) {
        console.error("Failed to fetch channels", error);
      }
    };

    fetchChannels();
  }, []);

  const handleNewChannelName = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.value !== null && e.target.value !== "") {
      setNewChannel(e.target.value);
    }
  };

  const createNewChannel = async () => {
    if (newChannel === "") {
      return;
    }

    try {
      await PbUtils.createChannel(newChannel);
      setNewChannel("");
      // Fetch updated channels
      const resultList = await PbUtils.getChannelsOverview();

      setChannels(resultList);
    } catch (error) {
      console.error("Failed to create channel", error);
    }
  };

  const joinChannel = async (channelOverview: ChannelOverview) => {
    PbUtils.joinChannel(channelOverview.id);
    trackEvent({
      category: "Channels",
      action: "channel-join",
      name: channelOverview.id,
    });

    const toJoinChannel: Channel = await PbUtils.getChannel(channelOverview);

    const action: Action = {
      type: ActionType.SET_CURRENT_CHANNEL,
      payload: {
        currentPage: PageType.CONVERSATIONS,
        channel: toJoinChannel,
      },
    };

    dispatch && dispatch(action);
  };

  return (
    <div className="channels_container">
      <div className="channels_gallery">
        {channels.map((channel) => (
          <button
            key={channel.id}
            className="channel_card"
            onClick={() => {
              joinChannel(channel);
            }}
          >
            <div className="channel_card_title">
              <p>{channel.name}</p>
            </div>
            <p className="channel_card_description">
              {channel.userCount + " " + t("members")}
            </p>
          </button>
        ))}
      </div>
      <div className="channels_new_channel">
        <input
          placeholder={t("channelName")}
          type="text"
          value={newChannel}
          onChange={(e) => handleNewChannelName(e)}
        />
        <button onClick={() => createNewChannel()}>
          {t("createPublicChannel")}
        </button>
      </div>
    </div>
  );
};

export default ChannelsList;
