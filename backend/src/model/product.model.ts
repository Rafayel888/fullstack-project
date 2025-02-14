import connection from '../database/conection';
import { RowDataPacket } from 'mysql2';

const createProductTable = `
  CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discountPrice DECIMAL(10, 2) DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    userId INT NOT NULL, 
    categoryId INT NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE CASCADE
  );
`;

const createProduct = (
  userId: number,
  name: string,
  price: number,
  discountPrice: number,
  image: string,
  description: string,
): Promise<void> => {
  const insertProduct = `
    INSERT INTO Products (userId, name, price, discountPrice, image, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    connection.query(
      insertProduct,
      [userId, name, price, discountPrice, image, description],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
};

const getAllProducts = (): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT Products.id, Products.name, Products.price, Products.discountPrice, Products.image, Products.description, 
             Products.createdAt, Products.updatedAt, Users.firstName, Users.lastName
      FROM Products
      JOIN Users ON Products.userId = Users.id
    `;

    connection.query(query, (err, results: RowDataPacket[]) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const getProductsByUserId = (userId: number): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM Products WHERE userId = ?
    `;

    connection.query(query, [userId], (err, results: RowDataPacket[]) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

export { createProductTable, createProduct };
