import { Request, Response, NextFunction } from 'express';
import { SEBI_MANDATORY_DISCLAIMER } from '../../src/data/seedData';

export function sebiDisclaimerMiddleware(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;
  res.json = function (body: any) {
    if (body && typeof body === 'object' && req.path.startsWith('/api/')) {
      if (!body.disclaimer) {
        body.disclaimer = SEBI_MANDATORY_DISCLAIMER;
      }
      if (body.success === undefined && !body.error) {
        body.success = true;
      }
    }
    return originalJson.call(this, body);
  };
  next();
}

export function sanitizeSEBI(text: string): string {
  if (!text) return text;
  return text
    .replace(/\b(i recommend buying|recommend buying|we recommend buying|should buy)\b/gi, 'signals suggest accumulating')
    .replace(/\b(recommend selling|should sell|target price)\b/gi, 'historical valuation estimate')
    .replace(/\b(will go up|guaranteed return|sure profit)\b/gi, 'has historical precedent for appreciation');
}
