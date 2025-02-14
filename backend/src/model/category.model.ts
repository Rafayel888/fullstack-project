import connection from '../database/conection';

const createCategoriesTable = `
  CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
  );
`;

const insertDefaultCategories = `
  INSERT INTO Categories (name) VALUES 
  ('Electronics'), 
  ('Clothing'), 
  ('Books')
  ON DUPLICATE KEY UPDATE name = name;
`;

export { createCategoriesTable, insertDefaultCategories };
