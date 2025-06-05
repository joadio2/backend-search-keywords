import { Module } from '@nestjs/common';
import { HealtService } from './healt.service';
import { HealtController } from './healt.controller';

@Module({
  controllers: [HealtController],
  providers: [HealtService],
})
export class HealtModule {}
