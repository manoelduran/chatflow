import AnimatedButton from '@/src/components/AnimatedButton';
import { useSocket } from '@/src/contexts/socket';
import { ChatEntity } from '@/src/dtos/chat/ChatEntity';
import { api } from '@/src/services/api';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { useState, useRef, useEffect } from 'react';

type ChatProps = {
  chat: ChatEntity;
};

const Chat: NextPage<ChatProps> = ({ chat }): JSX.Element => {
    console.log('chat', chat)
    const { socket } = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const messageListRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      console.log(newMessage)
      socket?.emit("message", { newMessage })
      api.post("/send", { newMessage })
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto max-h-screen px-10 py-10 flex flex-col items-center">
        <div className="w-full flex items-center justify-end">
    <AnimatedButton type="button" style="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"  text='Back' />
    </div>
      <div className="bg-white shadow-md rounded px-8 py-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Chat Title</h2>
        <div
          ref={messageListRef}
          className="max-h-64 overflow-y-auto bg-gray-200 p-4 mb-4"
        >
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};


export const getServerSideProps: GetServerSideProps = async context => {
  const chat_id = context.params.id as ParsedUrlQuery | undefined;

  try {

    const { data } = await api.get(`/chats/show/${chat_id}`);

    return {
      props: {
        chat: data,
      },
    };
  } catch (err) {
  console.log('error', err)
  return {
    redirect: {
        destination: '/',
        statusCode: 307
    }
}
  }
};

export async function generateStaticParams() {
    const response = await  api.get("/chat")
    const chats = response.data as ChatEntity[];
    console.log('chatss', chats)
    return chats.map((chat: ChatEntity) => ({
        id: chat.id,
      }));
  }

export default Chat;