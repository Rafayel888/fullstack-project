import bcrypt from 'bcryptjs';
import { saveToken } from '../model/token.model';
import TokenService from './token-service';
import connection from '../database/conection';
import { ApiError } from '../exceptions/apiError';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { UserDto } from '../dto/user-dto';
import { findUserById } from '../model/user.model';
import { JwtPayload } from 'jsonwebtoken';
import { FullUserDto } from '../dto/user-full-dto';

class UserService {
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthDate: string,
  ) {
    try {
      const candidateQuery = 'SELECT * FROM Users WHERE email = ?';
      const [existingUser]: [RowDataPacket[], FieldPacket[]] = await connection
        .promise()
        .query(candidateQuery, [email]);

      if (existingUser.length > 0) {
        throw ApiError.BadRequest(
          `Пользователь с адресом электронной почты ${email} уже существует`,
        );
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const insertUserQuery =
        'INSERT INTO Users (firstName, lastName, password, email, birthDate) VALUES (?, ?, ?, ?, ?)';
      await connection
        .promise()
        .query(insertUserQuery, [firstName, lastName, hashPassword, email, birthDate]);

      const [userResult]: [RowDataPacket[], FieldPacket[]] = await connection
        .promise()
        .query('SELECT LAST_INSERT_ID() AS id');
      const userId = userResult[0].id;

      const userDto = new UserDto({ id: userId, firstName, lastName });
      const tokens = TokenService.generateTokens({ ...userDto });

      await saveToken(userDto.id, tokens.refreshToken);

      return { ...tokens, user: userDto };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const userQuery = 'SELECT * FROM Users WHERE email = ?';
      const [user]: [RowDataPacket[], FieldPacket[]] = await connection
        .promise()
        .query(userQuery, [email]);

      if (!user.length) {
        throw ApiError.BadRequest('Неверные данные');
      }

      const validPassword = await bcrypt.compare(password, user[0].password);
      if (!validPassword) {
        throw ApiError.BadRequest('Неверные данные');
      }

      const userDto = new UserDto({
        id: user[0].id,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
      });

      const tokens = TokenService.generateTokens({ ...userDto });

      await TokenService.saveToken(user[0].id, tokens.refreshToken);

      return { ...tokens, user: userDto };
    } catch (error) {
      throw error;
    }
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData: string | JwtPayload | null = TokenService.validateRefreshToken(refreshToken);

    if (!userData || typeof userData === 'string' || !userData.id) {
      throw ApiError.UnauthorizedError();
    }

    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await findUserById(userData.id);
    if (user) {
      const userDto = new UserDto(user);
      const tokens = TokenService.generateTokens({ ...userDto });

      await TokenService.saveToken(userDto.id, tokens.refreshToken);

      return { ...tokens, user: userDto };
    }
  }

  async updateUser(
    userId: number,
    updateData: { firstName: string; lastName: string; email: string },
  ) {
    try {
      const query = 'UPDATE Users SET firstName = ?, lastName = ?, email = ? WHERE id = ?';
      await connection
        .promise()
        .query(query, [
          updateData.firstName,
          updateData.lastName,
          updateData.email,
          String(userId),
        ]);

      const updatedUser = await findUserById(String(userId));

      if (!updatedUser) {
        throw ApiError.NotFound('Пользователь не найден');
      }

      return new FullUserDto(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  async updateProfilePicture(userId: number, avatarPath: string): Promise<void> {
    const query = 'UPDATE Users SET profilePicture = ? WHERE id = ?';
    await connection.promise().query(query, [avatarPath, userId]);
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    await TokenService.removeToken(refreshToken);
  }
}

export default new UserService();
