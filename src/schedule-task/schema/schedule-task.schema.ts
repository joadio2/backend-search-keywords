import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskDto } from '../dto/create-schedule-task.dto';

export type ScheduledJob = TaskDto & {
  _id: string;
  title: string;
  scheduledAt: Date;
  repeatMonthly: boolean;
  retries: number;
};

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  reportType: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  scheduledAt: Date;

  @Prop({ required: true })
  repeatMonthly: boolean;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: Object, required: true })
  data: TaskDto;

  @Prop({ default: 0 })
  retries: number;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);
