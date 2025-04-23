import { Schema } from 'mongoose';

export const ReportMatchSchema = new Schema({
  keyword: { type: String, required: true },
  context: { type: String, required: true },
  page: { type: Number, required: false },
});

export const ReportUserSchema = new Schema({
  userId: { type: Number, required: true },
  name: { type: String, required: false },
  role: { type: String, required: false },
});

export const ReportSchema = new Schema(
  {
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: ReportUserSchema, required: true },
    isScheduled: { type: Boolean, required: true },
    reportType: { type: String, required: true },
    status: {
      type: String,
      enum: ['pendiente', 'procesando', 'finalizado', 'fallido'],
      default: 'pendiente',
    },
    matchCount: { type: Number, required: true },
    matches: {
      type: [ReportMatchSchema],
      required: true,
      validate: {
        validator: (matches) => matches.length > 0,
        message: 'Debe haber al menos una coincidencia.',
      },
    },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);
