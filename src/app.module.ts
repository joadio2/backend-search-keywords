import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AnalyzeModule } from './analyze/analyze.module';
import { OpenIaModule } from './open-ia/open-ia.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleTaskModule } from './schedule-task/schedule-task.module';
import { GetfilesModule } from './getfiles/getfiles.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    AnalyzeModule,
    OpenIaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleTaskModule,
    GetfilesModule,
    EmailModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
