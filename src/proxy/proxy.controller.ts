import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import axios from 'axios';

@Controller('proxy')
export class ProxyController {
  @All('auth/*')
  proxyAuth(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'http://auth:3001');
  }

  @All('core/*')
  proxyCore(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'http://core:3002');
  }

  @All('report/*')
  proxyReport(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'http://report:3003');
  }

  private async forward(req: Request, res: Response, target: string) {
    try {
      const headers: Record<string, string> = {};

      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === 'string') {
          headers[key] = value;
        }
      }

      delete headers['host'];
      delete headers['content-length'];

      const response = await axios({
        method: req.method as any,
        url: `${target}${req.url.replace('/proxy', '')}`,
        headers,
        data: req.body,
        params: req.query,
      });

      res.status(response.status).send(response.data);
    } catch (err: any) {
      const statusCode =
        typeof err?.response?.status === 'number' ? err.response.status : 500;

      res.status(statusCode).send(
        err?.response?.data ?? {
          message: err?.message ?? 'Gateway error',
        },
      );
    }
  }
}
