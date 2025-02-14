import connection from '../database/conection';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { ApiError } from '../exceptions/apiError';

class ProductService {
  async createProduct(
    userId: number,
    name: string,
    price: number,
    discountPrice: number,
    image: string | null,
    description: string,
    categoryId: number,
  ): Promise<void> {
    const insertProductQuery = `
      INSERT INTO Products (userId, name, price, discountPrice, image, description,categoryId)
      VALUES (?, ?, ?, ?, ?, ?,?)
    `;

    try {
      await connection
        .promise()
        .query(insertProductQuery, [
          userId,
          name,
          price,
          discountPrice,
          image,
          description,
          categoryId,
        ]);
    } catch (error: any) {
      throw ApiError.BadRequest('Ошибка при добавлении продукта', error);
    }
  }

  async getAllProductsGuest(): Promise<RowDataPacket[]> {
    const query = `
      SELECT * FROM Products
    `;

    try {
      const [results] = await connection.promise().query(query);
      return results as RowDataPacket[];
    } catch (error: any) {
      throw ApiError.BadRequest('Ошибка при получении продуктов', error);
    }
  }

  async getProductsByUserId(userId: number): Promise<RowDataPacket[]> {
    const query = `
      SELECT * FROM Products WHERE userId = ?
    `;

    try {
      const [results] = await connection.promise().query(query, [userId]);
      return results as RowDataPacket[];
    } catch (error: any) {
      throw ApiError.BadRequest('Ошибка при получении продуктов для этого пользователя', error);
    }
  }

  async getProductById(id: number): Promise<RowDataPacket | null> {
    const query = `SELECT * FROM Products WHERE id = ?`;

    try {
      const [results] = await connection.promise().query(query, [id]);
      return (results as RowDataPacket[])[0] || null;
    } catch (error: any) {
      throw ApiError.BadRequest('Ошибка при получении продукта', error);
    }
  }

  async updateProduct(
    id: number,
    name: string,
    price: number,
    discountPrice: number,
    description: string,
    categoryId: number,
    image: string | null = null,
  ): Promise<void> {
    let query = `
    UPDATE Products 
    SET name = ?, price = ?, discountPrice = ?, description = ?, categoryId = ?
  `;

    const queryParams: any[] = [name, price, discountPrice, description, categoryId];

    if (image !== null) {
      query += ', image = ?';
      queryParams.push(image);
    }

    query += ' WHERE id = ?';
    queryParams.push(id);

    try {
      const [result]: any = await connection.promise().query(query, queryParams);

      if (result.affectedRows === 0) {
        throw ApiError.BadRequest('Продукт не найден');
      }
    } catch (error: any) {
      throw ApiError.BadRequest('Ошибка при обновлении продукта', error);
    }
  }

  async deleteProduct(id: number): Promise<void> {
    const query = `DELETE FROM Products WHERE id = ?`;

    try {
      const [result]: any = await connection.promise().query(query, [id]);

      if (result.affectedRows === 0) {
        throw ApiError.BadRequest('Продукт не найден');
      }
    } catch (error: any) {
      throw ApiError.BadRequest('Ошибка при удалении продукта', error);
    }
  }

  async getAllCategories(): Promise<RowDataPacket[]> {
    const query = `SELECT * FROM Categories`;

    try {
      const [results] = await connection.promise().query(query);
      return results as RowDataPacket[];
    } catch (error: any) {
      throw ApiError.BadRequest('Ошибка при получении категорий', error);
    }
  }

  async getCategoryNameById(categoryId: number): Promise<RowDataPacket | null> {
    const query = `SELECT name FROM Categories WHERE id = ?`;

    try {
      const [results] = await connection.promise().query(query, [categoryId]);
      return (results as RowDataPacket[])[0] || null;
    } catch (error: any) {
      throw ApiError.BadRequest('Ошибка при получении имени категории', error);
    }
  }

  async getAllProductsFill(category?: string, userId?: number): Promise<RowDataPacket[]> {
    let query = 'SELECT * FROM Products';
    const queryParams: any[] = [];

    if (category || userId) {
      query += ' WHERE ';
      const conditions: string[] = [];

      if (category) {
        conditions.push('categoryId = (SELECT id FROM Categories WHERE name = ?)');
        queryParams.push(category);
      }

      if (userId) {
        conditions.push('userId = ?');
        queryParams.push(userId);
      }

      query += conditions.join(' AND ');
    }

    try {
      const [results] = await connection.promise().query(query, queryParams);
      return results as RowDataPacket[];
    } catch (error: any) {
      throw ApiError.BadRequest('Ошибка при получении продуктов', error);
    }
  }
}

export default new ProductService();
