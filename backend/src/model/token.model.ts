import connection from '../database/conection';

const createTokenTable = `
  CREATE TABLE IF NOT EXISTS Tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    refreshToken VARCHAR(500) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
  );
`;

const saveToken = (userId: number, refreshToken: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Tokens (userId, refreshToken) VALUES (?, ?) 
                   ON DUPLICATE KEY UPDATE refreshToken = ?`;

    connection.query(query, [userId, refreshToken, refreshToken], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const findToken = (
  refreshToken: string,
): Promise<{ userId: number; refreshToken: string } | null> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Tokens WHERE refreshToken = ?`;

    connection.query(query, [refreshToken], (err, results: any[]) => {
      if (err) reject(err);
      else resolve(results.length ? results[0] : null);
    });
  });
};

const removeToken = (refreshToken: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM Tokens WHERE refreshToken = ?`;

    connection.query(query, [refreshToken], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export { createTokenTable, saveToken, findToken, removeToken };
