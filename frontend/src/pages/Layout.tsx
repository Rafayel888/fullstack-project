import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { refreshTokens } from '../store/actions/authThunks';
import { LoadingSnipet } from '../components/Loading/LoadingSnipet';
import Header from '../components/Shared/Header';

export const Layout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(refreshTokens()).unwrap();
      } catch (error) {
        console.error('Ошибка авторизации:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return <LoadingSnipet />;
  }

  return (
    <>
      <Header />
      <Outlet />;
    </>
  );
};
