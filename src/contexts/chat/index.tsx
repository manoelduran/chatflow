import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/src/services/api';
import { ChatEntity } from '@/src/dtos/chat/ChatEntity';
import { CreateChatDTO } from '@/src/dtos/chat/CreateChatDTO';
import { JoinChatDTO } from '@/src/dtos/chat/JoinChatDTO';
import { useAuth } from '../auth';

interface ChatContextData {
    chats?: {chat: ChatEntity, totalUsers: number, owner: string}[];
    createChat: (data: CreateChatDTO) => Promise<void>;
    joinChat: (data: JoinChatDTO) => Promise<void>;
    chatList: () => Promise<{chat: ChatEntity, totalUsers: number, owner: string}[]>
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

const ChatProvider = ({children}: any) => {
    const [chats, setChats] = useState<{chat: ChatEntity, totalUsers: number, owner: string}[]>([] as {chat: ChatEntity, totalUsers: number,owner: string}[]);
    const chatList = useCallback(async () => {
        const response = await api.get<{chat: ChatEntity, totalUsers: number,owner: string}[]>("/chats")
        setChats(response.data.value);
        return response.data.value
    }, []);
    const handleCreateChat = useCallback(async ({name, token}: CreateChatDTO) => {
         await api.post("/chats", {name: name}, {headers: {Authorization: `Baerer ${token}`}})
       await chatList()
    }, []);
    const handleJoinChat = useCallback(async(data: JoinChatDTO) => {
         await api.post(`/chats/join/${data.chat_id}`)
    }, []);
 useEffect(() => {
        chatList()
 }, [])
    return (
        <ChatContext.Provider value={{ chats, createChat: handleCreateChat, joinChat: handleJoinChat, chatList }}>{children}</ChatContext.Provider>
    );

};

function useChat(): ChatContextData {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }

    return context;
}

export { ChatProvider, useChat };