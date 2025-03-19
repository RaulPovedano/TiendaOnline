export interface User {
  _id?: string;
  email: string;
  password?: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 