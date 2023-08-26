import socketio from 'socket.io-client';

const socket = socketio(`${process.env.NEXT_PUBLIC_API_URL}`, {
    autoConnect: false,
    transports: ['websocket'],
    
    secure: true,
    path: '/apiws/socket.io',
    rejectUnauthorized: false
  });
  export default socket;