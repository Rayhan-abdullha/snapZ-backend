import config from 'config';
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import CustomError from '../lib/Error';

const MODE = config.get('mode');

const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const defaultErrorMessage = 'Something went wrong!';
  let error: {
    status: number;
    message: string;
    details?: { path: string; message: string }[];
  } = {
    status: err.status || 501,
    message:
      MODE === 'development'
        ? err.message || defaultErrorMessage
        : defaultErrorMessage,
    details: err.details
      ? err.details.map((detail: any) => ({
          path: detail.path.join('.'),
          message: detail.message,
        }))
      : undefined,
  };
  
  if (err instanceof CustomError) {
    error = {
      ...error
    };
  }

  if (err instanceof ZodError) {
    error = {
      status: 422,
      message: 'Validation error',
      details: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
  }

  res.status(error.status).json(error);
};

export default errorMiddleware;
