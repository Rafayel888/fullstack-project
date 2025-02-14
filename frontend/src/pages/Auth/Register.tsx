import React from 'react';
import { Typography, TextField, Paper, Button, Avatar, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  errorEmail,
  inpErrors,
  selectAuth,
  setErrorEmail,
  setErrors,
} from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import { registration } from '../../store/actions/authThunks';

import styles from './Auth.module.scss';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}

export const Register = () => {
  const isAuth = useSelector(selectAuth);
  const navigate = useNavigate();
  const repEmailErr = useSelector(errorEmail);
  const allErrors = useSelector(inpErrors);
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthDate: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: RegisterFormValues) => {
    dispatch(setErrors({ field: 'firstName', message: '' }));
    dispatch(setErrors({ field: 'lastName', message: '' }));
    dispatch(setErrors({ field: 'password', message: '' }));
    dispatch(setErrors({ field: 'birthDate', message: '' }));
    dispatch(setErrorEmail(''));

    await dispatch(registration(values));

    reset({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthDate: '',
    });
  };

  React.useEffect(() => {
    if (isAuth) {
      navigate('/home');
    }
  }, [isAuth]);

  return (
    <Container maxWidth='xs'>
      <Paper className={styles.root}>
        <Typography className={styles.title} variant='h5'>
          Создание аккаунта
        </Typography>
        <div className={styles.avatar}>
          <Avatar sx={{ width: 100, height: 100 }} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            className={styles.field}
            label='Имя'
            error={Boolean(errors.firstName?.message || allErrors?.firstName)}
            helperText={errors.firstName?.message || allErrors?.firstName}
            {...register('firstName', {
              required: 'Имя обязательно',
              pattern: {
                value: /^[A-Za-zА-Яа-я]+$/,
                message: 'Имя должно содержать только буквы.',
              },
            })}
            fullWidth
          />

          <TextField
            className={styles.field}
            label='Фамилия'
            error={Boolean(errors.lastName?.message || allErrors?.lastName)}
            helperText={errors.lastName?.message || allErrors?.lastName}
            {...register('lastName', {
              required: 'Фамилия обязательна',
              pattern: {
                value: /^[A-Za-zА-Яа-я]+$/,
                message: 'Фамилия должна содержать только буквы.',
              },
            })}
            fullWidth
          />

          <TextField
            className={styles.field}
            label='Email'
            error={Boolean(errors.email?.message || repEmailErr)}
            helperText={errors.email?.message || repEmailErr}
            {...register('email', {
              required: 'Email обязателен',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Неверный формат email',
              },
            })}
            fullWidth
          />

          <TextField
            className={styles.field}
            label='Пароль'
            type='password'
            error={Boolean(errors.password?.message || allErrors?.password)}
            helperText={errors.password?.message || allErrors?.password}
            {...register('password', {
              required: 'Пароль обязателен',
              minLength: {
                value: 6,
                message: 'Пароль должен быть не менее 6 символов',
              },
            })}
            fullWidth
          />

          <TextField
            className={styles.field}
            label='Дата рождения'
            type='date'
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.birthDate?.message || allErrors?.birthDate)}
            helperText={errors.birthDate?.message || allErrors?.birthDate}
            {...register('birthDate', {
              required: 'Дата рождения обязательна',
            })}
            fullWidth
          />

          <Button
            className={styles.submitBtn}
            disabled={!isValid}
            type='submit'
            size='large'
            variant='contained'
            fullWidth
          >
            Зарегистрироваться
          </Button>
        </form>

        <Typography variant='body2' sx={{ mt: 2 }}>
          Уже есть аккаунт? <Link to='/'>Войти</Link>
        </Typography>
      </Paper>
    </Container>
  );
};
