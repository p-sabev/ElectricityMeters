export interface LogInCredentials {
  email: string;
  password: string;
}

export interface UserSuccessfullLogInCredentials {
  token: string;
  roles: string[];
  // refresh_token: string;
  userId?: string;
}
