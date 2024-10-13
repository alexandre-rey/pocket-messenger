import React, { useContext, useEffect, useState } from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import pb, { BASE_URL } from '../pocketbase';
import { CurrentStateContext } from '../state/state.context';
import '../styles/chat.room.css';
import { formatDateStr } from '@/utils';
import { UnsubscribeFunc } from 'pocketbase';

interface Message {
  id: string;
  content: string;
  created: string;
  expand: {
    sentBy: {
      id: string;
      username: string;
      avatar: string;
    };
  };
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { trackEvent } = useMatomo();
  const currentState = useContext(CurrentStateContext);
  const messagesListRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let isSubscribed = true;
    let unsubscribe: UnsubscribeFunc | null = null;

    const fetchMessages = async () => {
      try {
        const resultList = await pb
          .collection('messages')
          .getFullList<Message>({
            filter: `channel='${currentState.channelId}'`,
            expand: 'sentBy',
            sort: 'created',
          });

        if (isSubscribed) {
          setMessages(resultList);
        }
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();
    console.log('Subscribing to message updates for channel: ' + currentState.channelId);

    pb.collection('channels')
      .subscribe('*', function (e) {
        console.log('Message updated', e);
        if (e.record.id === currentState.channelId) {
          fetchMessages();
        }
      })
      .then((unsub) => {
        console.log('Subscribed to message updates');
        if (isSubscribed) {
          unsubscribe = unsub;
        } else {
          // Si l'effet a déjà été nettoyé, désabonnez-vous immédiatement
          unsub();
        }
      })
      .catch((error) => {
        console.error('Failed to subscribe to message updates', error);
      });

    return () => {
      isSubscribed = false;
      if (unsubscribe) {
        console.log('Unsubscribing from message updates');
        unsubscribe();
      }
    };
  }, [currentState.channelId]);


  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection('messages').create({
        content: newMessage,
        channel: currentState.channelId,
        sentBy: pb.authStore.model?.id,
      });

      pb.collection('channels').update(currentState.channelId, {
        lastMessage: new Date()
      });

      setNewMessage('');

      trackEvent({
        category: 'Channels',
        action: 'message-send',
        name: currentState.channelId,
      });

    } catch (error) {
      console.error('Failed to send message', error);
    }
  };


  return (
    <div className='chatroom_container'>
      <h2>{currentState.channelName}</h2>
      <div className='chatroom_conversation' ref={messagesListRef}>
        {messages.map((message) => (
          <div key={message.id} className={'chatroom_message_container' + (message.expand.sentBy.username === currentState.username ? ' own_message' : '')}>
            <div className='chatroom_avatar_container'>
              <img
                alt='avatar'
                className='avatar'
                src={
                  BASE_URL + '/api/files/users/' +
                  message.expand.sentBy.id +
                  '/' +
                  message.expand.sentBy.avatar
                }
              />
            </div>
            <div className='chatroom_message'>
              <span className='chatroom_message_header'><strong>{message.expand.sentBy.username}</strong><p>{'  ' + formatDateStr(message.created)}</p></span>
              <p className='chatroom_message_content'>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className='chatroom_send_message'>
        <input
          placeholder='Type your message'
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type='submit'>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
