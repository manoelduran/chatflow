import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/src/services/api';
import { MessageEntity } from '@/src/dtos/message/MessageEntity';
import { MessagesByChatDTO } from '@/src/dtos/message/MessagesByChatDTO';
import { CreateMessageDTO } from '@/src/dtos/message/CreateMessageDTO';
import { DeleteMessageDTO } from '@/src/dtos/message/DeleteMessageDTO';
import { EditMessageDTO } from '@/src/dtos/message/EditMessageDTO';
import { FetchChatIdDTO } from '@/src/dtos/message/FetchChatIdDTO';
import socket from '@/src/services/socket';

interface MessageContextData {
    messages?: {message: MessageEntity, owner: string}[];
    chatId?: string | undefined;
    createMessage: (data: CreateMessageDTO) => Promise<void>;
    deleteMessage: (data: DeleteMessageDTO) => Promise<void>;
    editMessage: (data: EditMessageDTO) => Promise<void>;
    listMessagesByChat: (data: MessagesByChatDTO) => Promise<{message: MessageEntity, owner: string}[]>;
    fetchChatId: (data: FetchChatIdDTO) => Promise<void>;
}

const MessageContext = createContext<MessageContextData>({} as MessageContextData);

const MessageProvider = ({children}: any) => {
    const [messages, setMessages] = useState<{message: MessageEntity, owner: string}[]>([] as {message: MessageEntity, owner: string}[]);
    const [chatId, setChatId] = useState<string | undefined>(undefined);

    const messagesByChat = useCallback(async ({chat_id}: MessagesByChatDTO) => {
       if(!chat_id) {
  return []
       }
       const response = await api.get<{message: MessageEntity, owner: string}[]>(`/messages/${chat_id}`)
       console.log('mensagens', response.data)
       setMessages(response.data);
       return response.data;
    }, [messages, chatId, socket]);
    const handleFetchChatId = useCallback(async (data: FetchChatIdDTO) => {
        if(data.chat_id) {
            setChatId(data.chat_id);
        };
    }, [])
    const handleCreateMessage = useCallback(async (data: CreateMessageDTO) => {
        const response = await api.post(`/messages/${data.chat_id}`, {text: data.text}, {headers: {Authorization: `Baerer ${data.token}`}})
        if(response.status === 201) {
            messagesByChat({chat_id: data.chat_id})
        }
    }, []);
    const handleDeleteMessage = useCallback(async(data: DeleteMessageDTO) => {
        const response = await api.post(`/join/${data.chat_id}`)
    }, []);
    const handleEditMessage = useCallback(async(data: EditMessageDTO) => {
        const response = await api.post(`/join/${data.chat_id}`)
    }, []);

    return (
        <MessageContext.Provider value={{ messages, chatId, fetchChatId: handleFetchChatId, createMessage: handleCreateMessage, editMessage: handleEditMessage, deleteMessage: handleDeleteMessage, listMessagesByChat: messagesByChat }}>{children}</MessageContext.Provider>
    );

};

function useMessage(): MessageContextData {
    const context = useContext(MessageContext);

    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }

    return context;
}

export { MessageProvider, useMessage };