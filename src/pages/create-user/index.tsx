import AnimatedButton from '@/src/components/AnimatedButton';
import { useAuth } from '@/src/contexts/auth';
import { api } from '@/src/services/api';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';

const CreateUser: React.FC = () => {
  const router = useRouter();
  const {signUp} = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = useCallback(async (e: React.FormEvent) => {
    try{
     setLoading(true)
     e.preventDefault();
     const parsedData =  { email, username, password }
     const response = await signUp(parsedData)
     router.push('/chats');
     setEmail('');
     setUsername('');
     setPassword('');
    } catch (error) {
     console.log('error', error)
     setLoading(false)
    } finally {
     setLoading(false)
    }
   }, [email, username, password, loading]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="email" className="block font-bold mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block font-bold mb-1">Username</label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-bold mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
          <AnimatedButton type="submit" style="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" path='/create-chat' text=' Create' />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;