import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { LoadingSnipet } from '../../components/Loading/LoadingSnipet';
import { api } from '../../utils/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  createdAt: string;
  image: string;
  categoryName: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/item/${id}`);
        const updatedProduct = {
          ...response.data.product,
          categoryName: response.data.categoryName,
        };
        setProduct(updatedProduct);
      } catch (error) {
        console.error('Ошибка при загрузке продукта:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <LoadingSnipet />;
  }

  return (
    <Container>
      <Card>
        <CardMedia
          component='img'
          sx={{ height: 300, objectFit: 'cover' }}
          image={`http://localhost:5000${product.image.substring(6)}` || '/placeholder.jpg'}
          alt={product.name}
        />
        <CardContent>
          <Typography variant='h4'>{product.name}</Typography>
          <Typography variant='h6' color='primary'>
            {product.price} {product.discountPrice ? ' скидка -' + product.discountPrice + '$' : ''}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Дата создания: {new Date(product.createdAt).toLocaleDateString('ru-RU')}
          </Typography>
          <Typography variant='body1'>{product.description}</Typography>
          <Typography variant='body1'>CategoryName - {product.categoryName}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetails;
