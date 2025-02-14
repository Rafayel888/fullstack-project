import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/apiError';
import tokenService from '../service/token-service';
import { UserDto } from '../dto/user-dto';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = await tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = new UserDto(userData);

    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};
