import { Injectable, OnModuleInit } from '@nestjs/common';
import { agenda } from './agenda';
import '../schedule-task/jobs/analyze.job';
import { TaskDto } from './dto/create-schedule-task.dto';
import { ScheduledJob } from './dto/Schedule.interface';
import { promises } from 'dns';

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

  private getMonthlyCron(scheduleAt: string): string {
    const date = new Date(scheduleAt);
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();

    return `${minute} ${hour} ${day} * *`;
  }

  async getAll(userId: string): Promise<ScheduledJob[] | number> {
    try {
      const jobs = await agenda._collection
        .find(
          { 'data.userId': userId },
          {
            projection: {
              _id: 1,
              name: 1,
              'data.userId': 1,
              'data.reportType': 1,
              'data.title': 1,
              nextRunAt: 1,
            },
          },
        )
        .toArray();
      if (jobs.length === 0) {
        return 404;
      }
      return jobs as ScheduledJob[];
    } catch (err) {
      return 500;
    }
  }
}
