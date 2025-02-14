import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/apiError';
import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, errors: err.errors });
  } else {
    res.status(500).json({ message: 'Unknown server error' });
  }
};

export default errorHandler;
