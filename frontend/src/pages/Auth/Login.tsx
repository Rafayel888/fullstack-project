import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/actions/authThunks';
import { errorEmail, inpErrors, selectAuth } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';

// Material UI
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const isAuth = useSelector(selectAuth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const errors = useSelector(inpErrors);
  const serverError = useSelector(errorEmail);
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    dispatch(login(data));
  };

  React.useEffect(() => {
    if (isAuth) {
      navigate('/home');
    }
  }, [isAuth]);

  return (
    <Container maxWidth='xs'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Typography variant='h5' sx={{ mb: 2 }}>
          Вход
        </Typography>

        {serverError && (
          <Alert severity='error' sx={{ mb: 2, width: '100%' }}>
            {serverError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label='Email'
            variant='outlined'
            margin='normal'
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label='Пароль'
            variant='outlined'
            margin='normal'
            type='password'
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 2 }}>
            Войти
          </Button>
        </form>
        <Typography variant='body2' sx={{ mt: 2 }}>
          У вас нету аккаунта? <Link to='/register'>Регистрироваться</Link>
        </Typography>
      </Box>
    </Container>
  );
};
