import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskDto } from './dto/create-schedule-task.dto';
import { AnalyzeService } from '../analyze/analyze.service';
import {
  ScheduledJob,
  Task,
  TaskDocument,
} from './schema/schedule-task.schema';
import { EmailService } from 'src/email/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleTaskService {
  private readonly logger = new Logger(ScheduleTaskService.name);
  private readonly maxRetries = 3;

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly analyzeService: AnalyzeService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * 🚀 Triggered every minute via Cron to check and run pending tasks.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.log('⏰ Cron job started - checking for pending tasks...');
    await this.checkAndRunTasks();
  }

  /**
   * 📝 Schedules a new task based on user-provided input.
   */
  async scheduleAnalyzeTask(payload: TaskDto) {
    try {
      this.logger.log('📦 Scheduling new task with payload:', payload);

      if (!payload.title || !payload.scheduleAt || !payload.userId) {
        throw new Error('Missing required fields');
      }

      const newTask = new this.taskModel({
        scheduledAt: new Date(payload.scheduleAt),
        repeatMonthly: payload.repeatMonthly || false,
        retries: 0,
        userId: payload.userId,
        title: payload.title,
        email: payload.email,
        reportType: payload.reportType,
        tags: payload.tags,
        data: payload,
      });

      await newTask.save();
      this.logger.log(
        `✅ Task scheduled for ${newTask.scheduledAt.toISOString()} (repeat: ${newTask.repeatMonthly})`,
      );

      await this.emailService.confirmScheduleEmail(
        'Keyword Report',
        payload.title,
        newTask.scheduledAt,
        payload.email,
      );

      return {
        message: 'Task scheduled successfully',
        repeatMonthly: newTask.repeatMonthly,
        scheduledAt: newTask.scheduledAt,
        status: 200,
      };
    } catch (error) {
      this.logger.error(`❌ Failed to schedule task: ${error.message}`);
      return {
        message: 'Error scheduling task',
        error: error.message,
        status: 500,
      };
    }
  }

  /**
   * 🧠 Executes the analysis logic for a given scheduled task.
   */
  private async runTask(task: TaskDocument) {
    this.logger.log(`🔍 Running task [${task._id}] - title: "${task.title}"`);

    try {
      await this.analyzeService.analyzeRunNow(task.data);
      this.logger.log(`✅ Task [${task._id}] executed successfully`);
    } catch (err) {
      this.logger.error(`❌ Failed to run task [${task._id}]: ${err.message}`);
      throw err;
    }
  }

  /**
   * 📅 Adds one month to a given date (used for recurring tasks).
   */
  private addOneMonth(date: Date): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
  }

  async checkAndRunTasks() {
    const now = new Date();
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);

    this.logger.log(
      `🕒 Checking tasks scheduled before ${in1Hour.toISOString()}`,
    );

    const tasks = await this.taskModel.find({
      scheduledAt: { $lte: in1Hour },
    });

    this.logger.log(`📋 Found ${tasks.length} task(s) ready to run`);

    for (const task of tasks) {
      try {
        await this.runTask(task);

        if (task.repeatMonthly) {
          task.scheduledAt = this.addOneMonth(task.scheduledAt);
          task.retries = 0;
          await task.save();
          this.logger.log(`🔁 Task [${task._id}] rescheduled for next month`);
        } else {
          await this.taskModel.deleteOne({ _id: task._id });
          this.logger.log(`🗑️ Task [${task._id}] executed and deleted`);
        }
      } catch (err) {
        task.retries = (task.retries || 0) + 1;

        if (task.retries >= this.maxRetries) {
          await this.taskModel.deleteOne({ _id: task._id });
          this.logger.warn(
            `⚠️ Task [${task._id}] deleted after ${this.maxRetries} failed attempts`,
          );
        } else {
          task.scheduledAt = new Date(Date.now() + 60 * 1000); // Retry in 1 minute
          await task.save();
          this.logger.log(
            `⏳ Task [${task._id}] will retry in 1 minute (attempt #${task.retries})`,
          );
        }
      }
    }
  }
  async getAll(userId: string): Promise<ScheduledJob[] | number> {
    try {
      const tasks = await this.taskModel
        .find({ userId })
        .select('_id title scheduledAt repeatMonthly retries')
        .lean<ScheduledJob[]>();
      console.log(tasks);
      if (tasks.length === 0) return 404;
      return tasks;
    } catch (err) {
      this.logger.error(err);
      return 500;
    }
  }
}
