import AnimatedButton from '@/src/components/AnimatedButton';
import * as Yup from 'yup';
import { Input } from '@/src/components/Input';
import { useAuth } from '@/src/contexts/auth';
import { SignUpDTO } from '@/src/dtos/user/SignUpDTO';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useRouter } from 'next/router';
import React, { useCallback, useRef, useState } from 'react';
import { canCreateUser } from './validations';
import getValidationErrors from '@/src/utils/getValidationErrors';
import { toast } from 'react-toastify';

const CreateUser: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const router = useRouter();
  const {signUp} = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignUp = useCallback(async (data: SignUpDTO) => {
    setLoading(true)
    try{
      formRef.current?.setErrors([]);
     await canCreateUser(data)
     await signUp({email: data.email, password: data.password, username: data.username})
        toast.success("User created successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
     router.push('/');
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
   }, [loading ]);

  return (
    <div className="w-full  min-h-screen px-10 py-10 flex flex-col items-center bg-gray-100">
       <div className="w-full flex items-center justify-end">
       <AnimatedButton type="button" style="bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"  text='Back' />
       </div>

    <div className="flex items-center justify-center pt-20 bg-gray-100">
      <div className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        <Form ref={formRef} className="space-y-4" onSubmit={handleSignUp}>
              <div>
            <label htmlFor="email" className="block font-bold mb-1">Email</label>
            <Input
              name='email'
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="username" className="block font-bold mb-1">Username</label>
            <Input
              name='username'
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-bold mb-1">Password</label>
            <Input
              name='password'
              placeholder="Choose a password"
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

export default CreateUser;