import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  Get,
  Param,
} from '@nestjs/common';
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

      return res.status(HttpStatus.CREATED).json({
        message: 'Task scheduled successfully',
        scheduleTask: scheduleTask,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al programar la tarea',
        error: error.message,
      });
    }
  }
  @Get(':id')
  async geTask(@Param('id') id: string, @Res() res: Response) {
    try {
      const scheduleTask = await this.scheduleTaskService.getAll(id);
      if (scheduleTask === 404) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Not found schedule task',
        });
      }
      if (scheduleTask === 500) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Error to obtain schedule task',
        });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Task obtained successfully',
        data: scheduleTask,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al obtener la tarea',
        error: error.message,
      });
    }
  }
}
