import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import socketio from '../../services/socket';
import { Socket } from 'socket.io-client';

interface SocketContextData {
    socket?: Socket;
    connect: () => void;
    authenticate: (data: any) => void;
    create: (data: any) => void;
    message: (data: any) => void;
    join: (data: any) => void;
}

const SocketContext = createContext<SocketContextData>({} as SocketContextData);

const SocketProvider = ({children}) => {

    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {

        if (!socketio.connected) {
            handleConnect()
        }
    }, []);
    const handleMesssage = useCallback((data: any) => {
        socketio.emit("message", data)
    }, []);
    const handleCreateRoom = useCallback((data: any) => {
        console.log("data", data)
        socketio.emit("create-room", data)
        
            socketio.on("created", (arg) => {
                
                console.log("arg", arg)
            })
        
    }, []);
    const handleJoinRoom = useCallback((data: any) => {
        console.log("data", data)
       const ok = socketio.emit("join-room", data)
        if(ok) {
            socketio.on("joined", (arg) => {
                
                console.log("arg", arg)
            })
        }
    }, []);
    const handleAuthenticatedUser = useCallback((data: any) => {
      const ok = socketio.emit("authenticate", data)
        if(ok) {
            socketio.on("authenticated", (arg) => {
                console.log("arg", arg)
            })
        }
    }, []);
    const handleConnect = useCallback(() => {
        const io = socketio.connect();
        setSocket(io);
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connect: handleConnect, authenticate: handleAuthenticatedUser, create: handleCreateRoom, join: handleJoinRoom, message: handleMesssage }}>{children}</SocketContext.Provider>
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