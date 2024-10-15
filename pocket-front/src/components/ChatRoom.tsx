import React, { useContext, useEffect, useState } from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import { BASE_URL } from '../pocketbase';
import { CurrentStateContext } from '../state/state.context';
import '../styles/chat.room.css';
import { formatDateStr } from '@/utils';
import { RecordModel, RecordSubscription, UnsubscribeFunc } from 'pocketbase';
import { Message } from '@/interfaces';
import MembersList from './MembersList';
import { Collections, PbUtils } from '@/pb.utils';
import ChannelsMenu from './ChannelsMenu';

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
        const resultList = await PbUtils.getMessages(currentState.channelId);

        if (isSubscribed) {
          setMessages(resultList);
        }
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();
    console.log('Subscribing to message updates for channel: ' + currentState.channelId);

    const callback = (e: RecordSubscription<RecordModel>) => {
      console.log('Message updated', e);
      if (e.record.id === currentState.channelId) {
        fetchMessages();
      }
    }

    PbUtils.subscribeToCollection(Collections.CHANNELS, callback)
      .then((unsub) => {
        console.log('Subscribed to message updates');
        if (isSubscribed) {
          unsubscribe = unsub;
        } else {
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

      if (newMessage === '') {
        return;
      }

      await PbUtils.sendMessage(newMessage, currentState.channelId);

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
    <>
      <ChannelsMenu />
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
        {currentState.channelId !== '' && (
          <form onSubmit={sendMessage} className='chatroom_send_message'>
            <input
              className='chatroom_input'
              placeholder='Type your message'
              type='text'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type='submit'>
              Send
            </button>
          </form>
        )}

      </div>
      <MembersList />
    </>
  );
};

export default ChatRoom;
