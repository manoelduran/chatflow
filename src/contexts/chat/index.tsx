import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/src/services/api';
import { ChatEntity } from '@/src/dtos/chat/ChatEntity';
import { CreateChatDTO } from '@/src/dtos/chat/CreateChatDTO';
import { JoinChatDTO } from '@/src/dtos/chat/JoinChatDTO';

interface ChatContextData {
    chats?: ChatEntity[];
    createChat: (data: CreateChatDTO) => Promise<void>;
    joinChat: (data: JoinChatDTO) => Promise<void>;
    chatList: () => Promise<ChatEntity[]>
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

const ChatProvider = ({children}: any) => {
    const [chats, setChats] = useState<ChatEntity[]>([] as ChatEntity[]);

    const chatList = useCallback(async () => {
        const response = await api.get<ChatEntity[]>("/chats")
        setChats(response.data);
        return response.data
    }, []);
    const handleCreateChat = useCallback(async ({name, token}: CreateChatDTO) => {
        const response = await api.post("/chats", {name: name}, { headers: { Authorization: `Bearer ${token}` } })

        setChats([...chats, response.data]);
    }, []);
    const handleJoinChat = useCallback(async(data: JoinChatDTO) => {
        const response = await api.post(`/join/${data.chat_id}`)
    }, []);
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