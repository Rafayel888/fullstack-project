import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { logoutUser } from '../../store/actions/authThunks';
import { logout, selectAuth, selectUser } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const isAuth = useSelector(selectAuth);
  const currentUser = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logoutUs = () => {
    dispatch(logoutUser());
    dispatch(logout());
  };

  return (
    <AppBar position='static' sx={{ backgroundColor: '#1976d2', padding: '10px' }}>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          <Link to='/' style={{ textDecoration: 'none', color: '#fff', cursor: 'pointer' }}>
            Магазин
          </Link>
        </Typography>

        <Button color='inherit' component={Link} to='/all-products' sx={{ marginRight: 2 }}>
          Все продукты
        </Button>
        {isAuth ? (
          <>
            <Button
              color='inherit'
              component={Link}
              to={`/my-products/${currentUser?.id}`}
              sx={{ marginRight: 2 }}
            >
              Мои продукты
            </Button>
            <Button color='inherit' component={Link} to='/add-product' sx={{ marginRight: 2 }}>
              + Добавить продукт
            </Button>

            <IconButton onClick={handleMenuOpen} color='inherit'>
              <Avatar sx={{ bgcolor: 'orange', width: 36, height: 36 }}>
                {currentUser?.firstName && currentUser?.lastName
                  ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
                  : ''}
              </Avatar>
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <Typography variant='body1' sx={{ margin: 2 }}>
                {currentUser?.firstName}{' '}
                {currentUser?.lastName && currentUser.lastName.length > 10
                  ? `${currentUser.lastName.substring(0, 8)}...`
                  : currentUser?.lastName}
              </Typography>
              <MenuItem component={Link} to='/my-profile'>
                Мой профиль
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  logoutUs();
                }}
              >
                Выйти
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color='inherit' component={Link} to='/register' sx={{ marginRight: 2 }}>
              Регистрация
            </Button>
            <Button color='inherit' component={Link} to='/' sx={{ marginRight: 2 }}>
              Логин
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
