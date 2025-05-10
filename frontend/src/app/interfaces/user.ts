export interface User {
    id: number;
    username: string;
    email: string;
    role: "USER" | "ADMIN";
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface RegisterDto {
    username: string;
    password: string;
    email: string;
}

export interface SessionDto {
    sessionId: string;
    userId: number;
}