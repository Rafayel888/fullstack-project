import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';
import { Product } from '../interfaces/productInterfaces';

export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/item/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Ошибка получения продукта');
    }
  },
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, product }: { id: number; product: Product }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/products/${id}`, product);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Ошибка обновления продукта');
    }
  },
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Ошибка удаления продукта');
    }
  },
);
