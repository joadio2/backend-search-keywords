import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { CreateScheduleTaskDto } from './dto/create-schedule-task.dto';

@Controller('schedule-task')
export class ScheduleTaskController {
  constructor(private readonly scheduleTaskService: ScheduleTaskService) {}

  @Post()
  create(@Body() createScheduleTaskDto: CreateScheduleTaskDto) {
    return this.scheduleTaskService.scheduleAnalyzeTask(createScheduleTaskDto);
  }
}
