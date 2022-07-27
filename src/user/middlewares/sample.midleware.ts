/*
This is just to test that how to add multiple middlewares in nest
*/

import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../types/expressRequest.interface';

export class SampleMiddleware implements NestMiddleware {
  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    console.log('request user, method, body, params, qs and headers', {
      method: req.method,
      headers: req.headers,
      body: req.body,
      params: req.params,
      qs: req.query,
      user: req.user,
    });
    next();
  }
}
