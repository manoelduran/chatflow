import { UserEntity } from "./UserEntity";



export interface AuthDTO {
    user: UserEntity
    token: string;
    refreshToken?: string;
}