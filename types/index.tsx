export interface Item {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  username: string;
  setUsername: (username: string) => void;
  clearUser: () => void;
}
