import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AnalyzeModule } from './analyze/analyze.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleTaskModule } from './schedule-task/schedule-task.module';
import { GetfilesModule } from './getfiles/getfiles.module';
import { EmailModule } from './email/email.module';
import { GetReportModule } from './get-report/get-report.module';

@Module({
  imports: [
    AnalyzeModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EmailModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    GetReportModule,
    ScheduleTaskModule,
    GetfilesModule,
  ],
})
export class AppModule {}
