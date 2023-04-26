import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import socketio from '../../services/socket';
import { Socket } from 'socket.io-client';

interface SocketContextData {
    socket?: Socket;
    connect: () => void;
    message: (data: string) => void;
}

const SocketContext = createContext<SocketContextData>({} as SocketContextData);

const SocketProvider = ({children}) => {

    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {

        if (!socketio.connected) {
            handleConnect()
        }
    }, []);
    const handleMesssage = useCallback((data: string) => {
        socketio.emit("message", data)
    }, [])
    const handleConnect = useCallback(() => {
        const io = socketio.connect();
        setSocket(io);
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connect: handleConnect, message: handleMesssage }}>{children}</SocketContext.Provider>
    );
};

function useSocket(): SocketContextData {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    return context;
}

export { SocketProvider, useSocket };