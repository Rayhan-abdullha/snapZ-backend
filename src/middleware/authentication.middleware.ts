import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import CustomError from '../lib/Error';
import { config } from '../../config/env';

const prisma = new PrismaClient();

type CustomRequest = Request & {
  user?: User;
};

const authenticate = async (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
): Promise<void > => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    next(CustomError.unauthorized())
    return;
  }

  try {
    const decoded = jwt.verify(token, config.secret_access_token || 'my_secret_key' as string) as { id: string };
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      next(CustomError.unauthorized());
      return;
    }
    req.user = user as User
    next();
  } catch (error) {
    next(CustomError.unauthorized());
    return;
  }
};

export default authenticate;