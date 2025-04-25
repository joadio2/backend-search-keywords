import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('HOST'),
          port: configService.get('PORT_EMAIL'),
          secure: true,
          auth: {
            user: configService.get('EMAIL_N'),
            pass: configService.get('PASSWORD_EMAIL'),
          },
        },
        defaults: {
          from: '"Report Keywords" <your-email@gmail.com>',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
