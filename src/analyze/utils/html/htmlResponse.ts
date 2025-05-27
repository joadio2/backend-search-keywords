import { htmlModified } from './htmlModified';
import { filterHtml } from './filterhtml';
import { purgeData } from './purgeData';
import { uploadFile } from 'src/analyze/functions/uploadHtml';
type HtmlMatch = {
  id: string;
  snippet: string;
  keywords: string[];
  total: number;
  score: number;
};
type ResponseData = {
  data: HtmlMatch[];
  htmlDoc: string;
};
export async function getHtmlResponse(
  html: string,
  keyword: string[],
  title: string,
): Promise<ResponseData> {
  try {
    const htmlDivided = await htmlModified(html);
    const filterdKeywords = await filterHtml(htmlDivided.fileName, keyword);
    const purgedData = await purgeData(filterdKeywords);
    const uploadHtml = await uploadFile(htmlDivided.html, title);
    return {
      data: purgedData,
      htmlDoc: uploadHtml,
    };
  } catch (error) {
    console.log(error);
  }
}
