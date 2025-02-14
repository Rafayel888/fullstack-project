import { createUserTable } from '../model/user.model';
import { createCategoriesTable, insertDefaultCategories } from '../model/category.model';
import { createProductTable } from '../model/product.model';
import { createTokenTable } from '../model/token.model';

import connection from '../database/conection';

const runMigrations = () => {
  connection.query(createUserTable, (err, results) => {
    if (err) {
      console.error('❌ Ошибка при создании таблицы Users:', err);
      return;
    }
    console.log('✅ Таблица Users успешно создана');

    connection.query(createCategoriesTable, (err, results) => {
      if (err) {
        console.error('❌ Ошибка при создании таблицы Categories:', err);
        return;
      }
      console.log('✅ Таблица Categories успешно создана');

      connection.query(insertDefaultCategories, (err, results) => {
        if (err) {
          console.error('❌ Ошибка при вставке данных в Categories:', err);
        } else {
          console.log('✅ Данные в Categories успешно вставлены');
        }

        connection.query(createProductTable, (err, results) => {
          if (err) {
            console.error('❌ Ошибка при создании таблицы Products:', err);
            return;
          }
          console.log('✅ Таблица Products успешно создана');

          connection.query(createTokenTable, (err, result) => {
            if (err) {
              console.error('❌ Ошибка при создании таблицы Tokens:', err);
            } else {
              console.log('✅ Таблица Tokens успешно создана');
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
    });
  });
};

runMigrations();
