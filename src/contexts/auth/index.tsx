import React, { SetStateAction, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/src/services/api';
import decode from 'jwt-decode';
import { SignInDTO } from '@/src/dtos/user/SignInDTO';
import { UserEntity } from '../../dtos/user/UserEntity';
import { AuthDTO } from '@/src/dtos/user/AuthDTO';
import { SignUpDTO } from '@/src/dtos/user/SignUpDTO';
import { useRouter } from 'next/router';

interface TokenData {
    iat: number;
    exp: number;
    sub: string;
    owner_id: string;
    username: string;
    email: string;
}
interface AuthContextData {
    user: AuthDTO | undefined;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    signIn: (data: SignInDTO) => Promise<AuthDTO>;
    signUp: (data: SignUpDTO) => Promise<void>;
    load: () => Promise<void>
    signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({ children }: any) => {
    const router = useRouter();
    const [authUser, setAuthUser] = useState<AuthDTO | undefined>(undefined);
    const [loading, setLoading] = useState(true)
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
                api.defaults.headers.Authorization = `Bearer ${refreshToken}`;

              /*  const response = await api.post('refreshToken', {
                    sub,
                    owner_id,
                });

                */
               // localStorage.setItem('@Chatflow:refreshToken', response.data);
                //localStorage.setItem('@Chatflow:Token', refreshToken);
                accessToken = refreshToken;
            } else {
                api.defaults.headers.Authorization = `Bearer ${accessToken}`;
            }

            const response = await api.get(`users/show/${owner_id}`);
            console.log('response ponto data', response.data)
            setAuthUser({
                token: accessToken as string,
                user:  response?.data,
            });
        } catch (error: any) {
            if(error?.response?.status === 401 ) {
                handleSignOut();
                router.push('/')
            }
        }
    }

    const handleSignIn = useCallback(async (data: SignInDTO) => {
        const response = await api.post("/users/auth", data)
        console.log('AUTH', response.data)
        localStorage.setItem("@Chatflow:Token", JSON.stringify(response.data.value.token))
        localStorage.setItem('@Chatflow:refreshToken', JSON.stringify(response.data.value.refreshToken))
        api.defaults.headers.Authorization = `Bearer ${response.data.value.token}`;
        setAuthUser(response.data.value);
        console.log('response', response.data.value)
        return response.data.value
    }, []);
    const handleSignOut = useCallback(() => {
        localStorage.removeItem("@Chatflow:Token")
        localStorage.removeItem('@Chatflow:refreshToken')
        setAuthUser(undefined);
        api.defaults.headers.Authorization = null;
        router.push('/')
    }, []);
    useEffect(() => {
        if(loading) {
            loadData()
        }
        setLoading(false)
    }, [loading])
    return (
        <AuthContext.Provider value={{ user: authUser, signUp: handleSignUp, signIn: handleSignIn, load: loadData, signOut: handleSignOut, loading , setLoading}}>{children}</AuthContext.Provider>
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