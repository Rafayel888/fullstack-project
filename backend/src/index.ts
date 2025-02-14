import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import path from 'path';
import errorHandler from './middleware/error-middleware';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.resolve('public/uploads')));

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use('/api', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
