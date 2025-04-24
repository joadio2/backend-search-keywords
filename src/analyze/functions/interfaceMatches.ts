export interface Match {
  keyword: string;
  context: string;
  page?: number;
}

export interface ReportData {
  _id?: string;
  url: string;
  createdBy: {
    userId: number;
    name: string;
    role: string;
  };
  isScheduled: boolean;
  reportType: string;
  status: string;
  matchCount: number;
  matches: Match[];
  tags: string[];
}
