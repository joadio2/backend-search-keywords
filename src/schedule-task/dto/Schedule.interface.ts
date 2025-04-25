export interface ScheduledJob {
  _id: any;
  name: string;
  data: {
    userId: string;
    reportType: string;
    title: string;
  };
  type: string;
  nextRunAt?: Date;
}
