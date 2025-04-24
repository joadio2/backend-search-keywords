import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { ScheduleTaskController } from './schedule-task.controller';

@Module({
  controllers: [ScheduleTaskController],
  providers: [ScheduleTaskService],
})
export class ScheduleTaskModule {}
