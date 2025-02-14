import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { api, apiMultipart } from '../../utils/api';
import { Avatar, Button, TextField, Typography, Grid, Paper } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

export const MyProfile: React.FC = () => {
  const [user, setUser] = React.useState<any | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/current-user');
        setUser(response.data.user);

        setValue('firstName', response.data.user.firstName);
        setValue('lastName', response.data.user.lastName);
        setValue('email', response.data.user.email);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
    };
    fetchUserProfile();
  }, [setValue]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const avatarFile = event.target.files[0];
      setPreview(URL.createObjectURL(avatarFile));
      const formData = new FormData();
      formData.append('profilePicture', avatarFile);

      try {
        const { data } = await apiMultipart.post('/upload-avatar', formData);
        toast.success(`${data.message}`);
      } catch (error) {
        console.error('Ошибка загрузки аватара:', error);
        toast.error('Ошибка загрузки аватара');
      }
    }
  };

  const onSubmit = async (values: any) => {
    try {
      const { data } = await api.put('/update-profile', values);
      toast.success(`${data.message}`);
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      toast.error('Все поля обязательны');
    }
  };

  return (
    <Paper style={{ padding: 20, maxWidth: 400, margin: 'auto' }}>
      <Typography variant='h5' align='center' gutterBottom>
        Профиль
      </Typography>

      <Grid container spacing={2} justifyContent='center'>
        <Grid item>
          {user && (
            <Avatar
              src={preview || `http://localhost:5000/uploads${user?.profilePicture}`}
              alt='Аватар'
              sx={{ width: 100, height: 100 }}
            />
          )}
        </Grid>
      </Grid>

      <Button variant='contained' component='label' fullWidth sx={{ marginTop: 2 }}>
        Загрузить новый аватар
        <input type='file' hidden onChange={handleAvatarChange} />
      </Button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label='Имя'
          {...register('firstName')}
          variant='outlined'
          margin='normal'
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          fullWidth
          label='Фамилия'
          {...register('lastName')}
          variant='outlined'
          margin='normal'
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          fullWidth
          label='Email'
          type='email'
          {...register('email')}
          variant='outlined'
          margin='normal'
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </form>
      {user?.createdAt && (
        <Typography variant='body2' color='textSecondary' align='center' sx={{ mt: 2 }}>
          Аккаунт создан: {new Date(user.createdAt).toLocaleDateString()}
        </Typography>
      )}
    </Paper>
  );
};
