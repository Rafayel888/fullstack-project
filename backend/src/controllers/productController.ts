import { Request, Response, NextFunction } from 'express';
import productService from '../service/product-service';
import { ApiError } from '../exceptions/apiError';

class ProductController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productData = JSON.parse(req.body.productData);
      const image = req.file ? req.file.path : null;

      await productService.createProduct(
        productData.userId,
        productData.name,
        productData.price,
        productData.discountPrice,
        image,
        productData.description,
        productData.categoryId,
      );

      res.status(201).json({ message: 'Продукт успешно добавлен!' });
    } catch (error) {
      return next(error);
    }
  }

  async getAllGuest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await productService.getAllProductsGuest();
      res.json({ products });
    } catch (error) {
      return next(error);
    }
  }

  async getByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.params;

    try {
      const products = await productService.getProductsByUserId(Number(userId));
      res.json({ products });
    } catch (error) {
      return next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await productService.getAllCategories();
      res.json({ categories });
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    try {
      const product = await productService.getProductById(Number(id));
      if (!product) {
        res.status(404).json({ message: 'Продукт не найден' });
        return;
      }

      const category = await productService.getCategoryNameById(product.categoryId);

      res.json({ product, categoryName: category?.name });
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productData = JSON.parse(req.body.productData);
      const image = req.file ? req.file.path : productData.image;

      console.log(req.file, 'req.file');
      console.log(req.file?.path, 'req.file.path');
      console.log(productData, 'req.file.path');

      const categoryId = Number(productData.categoryId);
      if (isNaN(categoryId)) {
        throw ApiError.BadRequest('Неверный ID категории');
      }
      console.log('Обновление продукта:', productData);

      await productService.updateProduct(
        productData.id,
        productData.name,
        productData.price,
        productData.discountPrice,
        productData.description,
        productData.categoryId,
        image,
      );

      res.json({ message: 'Продукт успешно обновлен' });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    try {
      await productService.deleteProduct(Number(id));
      res.json({ message: 'Продукт успешно удален' });
    } catch (error) {
      return next(error);
    }
  }

  async getAllFill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, showOwnProducts } = req.query;
      const userId = showOwnProducts === 'true' && req.user ? req.user.id : undefined;

      const products = await productService.getAllProductsFill(category as string, userId);
      res.json({ products });
    } catch (error) {
      return next(error);
    }
  }
}

export default new ProductController();
