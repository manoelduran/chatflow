import AnimatedButton from '@/src/components/AnimatedButton';
import { useAuth } from '@/src/contexts/auth';
import { useChat } from '@/src/contexts/chat';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const CreateChat: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth()
  const {createChat } = useChat()
  const [name, setName] = useState('');

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('name')
  await  createChat({name, token: user.token as string})
      router.push('/chats');
      setName('');
  };

  return (
    <div className="w-full  min-h-screen px-10 py-10 flex flex-col items-center bg-gray-100">
    <div className="w-full flex items-center justify-end">
    <AnimatedButton type="button" style="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"  text='Back' />
    </div>

    <div className="flex items-center justify-center  pt-20 bg-gray-100">
      <div className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Create Chat</h2>
        <form className="space-y-4" onSubmit={handleCreateChat}>
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
            <AnimatedButton type="submit" style="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" text=' Create' />
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default CreateChat;