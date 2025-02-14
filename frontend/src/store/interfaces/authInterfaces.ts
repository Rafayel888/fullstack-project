export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  isAuth: boolean;
  user: UserDto | null;
  errors: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: string;
  };
  errorEmail: string;
  status: 'idle' | 'loading' | 'loaded' | 'error';
}

export interface RegistrationParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}
