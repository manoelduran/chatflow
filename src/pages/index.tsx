import { Inter } from 'next/font/google'
import socket from '../services/socket'
import { useSocket } from '../contexts/socket'
import { api } from '../services/api';
import { useCallback, useEffect, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation';
import AnimatedButton from '../components/AnimatedButton';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/auth';
import { SignInDTO } from '../dtos/user/SignInDTO';


export default function Home() {
  const { socket } = useSocket()
  const { signIn } = useAuth()
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const handleMessage = () => {
    console.log(message)
    socket?.emit("message", { message })

    api.post("/send", { message })
  }
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
  useEffect(() => {
    if (socket !== undefined) {
      hello()
    }
  }, [socket])
  const handleSignIn = useCallback(async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setLoading(true);
      const parsedData = { email, password } as SignInDTO;
      const response = await signIn(parsedData)
      if (response.token) {
        router.push('/chats');
      }
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    } finally {
      setLoading(false);
    }

  }, [email, password, loading]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <form className="space-y-4 mb-2" onSubmit={handleSignIn}>
            <div>
              <label htmlFor="email" className="block font-bold mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-bold mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <AnimatedButton type="submit" style="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" path='/home' text='Sign In' />
            </div>
          </form>
          <AnimatedButton type="button" path='/create-user' text=' Create Account' />
        </div>
      )
      }
    </div>
  );
}


