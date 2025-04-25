import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { TaskDto } from './dto/create-schedule-task.dto';
import { Response } from 'express'; // Necesario para usar @Res()

@Controller('schedule-task')
export class ScheduleTaskController {
  constructor(private readonly scheduleTaskService: ScheduleTaskService) {}

  @Post()
  async create(@Body() createScheduleTaskDto: TaskDto, @Res() res: Response) {
    try {
      const scheduleTask = await this.scheduleTaskService.scheduleAnalyzeTask(
        createScheduleTaskDto,
      );

      return res.status(HttpStatus.CREATED).json(scheduleTask);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al programar la tarea',
        error: error.message,
      });
    }
  }
}
