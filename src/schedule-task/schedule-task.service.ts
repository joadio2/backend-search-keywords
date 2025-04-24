import { Injectable, OnModuleInit } from '@nestjs/common';
import { agenda } from './agenda';
import '../schedule-task/jobs/analyze.job';
import { CreateScheduleTaskDto } from './dto/create-schedule-task.dto';

@Injectable()
export class ScheduleTaskService implements OnModuleInit {
  onModuleInit() {
    this.startAgenda();
  }

  private async startAgenda() {
    await agenda.start();
    console.log('Agenda started ');
  }

  async scheduleAnalyzeTask(payload: CreateScheduleTaskDto) {
    await agenda.schedule(payload.scheduleAt, 'analyze task', payload);
    console.log(`Task scheduled for ${payload.scheduleAt}`);
  }
}
