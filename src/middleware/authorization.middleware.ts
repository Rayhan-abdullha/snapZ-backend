import { PrismaClient, User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import lib from '../lib';

const prisma = new PrismaClient();

interface AuthorizationRequest extends Request {
  user?: User;
}

const authorization = (permissions: string[]) => {
  return async (req: AuthorizationRequest, _res: Response, next: NextFunction): Promise<void> => {
    const user = req.user

    if (!user) {
      next(lib.CustomError.unauthorized());
      return;
    }

    const hasPermission = permissions.some(permission => user?.role === permission);

    if (hasPermission) {
      next();
    } else {
      console.log('forbiden error')
      next(lib.CustomError.forbidden());
    }
  };
};

export default authorization;
