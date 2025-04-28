export interface User {
  _id?: string;
  email: string;
  password?: string;
  name: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}