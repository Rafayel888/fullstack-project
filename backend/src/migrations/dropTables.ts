import connection from '../database/conection';

const dropTables = () => {
  const dropUsersTable = 'DROP TABLE IF EXISTS Users';
  const dropProductsTable = 'DROP TABLE IF EXISTS Products';
  const dropTokensTable = 'DROP TABLE IF EXISTS Tokens';

  connection.query(dropTokensTable, (err) => {
    if (err) {
      console.error('❌ Ошибка при удалении таблицы Tokens:', err);
    } else {
      console.log('✅ Таблица Tokens успешно удалена');
    }

    connection.query(dropProductsTable, (err) => {
      if (err) {
        console.error('❌ Ошибка при удалении таблицы Products:', err);
      } else {
        console.log('✅ Таблица Products успешно удалена');
      }

      connection.query(dropUsersTable, (err) => {
        if (err) {
          console.error('❌ Ошибка при удалении таблицы Users:', err);
        } else {
          console.log('✅ Таблица Users успешно удалена');
        }

        connection.end((err) => {
          if (err) {
            console.error('❌ Ошибка при закрытии подключения:', err);
          } else {
            console.log('✅ Подключение закрыто');
          }
        });
      });
    });
  });
};

dropTables();
