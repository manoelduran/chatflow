import { ChatEntity } from '@/src/dtos/chat/ChatEntity';
import { api } from '@/src/services/api';
import React, { useState, useRef, useEffect } from 'react';

const Chat: React.FC = (params) => {
    console.log('params', params)
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const messageListRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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

export async function generateStaticParams() {
    const response = await  api.get("/chat")
    const chats = response.data as ChatEntity[];
    console.log('chatss', chats)
    return chats.map((chat: ChatEntity) => ({
        id: chat.id,
      }));
  }

export default Chat;