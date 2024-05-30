export interface LogInCredentials {
  email: string;
  password: string;
}

export interface UserSuccessfullLogInCredentials {
  access_token: string;
  refresh_token: string;
  userId?: string;
}
