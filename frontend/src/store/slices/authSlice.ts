import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, registration, refreshTokens } from '../actions/authThunks';
import { AuthState } from '../interfaces/authInterfaces';

const initialState: AuthState = {
  isAuth: false,
  user: null,
  errors: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
  },
  errorEmail: '',
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setErrors(state, action: PayloadAction<{ field: keyof AuthState['errors']; message: string }>) {
      const { field, message } = action.payload;
      state.errors[field] = message;
    },
    setErrorEmail(state, action) {
      if (action.payload?.message == '') {
        state.errorEmail = '';
      } else {
        state.errorEmail = action.payload.message;
      }
    },
    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
    resetAuthState(state) {
      state.isAuth = false;
      state.user = null;
      state.errors = initialState.errors;
      state.errorEmail = '';
    },

    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      window.localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload.user;
        state.status = 'loaded';
      })
      .addCase(login.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(registration.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload.user;
        state.status = 'loaded';
      })
      .addCase(registration.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload.user;
        state.status = 'loaded';
        if (action.payload.accessToken) {
          window.localStorage.setItem('token', action.payload.accessToken);
        }
      })
      .addCase(refreshTokens.rejected, (state) => {
        state.isAuth = false;
        state.user = null;
        state.status = 'error';
      });
  },
});

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserId = (state: { auth: AuthState }) => state.auth.user?.id?.toString() ?? '';
export const selectAuth = (state: { auth: AuthState }) => state.auth.isAuth;
export const inpErrors = (state: { auth: AuthState }) => state.auth.errors;
export const errorEmail = (state: { auth: AuthState }) => state.auth.errorEmail;

export const { setErrors, setErrorEmail, setAuth, resetAuthState, logout } = authSlice.actions;

export default authSlice.reducer;
