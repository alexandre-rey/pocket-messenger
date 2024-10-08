import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

import pb from "../pocketbase";

interface Message {
  id: string;
  content: string;
  expand: { sentBy: { name: string } };
}

const ChatRoom = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  if (!pb.authStore.isValid) {
    navigate("/");
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const resultList = await pb
          .collection("messages")
          .getFullList<Message>({
            filter: `channel='${id}'`,
            expand: "sentBy",
            sort: "created",
          });

        setMessages(resultList);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
  }, [id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection("messages").create({
        content: newMessage,
        channel: id,
        sentBy: pb.authStore.model?.id,
      });
      setNewMessage("");
      // Fetch updated messages
      const resultList = await pb.collection("messages").getFullList<Message>({
        filter: `channel='${id}'`,
        expand: "sentBy",
        sort: "created",
      });

      setMessages(resultList);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          navigate("/channels");
        }}
      >
        Back to Channels
      </Button>
      <h2>Chat Room</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>{message.expand.sentBy.name}</strong>: {message.content}
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <Input
          placeholder="Type your message"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default ChatRoom;
