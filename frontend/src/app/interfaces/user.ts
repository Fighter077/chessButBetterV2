export interface User {
    id: number;
    username: string;
    email: string;
    role: "USER" | "ADMIN" | "TEMP_USER";
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

export interface CookieAcceptance {
    acceptanceLevel: 'REJECTED' | 'ACCEPTED_FULL' | 'ACCEPTED_PARTIAL';
}