import '@/src/styles/globals.css'
import type { AppProps } from 'next/app'
import { SocketProvider } from '../contexts/socket'

export default function App({ Component, pageProps }: AppProps) {
  return  (
  <SocketProvider>
  <Component {...pageProps} />
</SocketProvider> )
}
