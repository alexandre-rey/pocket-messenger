import React, { useContext, useEffect, useState } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";

import pb from "../pocketbase";
import { CurrentStateContext } from "../state/state.context";

interface Message {
  id: string;
  content: string;
  expand: {
    sentBy: {
      id: string;
      name: string;
      avatar: string;
    };
  };
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { trackEvent } = useMatomo();
  const currentState = useContext(CurrentStateContext);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const resultList = await pb
          .collection("messages")
          .getFullList<Message>({
            filter: `channel='${currentState.channelId}'`,
            expand: "sentBy",
            sort: "created",
          });

        setMessages(resultList);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
  }, [currentState.channelId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection("messages").create({
        content: newMessage,
        channel: currentState.channelId,
        sentBy: pb.authStore.model?.id,
      });
      setNewMessage("");
      // Fetch updated messages
      const resultList = await pb.collection("messages").getFullList<Message>({
        filter: `channel='${currentState.channelId}'`,
        expand: "sentBy",
        sort: "created",
      });

      trackEvent({
        category: "Channels",
        action: "message-send",
        name: currentState.channelId,
      });

      setMessages(resultList);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div>
      <h2 className="font-bold m-4">{currentState.channelName}</h2>
      <div className="flex flex-col">
        {messages.map((message) => (
          <div key={message.id} className="m-2">
            <div className="flex">
              <img
                alt="avatar"
                className="w-10 h-10 cover rounded-full"
                src={
                  "http://127.0.0.1:8090/api/files/users/" +
                  message.expand.sentBy.id +
                  "/" +
                  message.expand.sentBy.avatar
                }
              />
              <strong>{message.expand.sentBy.name}</strong>
            </div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>
      <form className="flex p-2" onSubmit={sendMessage}>
        <input
          placeholder="Type your message"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="ml-2" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
