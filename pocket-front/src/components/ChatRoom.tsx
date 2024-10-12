import React, { useContext, useEffect, useState } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";

import pb from "../pocketbase";
import { CurrentStateContext } from "../state/state.context";
import "../styles/chat.room.css";
import { formatDateStr } from "@/utils";

interface Message {
  id: string;
  content: string;
  created: string;
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
    <div className="chatroom_container">
      <h2>{currentState.channelName}</h2>
      <div className="chatroom_conversation">
        {messages.map((message) => (
          <div key={message.id} className="chatroom_message_container">
            <div className="chatroom_avatar_container">
              <img
                alt="avatar"
                className="avatar"
                src={
                  "http://127.0.0.1:8090/api/files/users/" +
                  message.expand.sentBy.id +
                  "/" +
                  message.expand.sentBy.avatar
                }
              />
            </div>
            <div className="chatroom_message">
                <span className="chatroom_message_header"><strong>{message.expand.sentBy.name}</strong><p>{'  ' + formatDateStr(message.created)}</p></span>
                <p className="chatroom_message_content">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chatroom_send_message">
        <input
          placeholder="Type your message"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
