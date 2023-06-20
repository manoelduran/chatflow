import AnimatedButton from '@/src/components/AnimatedButton';
import { Input } from '@/src/components/Input';
import LoadingAnimation from '@/src/components/LoadingAnimation';
import { useMessage } from '@/src/contexts/message';
import { useSocket } from '@/src/contexts/socket';
import { ChatEntity } from '@/src/dtos/chat/ChatEntity';
import { CreateMessageDTO } from '@/src/dtos/message/CreateMessageDTO';
import { api } from '@/src/services/api';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

type ChatProps = {
  chat: ChatEntity;
};

interface FormCredentials {
  message: string;
}
const Chat: NextPage<ChatProps> = ({ chat }): JSX.Element => {
  const formRef = useRef<FormHandles>(null);
  const { messages, createMessage, listMessagesByChat, chatId } = useMessage()
  const { socket } = useSocket();
  const [sending, setSending] = useState(false);

  const handleSendMessage = useCallback(async (data: FormCredentials) => {
    setSending(true)
    try {
      formRef.current?.setErrors([]);
      const parsedData = {
        text: data.message,
        chat_id: chat.id
      } as CreateMessageDTO
        console.log(parsedData)
         await createMessage(parsedData)
        socket?.emit("message", { parsedData })
    } catch(error: any) {
      console.log('error', error)
      formRef.current?.setErrors(error);
    } finally {
      setSending(false)
    }
  }, []);


  const list = useMemo( () => {
    if (!messages) {
      return []
    }
    console.log('messages', messages)
    return messages.value
  }, [messages])
  return (
    <div className="w-full overflow-y-auto max-h-screen px-10 py-10 flex flex-col items-center">
      <div className="w-full flex items-center justify-end">
        <AnimatedButton type="button" style="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" text='Back' />
      </div>
      <div className="bg-white shadow-md rounded px-8 py-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">{chat.name}</h2>
        <div
          className="max-h-64 overflow-y-auto bg-gray-200 p-4 mb-4"
        >
          {list && list?.map((message, index) => 
            <>
            <p key={message.id}>{message.text}</p>
            <p>{message.sentAt?.toString()}</p>
            </>
          )}
        </div>
        {sending ? <LoadingAnimation/> : (<div className="flex">
        <Form ref={formRef} className="space-y-4" onSubmit={handleSendMessage}>
          <Input
          name='message'
          placeholder='Type a message.'
          />
          <div>
          <AnimatedButton type="submit" style="bg-indigo-500 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline" text='Send' />
          </div>
          </Form>
        </div>)}
      </div>
    </div>
  );
};


export const getServerSideProps: GetServerSideProps = async context => {
  const chat_id = context.params.id as ParsedUrlQuery | undefined;
  console.log("chaaaat id ", chat_id)
  try {

    const { data } = await api.get<ChatEntity>(`/chats/show/${chat_id}`);
console.log('data', data)
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



export default Chat;