import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Register } from '../pages/Auth/Register';
import { Home } from '../pages/Profile/Home';
import { Login } from '../pages/Auth/Login';
import { Layout } from '../pages/Layout';
import { NotFound } from '../pages/NotFound';
import { Index } from '../pages/Product/Index';
import { OnlyMyProducts } from '../pages/Product/OnlyMyProducts';
import ProtectedRoute from '../components/ProtectedRoute';
import ProductDetails from '../pages/Product/ProductDetails';
import { AddOrEdit } from '../pages/Product/AddOrEddit';
import { MyProfile } from '../pages/Profile/MyProfile';

const MyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='all-products' element={<Index />} />
        <Route path='home' element={<ProtectedRoute element={<Home />} />} />
        <Route path='add-product' element={<ProtectedRoute element={<AddOrEdit />} />} />
        <Route path='update-product/:id' element={<ProtectedRoute element={<AddOrEdit />} />} />
        <Route path='product/item/:id' element={<ProtectedRoute element={<ProductDetails />} />} />
        <Route path='my-products/:id' element={<ProtectedRoute element={<OnlyMyProducts />} />} />
        <Route path='my-profile' element={<ProtectedRoute element={<MyProfile />} />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default MyRoutes;
