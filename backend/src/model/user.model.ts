import connection from '../database/conection';

const createUserTable = `
  CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    birthDate DATE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    profilePicture VARCHAR(255) DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

const findUserById = (
  userId: string,
): Promise<{ id: number; firstName: string; lastName: string; email: string } | null> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Users WHERE id = ?';

    connection.query(query, [userId], (err, results: any[]) => {
      if (err) reject(err);
      else resolve(results.length ? results[0] : null);
    });
  });
};

export { createUserTable, findUserById };
