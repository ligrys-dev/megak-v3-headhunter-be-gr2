import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const getAuthConfig = (configService: ConfigService) =>
  ({
    secret: configService.get('JWT_SECRET'),
    expiresIn: '1h',
  }) as JwtModuleAsyncOptions;
