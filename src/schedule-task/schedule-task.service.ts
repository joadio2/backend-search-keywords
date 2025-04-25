import { Injectable, OnModuleInit } from '@nestjs/common';
import { agenda } from './agenda';
import '../schedule-task/jobs/analyze.job';
import { TaskDto } from './dto/create-schedule-task.dto';

@Injectable()
export class ScheduleTaskService implements OnModuleInit {
  onModuleInit() {
    this.startAgenda();
  }

  private async startAgenda() {
    await agenda.start();
    console.log('Agenda started ');
  }

  async scheduleAnalyzeTask(payload: TaskDto) {
    const { scheduleAt, repeatMonthly } = payload;

    if (repeatMonthly) {
      const cronExpression = this.getMonthlyCron(scheduleAt);
      await agenda.every(cronExpression, 'analyze task', payload);
      console.log(`Task scheduled to repeat every month for ${scheduleAt}`);
    } else {
      await agenda.schedule(scheduleAt, 'analyze task', payload);
      console.log(`Task scheduled for ${scheduleAt}`);
    }
    return {
      message: 'Task scheduled successfully',
      repeatMonthly,
      scheduleAt,
    };
  }

  // Función para obtener la expresión cron mensual
  private getMonthlyCron(scheduleAt: string): string {
    const date = new Date(scheduleAt);
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();

    return `${minute} ${hour} ${day} * *`;
  }
}
