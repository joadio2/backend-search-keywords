import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AnalyzeModule } from './analyze/analyze.module';
import { OpenIaModule } from './open-ia/open-ia.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AnalyzeModule,
    OpenIaModule,
    MongooseModule.forRoot('mongodb://localhost:27017/test', {}),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
