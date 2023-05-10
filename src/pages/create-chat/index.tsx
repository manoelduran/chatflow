import AnimatedButton from '@/src/components/AnimatedButton';
import { useAuth } from '@/src/contexts/auth';
import { useChat } from '@/src/contexts/chat';
import { CreateChatDTO } from '@/src/dtos/chat/CreateChatDTO';
import { api } from '@/src/services/api';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const CreateChat: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth()
  const {createChat } = useChat()
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  await  createChat({name, token: user.refreshToken as string})
      router.push('/chats');
      setName('');

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Create Chat</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block font-bold mb-1">Name</label>
            <input
              type="text"
              id="Name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              placeholder="Enter your chat name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <AnimatedButton type="submit" style="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" path='/create-chat' text=' Create' />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChat;