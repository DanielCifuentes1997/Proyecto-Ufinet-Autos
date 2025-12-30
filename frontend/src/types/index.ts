export interface Car {
    id?: number;
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    photoUrl?: string | null;
}

export interface User {
    id: number;
    username: string;
    fullName: string;
}

export interface AuthResponse {
    token: string;
}