import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import userService from '../service/user-service';
import { ApiError } from '../exceptions/apiError';
import { findUserById } from '../model/user.model';
import { FullUserDto } from '../dto/user-full-dto';

class UserController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('', errors.array()));
    }

    const { firstName, lastName, email, password, birthDate } = req.body;

    try {
      const userData = await userService.register(firstName, lastName, email, password, birthDate);
      res.cookie('accessToken', userData.accessToken, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
      });

      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        user: userData.user,
        accessToken: userData.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
      const userData = await userService.login(email, password);
      res.cookie('accessToken', userData.accessToken, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
      });

      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        user: userData.user,
        accessToken: userData.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return next(ApiError.UnauthorizedError());
      }

      const userData = await userService.refresh(refreshToken);

      if (!userData || !userData.refreshToken) {
        return next(ApiError.UnauthorizedError());
      }

      res.cookie('accessToken', userData.accessToken, {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
      });
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json({
        user: userData.user,
        accessToken: userData.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return next(ApiError.UnauthorizedError());
      }

      const user = await findUserById(userId.toString());

      if (!user) {
        return next(ApiError.NotFound('Пользователь не найден'));
      }

      const userDto = new FullUserDto(user);

      res.json({ user: userDto });
    } catch (error) {
      return next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return next(ApiError.UnauthorizedError());
      }

      const { firstName, lastName, email } = req.body;

      if (!firstName || !lastName || !email) {
        return next(ApiError.BadRequest('Все поля обязательны'));
      }

      const updatedUser = await userService.updateUser(userId, { firstName, lastName, email });

      res.json({ message: 'Данные успешно обновлены', user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return next(ApiError.UnauthorizedError());
      }

      if (!req.file) {
        return next(ApiError.BadRequest('Файл не загружен'));
      }

      const avatarPath = `/avatars/${req.file.filename}`;

      await userService.updateProfilePicture(userId, avatarPath);

      res.json({ message: 'Аватар обновлён', avatar: avatarPath });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return next(ApiError.UnauthorizedError());
      }

      await userService.logout(refreshToken);

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.json({ message: 'Вы успешно вышли из системы' });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
