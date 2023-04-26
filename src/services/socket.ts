import socketio from 'socket.io-client';

const socket = socketio("http://localhost:3333", {
    autoConnect: false,
    transports: ['websocket'],
    secure: false,
    path: '/apiws/socket.io',
    rejectUnauthorized: false
  });
  export default socket;