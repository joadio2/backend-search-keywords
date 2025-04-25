import { agenda } from '../agenda';
import { AnalyzeService } from '../../analyze/analyze.service';
import { getAnalyzeService } from '../utils/servicesFactory';
agenda.define('analyze task', async (job) => {
  const data = job.attrs.data;

  const analyzeService: AnalyzeService = await getAnalyzeService();

  await analyzeService.analyzeRunNow({
    urls: data.urls,
    email: data.email,
    keywords: data.keywords,
    userId: data.userId,
    schedule: true,
    reportType: data.reportType,
    tags: data.tags,
    title: data.title,
    scheduleAt: data.scheduleAt,
    repeatMonthly: data.repeatMonthly,
  });
});
