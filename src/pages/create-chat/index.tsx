import AnimatedButton from '@/src/components/AnimatedButton';
import * as Yup from 'yup';
import { Input } from '@/src/components/Input';
import { useAuth } from '@/src/contexts/auth';
import { useChat } from '@/src/contexts/chat';
import getValidationErrors from '@/src/utils/getValidationErrors';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/router';
import React, { useCallback, useRef, useState } from 'react';
import { canCreateChat } from './validations';
import { useSocket } from '@/src/contexts/socket';
import { toast } from 'react-toastify';
interface formCredentials {
  text: string;
}
const CreateChat: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { create } = useSocket();
  console.log('user', user)
  const { createChat } = useChat()
  const [loading, setLoading] = useState(false)
  const handleCreateChat = useCallback(async (data: formCredentials) => {
    setLoading(true)
    try {
      formRef.current?.setErrors([]);
      await canCreateChat(data)
      console.log('user token', user.token)
      await createChat({ name: data.text, token: user.token as string })
      toast.success("Chat created successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      create({ data, user })
      router.push('/chats');
    } catch (error) {
      console.log('error', error)
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        console.log('errors', errors)
        formRef.current?.setErrors(errors);
        toast.error("Try again!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

    } finally {
      setLoading(false)
    }
  }, [loading])

  return (
    <div className="w-full  min-h-screen px-10 py-10 flex flex-col items-center bg-gray-100">
      <div className="w-full flex items-center justify-end">
        <AnimatedButton type="button" style="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" text='Back' />
      </div>
      <div className="flex items-center justify-center  pt-20 bg-gray-100">
        <div className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-6">Create Chat</h2>
          <Form ref={formRef} className="space-y-4" onSubmit={handleCreateChat}>
            <div>
              <label className="block font-bold mb-1">Name</label>
              <Input
                name="text"
                placeholder="Enter your chat name"
              />
            </div>
            <div>
              <AnimatedButton type="submit" style="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" text=' Create' />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateChat;