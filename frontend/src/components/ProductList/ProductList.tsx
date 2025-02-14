import React from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { api } from '../../utils/api';
import ProductCard from '../ProductCard/ProductCard';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../store/slices/authSlice';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  userId: number;
}

const ProductList: React.FC = () => {
  const isAuth = useSelector(selectAuth);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<{ id: number; name: string }[]>([]);
  const [filter, setFilter] = React.useState({
    category: '',
    showOwnProducts: false,
  });
  const [currentUser, setCurrentUser] = React.useState<number | null>(null);

  React.useEffect(() => {
    const currUser = async () => {
      try {
        const response = await api.get('/current-user');
        if (response.data.user) {
          setCurrentUser(response.data.user.id);
        }
      } catch (error) {
        console.error('Ошибка загрузки currentUserr:', error);
      }
    };
    if (isAuth) currUser();
  }, []);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      }
    };

    if (isAuth) fetchCategories();
  }, []);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (isAuth) {
          response = await api.get('/products', { params: { category: filter.category } });
        } else {
          response = await api.get('/products/guest');
        }

        let fetchedProducts = response.data.products || response.data;

        if (filter.showOwnProducts && currentUser !== null) {
          fetchedProducts = fetchedProducts.filter(
            (product: Product) => product.userId === currentUser,
          );
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
      }
    };

    fetchProducts();
  }, [isAuth, filter, currentUser]);

  return (
    <Container>
      <Typography variant='h4' sx={{ marginBottom: 2 }}>
        Список продуктов
      </Typography>

      {isAuth && (
        <Grid container spacing={2} alignItems='center' sx={{ marginBottom: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label='Категория'
              name='category'
              select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              fullWidth
            >
              <MenuItem value=''>Все</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filter.showOwnProducts}
                  onChange={() =>
                    setFilter((prev) => ({ ...prev, showOwnProducts: !prev.showOwnProducts }))
                  }
                />
              }
              label='Показать только мои продукты'
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setFilter({ category: '', showOwnProducts: false })}
            >
              Сбросить фильтр
            </Button>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={2}>
        {products?.length > 0 &&
          products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
