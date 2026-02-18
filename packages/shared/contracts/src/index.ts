export type User = {
  id?: number;
  nome: string;
  email: string;
  phone: string;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ExecuteUsersResponse = {
  users: User[];
};

export type ClearUsersResponse = {
  cleared: true;
};
