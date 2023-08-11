import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/src/services/api';
import decode from 'jwt-decode';
import { SignInDTO } from '@/src/dtos/user/SignInDTO';
import { UserEntity } from '../../dtos/user/UserEntity';
import { AuthDTO } from '@/src/dtos/user/AuthDTO';
import { SignUpDTO } from '@/src/dtos/user/SignUpDTO';


interface ToastData {
   
}
interface ToastContextData {
    user: AuthDTO;
    signIn: (data: SignInDTO) => Promise<AuthDTO>;
    signUp: (data: SignUpDTO) => Promise<void>;
    load: () => Promise<void>
    signOut: () => void;
}

const AuthContext = createContext<ToastContextData>({} as ToastContextData);

const AuthProvider = ({ children }: any) => {

    const [authUser, setAuthUser] = useState<AuthDTO>({} as AuthDTO);
    const handleSignUp = useCallback(async (data: SignUpDTO) => {
        await api.post("/users", data)
    }, [])
    async function loadData() {
        try {
            const token =  localStorage.getItem('@Chatflow:Token');
            const refreshToken =  localStorage.getItem('@Chatflow:refreshToken');

            let accessToken = JSON.parse(token as string);

            const { sub, email, owner_id, username, exp } = decode<TokenData>(JSON.parse(token as string));
            if (Date.now() >= exp * 1000) {
                api.defaults.headers.authorization = `Bearer ${refreshToken}`;

              /*  const response = await api.post('refreshToken', {
                    sub,
                    owner_id,
                });

                */
               // localStorage.setItem('@Chatflow:refreshToken', response.data);
                //localStorage.setItem('@Chatflow:Token', refreshToken);
                accessToken = refreshToken;
            } else {
                api.defaults.headers.authorization = `Bearer ${token}`;
            }

            const response = await api.get<UserEntity>(`users/show/${owner_id}`);

            setAuthUser({
                token: accessToken as string,
                user:  response?.data ,
            });
        } catch (error: any) {
            if(error?.response?.status === 401) {
                handleSignOut();
            }
        }
    }
    const handleSignIn = useCallback(async (data: SignInDTO) => {
        const response = await api.post("/users/auth", data)
        localStorage.setItem("@Chatflow:Token", JSON.stringify(response.data.value.token))
        localStorage.setItem('@Chatflow:refreshToken', JSON.stringify(response.data.value.refreshToken))
        api.defaults.headers.authorization = `Bearer ${response.data.value.token}`;
        setAuthUser(response.data.value);
  
        return response.data.value
    }, []);
    const handleSignOut = useCallback(() => {
        localStorage.removeItem("@Chatflow:Token")
        localStorage.removeItem('@Chatflow:refreshToken')
        setAuthUser({} as AuthDTO);

    }, []);
    useEffect(() => {
        loadData()
    }, [])
    return (
        <AuthContext.Provider value={{ user: authUser, signUp: handleSignUp, signIn: handleSignIn, load: loadData, signOut: handleSignOut }}>{children}</AuthContext.Provider>
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