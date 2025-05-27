import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'reports', strict: false })
export class Report extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
