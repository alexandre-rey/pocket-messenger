import { useContext, useEffect, useState } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";

import "../styles/channels.list.css";
import pb from "../pocketbase";
import { DispatchContext } from "../state/state.context";
import { Action, ActionType } from "../state/action";

interface Channel {
  id: string;
  name: string;
  userCount: number;
}

const ChannelsList = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannel, setNewChannel] = useState("");
  const { trackEvent } = useMatomo();
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const resultList = await pb
          .collection("channelsOverview")
          .getFullList<Channel>();

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
      await pb.collection("channels").create({
        name: newChannel,
        isPublic: true,
      });
      setNewChannel("");
      // Fetch updated channels
      const resultList = await pb
        .collection("channelsOverview")
        .getFullList<Channel>();

      setChannels(resultList);
    } catch (error) {
      console.error("Failed to create channel", error);
    }
  };

  const joinChannel = (channelId: string, channelName: string) => {
    pb.collection("channels").update(channelId, {
      "users+": pb.authStore.model?.id,
    });
    trackEvent({
      category: "Channels",
      action: "channel-join",
      name: channelId,
    });

    const action: Action = {
      type: ActionType.SET_CURRENT_CHANNEL,
      payload: {
        currentPage: "conversations",
        channelId: channelId,
        channelName: channelName,
      },
    };

    dispatch && dispatch(action);
  };

  return (
    <div className="channels_container">
      <div className="channels_gallery">
        {channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => {
              joinChannel(channel.id, channel.name);
            }}
            className="channel_card"
          >
            <div className="channel_card_title">
              <p>{channel.name}</p>
            </div>
            <p className="channel_card_description" >{channel.userCount} users</p>
          </div>
        ))}
      </div>
      <div className="channels_new_channel">
        <input
          placeholder="Channel name"
          type="text"
          value={newChannel}
          onChange={(e) => handleNewChannelName(e)}
        />
        <button onClick={() => createNewChannel()}>Create Public Channel</button>
      </div>
    </div>
  );
};

export default ChannelsList;
