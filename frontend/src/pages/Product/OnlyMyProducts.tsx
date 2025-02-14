import React from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { api } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  createdAt: string;
  image: string;
}

export const OnlyMyProducts: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = React.useState<Product[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/my-products/${id}`);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
      }
    };

    fetchProducts();
  }, [id]);

  const handleEdit = (id: number) => {
    navigate(`/update-product/${id}`);
  };

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Мои Продукты
      </Typography>
      <Grid container spacing={3}>
        {products.length === 0 ? (
          <Typography variant='h6' color='textSecondary'>
            У вас нет продуктов.
          </Typography>
        ) : (
          products?.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component='img'
                  height='200'
                  image={`http://localhost:5000${product.image.substring(6)}`}
                  alt={product.name}
                  sx={{
                    objectFit: 'cover',
                    flexGrow: 1,
                  }}
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Typography variant='h6' gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant='body2' color='textSecondary' paragraph>
                    {product.description}
                  </Typography>
                  <Typography variant='h6' color='primary' gutterBottom>
                    {product.price}{' '}
                    {product.discountPrice ? ' скидка -' + product.discountPrice + '$' : ''}
                  </Typography>
                  <Button
                    onClick={() => handleEdit(product.id)}
                    variant='contained'
                    color='primary'
                    fullWidth
                  >
                    Редактировать
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};
