import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/src/services/api';
import { SignInDTO } from '@/src/dtos/user/SignInDTO';
import { AuthDTO } from '@/src/dtos/user/AuthDTO';
import { SignUpDTO } from '@/src/dtos/user/SignUpDTO';

interface AuthContextData {
    user: AuthDTO;
    signIn: (data: SignInDTO) => Promise<AuthDTO>;
    signUp: (data: SignUpDTO) => Promise<void>;
    signOut: (data: string) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({children}: any) => {

    const [authUser, setAuthUser] = useState<AuthDTO>({} as AuthDTO);

    const handleSignUp = useCallback(async (data: SignUpDTO) => {
       await api.post("/users", data)
    }, [])
    const handleSignIn = useCallback(async (data: SignInDTO) => {
        const response = await  api.post("/users/auth", data)
        setAuthUser(response.data.value);
        return response.data.value
    }, []);
    const handleSignOut = useCallback(() => {
        setAuthUser({} as AuthDTO);
    }, []);
    return (
        <AuthContext.Provider value={{ user: authUser,signUp: handleSignUp,  signIn: handleSignIn, signOut: handleSignOut }}>{children}</AuthContext.Provider>
    );
};

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }

    return context;
}

export { AuthProvider, useAuth };