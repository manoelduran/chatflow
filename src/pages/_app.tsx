import '@/src/styles/globals.css'
import type { AppProps } from 'next/app'
import { SocketProvider } from '../contexts/socket'
import { AuthProvider } from '../contexts/auth'
import { ChatProvider } from '../contexts/chat'
import { MessageProvider } from '../contexts/message'
import { ToastContainer } from 'react-toastify'

export default function App({ Component, pageProps }: AppProps) {
  return  (
    
  <AuthProvider>
    <SocketProvider>
  <ChatProvider>
    <MessageProvider>
    <ToastContainer />
    <Component {...pageProps} />
    </MessageProvider>
  </ChatProvider>
</SocketProvider>
  </AuthProvider>)
}
