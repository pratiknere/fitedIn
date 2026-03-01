export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'TRAINER' | 'GYM' | 'ADMIN';
}

export interface LoginResponse {
  userId: string;
  name: string;
  email: string;
  role: 'TRAINER' | 'GYM' | 'ADMIN';
  accessToken: string;
  tokenType: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  role: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'TRAINER' | 'GYM' | 'ADMIN';
}
