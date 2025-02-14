import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductState } from '../interfaces/productInterfaces';
import { getProductById, updateProduct, deleteProduct } from '../actions/productThunks';

const initialState: ProductState = {
  products: [],
  status: 'idle',
  error: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    resetProductsState(state) {
      state.products = [];
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        const existingProductIndex = state.products.findIndex((p) => p.id === action.payload.id);
        if (existingProductIndex === -1) {
          state.products.push(action.payload);
        } else {
          state.products[existingProductIndex] = action.payload;
        }
        state.status = 'loaded';
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      })

      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.status = 'loaded';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload.id);
        state.status = 'loaded';
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });
  },
});

export const selectProducts = (state: { product: ProductState }) => state.product?.products;
export const selectProductStatus = (state: { product: ProductState }) => state.product.status;
export const selectProductError = (state: { product: ProductState }) => state.product.error;

export const { setProducts, setError, resetProductsState } = productSlice.actions;

export default productSlice.reducer;
