import socketio from 'socket.io-client';

const socket = socketio(`${process.env.NEXT_PUBLIC_API_URL}`, {
    autoConnect: false,
    transports: ['websocket'],
    secure: false,
    path: '/apiws/socket.io',
    rejectUnauthorized: false
  });
  export default socket;