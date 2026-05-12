export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
};

export type MeResponse = {
  message: string;
  data: {
    user: User;
  };
};