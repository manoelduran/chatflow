import AnimatedButton from '@/src/components/AnimatedButton';
import { useChat } from '@/src/contexts/chat';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';

const Chats: React.FC = () => {
//  const [chats, setChats] = useState<string[]>([]);
  const router = useRouter();
  const {chats, joinChat} = useChat()
  const handleJoinChat = useCallback(async (chat_id: string | undefined) => {
      if(chat_id) {
        await joinChat({chat_id})
        console.log(`Joining ${chat_id}`);
      }
  }, []);
  const list = useMemo(() => {
    if(!chats) {
      return []
    }
    return chats
  }, [chats])
  return (
    <div className="w-full h-screen px-10 py-10 flex flex-col items-center">
      <div className="w-full h-100 flex items-start justify-between">
      <h1 className="text-2xl font-bold mb-6">ChatFlow</h1>
      <AnimatedButton type="button" style="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" path='/create-chat' text=' Create Chat' />
      </div>
      <div className="w-full h-100 flex items-start justify-between">
      <span className="text-2xl font-bold mb-6">Want to talk with someone? Just create your chat and enjoy!</span>
      </div>
      <div className=" rounded px-8 py-6">
        <h2 className="text-2xl font-bold mb-6">Your Chats</h2>
        {list ? (
          <ul className="space-y-4">
            {list?.map((chat, index) => (
              <li key={index}>
                <div className="flex items-center">
                  <span className="mr-2">{chat.name}</span>
                  <button
                    onClick={() => handleJoinChat(chat.id)}
                    className="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Join Chat
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No chats available.</p>
        )}
      </div>
    </div>
  );
};

export default Chats;


