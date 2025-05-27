import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('HOST'),
          port: parseInt(configService.get('PORT_EMAIL'), 10),
          secure: true,
          auth: {
            user: configService.get('EMAIL_N'),
            pass: configService.get('PASSWORD_EMAIL'),
          },
        },
        defaults: {
          from: `"Report Keywords" <${configService.get('EMAIL_N')}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
