import apiClient from '../apiClient';

export interface UserCredentials {
  username: string;
  password: string;
}

export const login = (credentials: UserCredentials) =>
  apiClient.post('/auth/login', credentials);

export const signup = (data: UserCredentials) =>
  apiClient.post('/auth/signup', data);
