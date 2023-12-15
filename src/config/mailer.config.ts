import { ConfigService } from '@nestjs/config';

export const getMailerConfig = (configService: ConfigService) => {
  const isSmtpMock: boolean = !!+configService.get('USE_SMTP_MOCK');

  const transportConfig = !isSmtpMock
    ? {
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: +configService.get('EMAIL_PORT'),
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
      }
    : {
        transport: `smtp://admin:admin1@127.0.0.1:2500`, // XXX Mailsluper
      };

  return {
    ...transportConfig,
    defaults: {
      from: 'noreply@megak.headhunter.com',
    },
    template: {
      dir: '.',
      options: {
        strict: true,
      },
    },
  };
};
