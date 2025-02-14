import jwt from 'jsonwebtoken';
import { saveToken, findToken, removeToken } from '../model/token.model';

class TokenService {
  generateTokens(payload: object) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    } catch {
      return null;
    }
  }

  async saveToken(userId: number, refreshToken: string) {
    await saveToken(userId, refreshToken);
  }

  async removeToken(refreshToken: string) {
    await removeToken(refreshToken);
  }

  async findToken(refreshToken: string) {
    return await findToken(refreshToken);
  }
}

export default new TokenService();
