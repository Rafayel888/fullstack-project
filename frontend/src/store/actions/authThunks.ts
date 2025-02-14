import { createAsyncThunk } from '@reduxjs/toolkit';
import { setErrors, setErrorEmail } from '../slices/authSlice';
import { api } from '../../utils/api';
import { RegistrationParams } from '../interfaces/authInterfaces';

export const registration = createAsyncThunk(
  'register/axiosRegister',
  async (params: RegistrationParams, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/register', params);
      console.log(data, 'data');

      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
      }
      return data;
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        error.response.data?.errors.forEach((errorObj: any) => {
          const { path, msg } = errorObj;
          dispatch(setErrors({ field: path, message: msg }));
        });

        dispatch(setErrorEmail(error.response.data));
      }
      return rejectWithValue(error.response?.data || 'Ошибка регистрации');
    }
  },
);

interface LoginParams {
  email: string;
  password: string;
}

export const login = createAsyncThunk(
  'auth/login',
  async (params: LoginParams, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/login', params);
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
      }
      return data;
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        console.log(error.response.data.errors, 'login errors');

        error.response.data.errors.forEach((errorObj: any) => {
          const { path, msg } = errorObj;
          dispatch(setErrors({ field: path, message: msg }));
        });

        dispatch(setErrorEmail(error.response.data));
      }
      return rejectWithValue(error.response?.data || 'Ошибка входа');
    }
  },
);

export const refreshTokens = createAsyncThunk(
  'auth/refreshTokens',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/refresh');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await api.post('/logout');
});
