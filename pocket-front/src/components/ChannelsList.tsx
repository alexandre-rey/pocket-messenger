// src/components/ChannelsList.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Listbox, ListboxItem } from "@nextui-org/listbox";

import pb from "../pocketbase";

interface Channel {
  id: string;
  name: string;
}

const ChannelsList = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannel, setNewChannel] = useState("");
  const navigate = useNavigate();

  if (!pb.authStore.isValid) {
    navigate("/");
  }

  const logout = () => {
    pb.authStore.clear();
    navigate("/");
  };

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const resultList = await pb
          .collection("channels")
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
    try {
      await pb.collection("channels").create({
        name: newChannel,
        isPublic: true,
      });
      setNewChannel("");
      // Fetch updated channels
      const resultList = await pb.collection("channels").getFullList<Channel>();

      setChannels(resultList);
    } catch (error) {
      console.error("Failed to create channel", error);
    }
  };

  return (
    <div>
      <Button onClick={() => logout()}>Logout</Button>
      <h2>Channels</h2>
      <Listbox>
        {channels.map((channel) => (
          <ListboxItem key={channel.id}>
            <Link to={`/channels/${channel.id}`}>{channel.name}</Link>
          </ListboxItem>
        ))}
      </Listbox>
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
