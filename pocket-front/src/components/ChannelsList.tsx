import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Card, CardBody } from "@nextui-org/card";
import { useMatomo } from "@datapunt/matomo-tracker-react";

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
  const navigate = useNavigate();
  const { trackEvent } = useMatomo();
  const dispatch = useContext(DispatchContext);

  if (!pb.authStore.isValid) {
    navigate("/");
  }

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
      type: ActionType.SET_CURRENT_STATE,
      payload: {
        currentPage: "conversations",
        channelId: channelId,
        channelName: channelName,
      },
    };

    dispatch && dispatch(action);
  };

  return (
    <div className="w-full h-screen">
      <div className="w-full flex columns-6">
        {channels.map((channel) => (
          <Card key={channel.id} isBlurred isPressable className="m-5">
            <CardBody
              onClick={() => {
                joinChannel(channel.id, channel.name);
              }}
            >
              <p className="font-bold">{channel.name}</p>
              <p className="italic">{channel.userCount} users</p>
            </CardBody>
          </Card>
        ))}
      </div>
      <Input
        placeholder="Channel name"
        type="text"
        onChange={(e) => handleNewChannelName(e)}
      />
      <Button onClick={() => createNewChannel()}>Create Channel</Button>
    </div>
  );
};

export default ChannelsList;
