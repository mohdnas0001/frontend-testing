import apiClient from '../apiClient';
import { UserCredentials } from 'types';


export const login = (credentials: UserCredentials) =>
  apiClient.post('/auth/login', credentials);

export const signup = async (data: UserCredentials) => {
  const response = await apiClient.post('/auth/signup', data);
  return response; 
};

