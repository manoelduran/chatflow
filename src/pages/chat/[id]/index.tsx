import AnimatedButton from '@/src/components/AnimatedButton';
import { Input } from '@/src/components/Input';
import * as Yup from 'yup';
import LoadingAnimation from '@/src/components/LoadingAnimation';
import { useAuth } from '@/src/contexts/auth';
import { useMessage } from '@/src/contexts/message';
import { useSocket } from '@/src/contexts/socket';
import { ChatEntity } from '@/src/dtos/chat/ChatEntity';
import { CreateMessageDTO } from '@/src/dtos/message/CreateMessageDTO';
import { MessageEntity } from '@/src/dtos/message/MessageEntity';
import { api } from '@/src/services/api';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { format } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import  canCreateMessage  from './validations';
import getValidationErrors from '@/src/utils/getValidationErrors';

type ChatProps = {
  chat: ChatEntity;
};

interface FormCredentials {
  text: string;
}
const Chat: NextPage<ChatProps> = ({ chat }): JSX.Element => {
  const formRef = useRef<FormHandles>(null);
  const { user, signOut , loading, setLoading, load } = useAuth()
  
  const { messages, createMessage, listMessagesByChat } = useMessage()
  const { socket, message } = useSocket();
  const [sending, setSending] = useState(false);

  const handleSendMessage = useCallback(async (data: FormCredentials) => {
    setSending(true)
    try {
      formRef.current?.setErrors([] as never);
      await canCreateMessage(data)
   

      if(user) {
        const parsedData = {
          text: data.text,
          chat_id: chat.id,
          token: user?.token
        } as CreateMessageDTO
        console.log('parsedData',parsedData)
  
        await createMessage(parsedData)
        message(parsedData)
      } 
    } catch (error: any) {
      console.log('error', error)
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);

        return;
      }
      
      if(error?.response?.status === 401) {
        signOut();
      }
      setSending(false)
    } finally {
      setSending(false)
    }
  }, [sending, loading, user]);
  const list = useMemo(() => {
    if (!messages) {
      return []
    }
    console.log('messages', messages)
    return messages?.map(({message, owner}: {message: MessageEntity, owner: string}) => {
   
      return {
        ...message,
        myMessage: message.userId === user?.user?.id && message.text,
        owner: owner,
        othersMessages: message.userId !== user?.user?.id && message.text,
        formattedSendAt: format(new Date(message?.sentAt as Date), 'HH:mm')
      }
    })
  }, [messages, user, loading])
  


  useEffect(() => {
    if(chat) {
      listMessagesByChat({chat_id: chat.id as string})
    }
  }, [chat]);

  useEffect(() => {
    socket?.on("sent", (arg) => {
      console.log("arg da msg", arg)
      listMessagesByChat({chat_id: chat.id as string})
  })
  }, [socket])
useEffect(() => {
  if (typeof window !== 'undefined' && list !== undefined) {
    
    const messageContainer = document?.getElementById('messageContainer')
    const scrollToBottom =  () => {
      messageContainer?.scrollTo({
       top: messageContainer?.scrollHeight,
       behavior: 'smooth',
     });
   };
  
    scrollToBottom()
  }

}, [list])
useEffect(() => {
  console.log('user', user)
      if(!user) {
        load()
        setLoading(false)
      }
}, [loading, user])
  return (
    <>
    {loading ? (    <LoadingAnimation />) : (<>
      <div className="w-full overflow-y-auto max-h-screen px-10 py-10 flex flex-col items-center">
      <div className="w-full flex items-center justify-end">
        <AnimatedButton type="button" style="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" text='Back' />
      </div>
      <div className="w-full overflow-y-auto bg-white shadow-md rounded px-8 py-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">{chat.name}</h2>
        <div
        id='messageContainer'
          className="w-full max-h-64 overflow-y-auto bg-gray-200 p-4 mb-4"
        >
          {list && user && list?.map((message: any) => (
            <>
              {message.userId === user?.user?.id ? (
                <div id='messageContainer'  key={message.id} className="w-full h-fit  align-middle flex justify-end  mb-4">
                  <div className="w-fit flex  flex-col  bg-green-200 align-middle rounded-lg py-2 px-4 text-gray-800">
                    <p  >{message.owner}</p>
                    <p  >{message.myMessage}</p>
                    <p className="text-end">{message.formattedSendAt}</p>
                  </div>
                </div>
              ) : (
                <div id='messageContainer' key={message.id} className="w-fit flex flex-col justify-start  mb-4">
                  <div className="bg-red-200  rounded-lg py-2 px-4 text-gray-800 mb-1">
                  <p  >{message.owner}</p>
                    <p >{message.othersMessages}</p>
                    <p className="text-end">{message.formattedSendAt}</p>
                  </div>

                </div>
              )}
            </>
          ))}
        </div >
        {sending ? <LoadingAnimation /> : (<div className="flex">
          <Form ref={formRef} className="space-y-4" onSubmit={handleSendMessage}>
            <Input
              name='text'
              placeholder='Type a message.'
            />
            <div>
              <AnimatedButton type="submit" style="bg-indigo-500 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline" text='Send' />
            </div>
          </Form>
        </div>)}
      </div>
    </div>
    </>)}
    </>
  );
};


export const getServerSideProps: GetServerSideProps = async context => {
  const chat_id = context?.params?.id as ParsedUrlQuery | undefined;
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