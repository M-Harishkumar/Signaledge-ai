import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred while processing your request.';

  // Structured logging for developers (never expose internal trace to client)
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[API Error] ${req.method} ${req.path} -> ${status}:`, err.stack || err);
  }

  res.status(status).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message,
    },
    meta: {
      path: req.path,
      timestamp: new Date().toISOString(),
    },
  });
}
