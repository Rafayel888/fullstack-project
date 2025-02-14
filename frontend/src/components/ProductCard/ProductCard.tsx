import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectAuth, selectUser } from '../../store/slices/authSlice';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  userId?: number;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const isAuth = useSelector(selectAuth);
  const currentUser = useSelector(selectUser);
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuth) {
      navigate(`/product/item/${product.id}`);
    } else {
      toast.info('Вам нужно войти в систему, чтобы просматривать детали продукта');
    }
  };

  const handleEdit = () => {
    navigate(`/update-product/${product.id}`);
  };

  return (
    <Card>
      <CardMedia
        component='img'
        sx={{ height: 200, width: '100%', objectFit: 'cover' }}
        image={`http://localhost:5000${product.image?.substring(6)}` || '/placeholder.jpg'}
        alt={product.name}
      />
      <CardContent>
        <Typography variant='h6'>
          {product.name}{' '}
          {currentUser?.id === product.userId && (
            <EditIcon color='primary' sx={{ marginLeft: 1 }} />
          )}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {product.description}
        </Typography>
        <Typography variant='h6' color='primary'>
          {product.price + '$'}{' '}
          {product.discountPrice ? ' скидка -' + product.discountPrice + '$' : ''}
        </Typography>
        <Button
          variant='contained'
          color='primary'
          fullWidth
          sx={{ marginTop: 1 }}
          onClick={handleClick}
        >
          Смотреть детали
        </Button>
        {currentUser?.id === product.userId && (
          <Button
            variant='outlined'
            color='secondary'
            fullWidth
            sx={{ marginTop: 1 }}
            onClick={handleEdit}
          >
            Редактировать
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
