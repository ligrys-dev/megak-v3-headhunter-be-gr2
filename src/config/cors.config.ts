import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const getCorsConfig = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
} as CorsOptions;
