import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { ScheduleTaskController } from './schedule-task.controller';
import { AnalyzeModule } from '../analyze/analyze.module';
import { Task, TaskSchema } from './schema/schedule-task.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from 'src/email/email.module';
@Module({
  controllers: [ScheduleTaskController],
  providers: [ScheduleTaskService],
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    AnalyzeModule,
    ScheduleModule.forRoot(),
    EmailModule,
  ],
})
export class ScheduleTaskModule {}
