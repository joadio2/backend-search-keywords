import { pdfFilter } from './pdfFilter';
import { purgeData } from '../html/purgeData';
type PageInput = {
  page: number;
  texts: { text: string }[];
};
export async function getPdfResponse(pages: PageInput[], keywords: string[]) {
  const filteredPages = pdfFilter(pages, keywords);
  const purgedData = await purgeData(filteredPages);

  return purgedData;
}
