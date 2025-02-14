import React from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectUserId } from '../../store/slices/authSlice';
import { api, apiMultipart } from '../../utils/api';
import { useForm, Controller } from 'react-hook-form';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

export const AddOrEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user_id = useSelector(selectUserId);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    register,
    reset,
  } = useForm();
  const [img, setImg] = React.useState<FileList | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<{ id: number; name: string }[]>([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      }
    };
    fetchCategories();
  }, []);

  React.useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/products/item/${id}`);
          const product = response.data.product;

          setValue('name', product.name);
          setValue('description', product.description);
          setValue('price', product.price);
          setValue('discountPrice', product.discountPrice || '');
          setValue('category', product.categoryId);

          if (product.image) {
            const url_img = `http://localhost:5000${product.image.substring(6)}`;
            setPreview(url_img);
          }
        } catch (error) {
          console.error('Ошибка загрузки продукта:', error);
        }
      };
      fetchProduct();
    }
  }, [id, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setImg(files);
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  const onSubmit = async (data: any) => {
    if (!id) {
      if (!img || img.length === 0) {
        toast.warning('Пожалуйста, загрузите изображение!');
        return;
      }
    }

    const formData = new FormData();
    const productData = {
      id,
      name: data.name,
      description: data.description,
      price: data.price,
      discountPrice: data.discountPrice || null,
      categoryId: data.category,
      userId: user_id,
    };

    if (img && img[0]) {
      formData.append('image', img[0]);
    }

    formData.append('productData', JSON.stringify(productData));

    try {
      if (id) {
        await apiMultipart.put(`/update-product/${id}`, formData);
        toast.success('Продукт успешно обновлен!');
        navigate('/home');
      } else {
        await apiMultipart.post('/add-product', formData);
        toast.success('Продукт успешно добавлен!');
        reset();
        setImg(null);
        setPreview(null);
      }
    } catch (error) {
      console.error('Ошибка при отправке продукта:', error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот продукт?');
    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/products/delete/${id}`);
      window.location.href = '/home';
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
      toast.error('Ошибка при удалении продукта');
    }
  };

  return (
    <Container>
      <Typography variant='h4' sx={{ marginBottom: 2 }}>
        {id ? 'Редактировать продукт' : 'Добавить продукт'}
      </Typography>

      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label='Название продукта'
          variant='outlined'
          {...register('name', { required: 'Название продукта обязательно' })}
          error={Boolean(errors.name)}
          helperText={errors.name ? 'Название продукта обязательно' : ''}
          sx={{ marginBottom: 2 }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          fullWidth
          label='Описание продукта'
          variant='outlined'
          {...register('description', { required: 'Описание продукта обязательно' })}
          error={Boolean(errors.description)}
          helperText={errors.description ? 'Описание продукта обязательно' : ''}
          sx={{ marginBottom: 2 }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          fullWidth
          label='Цена'
          variant='outlined'
          {...register('price', { required: 'Цена обязательна' })}
          error={Boolean(errors.price)}
          helperText={errors.price ? 'Цена обязательна' : ''}
          type='number'
          sx={{ marginBottom: 2 }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          fullWidth
          label='Скидочная цена'
          variant='outlined'
          {...register('discountPrice')}
          error={Boolean(errors.discountPrice)}
          helperText={errors.discountPrice ? 'Неверная скидочная цена' : ''}
          type='number'
          sx={{ marginBottom: 2 }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <FormControl fullWidth sx={{ marginBottom: 2 }} error={Boolean(errors.category)}>
          <InputLabel id='category-label'>Категория</InputLabel>
          <Controller
            name='category'
            control={control}
            defaultValue=''
            rules={{ required: 'Категория обязательна' }}
            render={({ field }) => (
              <Select {...field} labelId='category-label' label='Категория'>
                <MenuItem value=''>
                  <em>Выберите категорию</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.category && <FormHelperText>Категория обязательна</FormHelperText>}
        </FormControl>

        <Button
          component='label'
          variant='contained'
          color='primary'
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          Загрузить изображение
          <input type='file' hidden onChange={handleFileChange} />
        </Button>

        {preview && (
          <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
            <Typography variant='body1'>Предпросмотр изображения:</Typography>
            <img
              src={preview}
              alt='Preview'
              style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
          </Box>
        )}

        <Button type='submit' variant='contained' color='primary' fullWidth>
          {id ? 'Сохранить изменения' : 'Добавить продукт'}
        </Button>
        {id && (
          <Button
            variant='outlined'
            color='error'
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Удалить продукт
          </Button>
        )}
      </Box>
    </Container>
  );
};
