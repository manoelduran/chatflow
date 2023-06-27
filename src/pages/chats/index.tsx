import AnimatedButton from '@/src/components/AnimatedButton';
import AnimatedCard from '@/src/components/AnimatedCard';
import { useAuth } from '@/src/contexts/auth';
import { useChat } from '@/src/contexts/chat';
import { useMessage } from '@/src/contexts/message';
import { useSocket } from '@/src/contexts/socket';
import { api } from '@/src/services/api';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Chats: React.FC = () => {
  //  const [chats, setChats] = useState<string[]>([]);
  const { socket } = useSocket();
  const router = useRouter();
  const {fetchChatId} = useMessage();
  const { chats, joinChat } = useChat()
  const { user, load } = useAuth();
  const hello = () => {
    socket?.on("hello", (arg) => {
      console.log(arg); // true
    });
    socket?.emit("pao", "ovo")
    socket?.on("disconnect", () => {
      console.log(socket?.connected); // false
    }
    )
  };

  const handleEnterChat = useCallback( (chat_id: string | undefined) => {
    if (chat_id) {
      fetchChatId({chat_id})
      router.push(`/chat/${chat_id}`);
    }
  }, []);
  console.log('useruseruseruseruseruseruseruser', user)
  useEffect(() => {
    if (socket !== undefined) {
      hello();
    }
  }, [socket])
  const handleJoinChat = useCallback(async (chat_id: string | undefined) => {
    if (chat_id) {
      await joinChat({ chat_id })
      console.log(`Joining ${chat_id}`);
    }
  }, []);

  const list = useMemo(() => {
    if (!chats) {
      return []
    }
    return chats
  }, [chats, user])
  return (
    <div className="w-full overflow-y-auto max-h-screen px-10 py-10 flex flex-col items-center">
      <div className="w-full h-100 flex items-start justify-between">
        <h1 className="text-2xl font-bold mb-6 ">ChatFlow</h1>
      </div>
      <div className="w-full h-100 flex items-start justify-end ">
        <AnimatedButton type="button" style="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" path='/create-chat' text='Create Chat' />
        <AnimatedButton type="button" style="bg-indigo-500 text-white font-bold py-2 px-4 ml-5 rounded focus:outline-none focus:shadow-outline" path='/' text='Logout' />
        </div>
      <div className="w-full h-100 flex items-start justify-between">
        <span className="text-2xl font-bold mb-6">Want to talk with someone? Just create your chat and enjoy!</span>
      </div>
      <div className=" rounded  py-6">
        <h2 className="text-2xl font-bold mb-6">Our Chats</h2>
        {list ? (
          <div className="grid gap-20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {list?.map((chat, index) => (
                  <AnimatedCard
                key={chat.id}
                createdBy={chat.owner_id}
                name={chat.name}
                totalUsers={2}
                enter={() => handleEnterChat(chat.id)}
                join={() => handleJoinChat(chat.id)}
                />
            ))}
          </div>
        ) : (
          <p>No chats available.</p>
        )}
      </div>
    </div>
  );
};

export default Chats;



/*
<div className="flex items-center">
<span className="mr-2">{chat.name}</span>
{user.user.id === chat.owner_id &&
  <button
    onClick={() => handleEnterChat(chat.id)}
    className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  >
    Enter Chat
  </button>
}
<button
  onClick={() => handleJoinChat(chat.id)}
  className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
>
  Join Chat
</button>
</div>
*/

