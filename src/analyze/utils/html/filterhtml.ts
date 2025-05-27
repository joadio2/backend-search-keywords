import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';

export async function filterHtml(fileName: string, keywords: string[]) {
  const filePath = path.join(process.cwd(), 'files', fileName);
  const html = await fs.readFile(filePath, 'utf-8');
  const $ = cheerio.load(html);

  const matches: {
    id: string;
    text: string;
    matchedKeywords: string[];
    total: number;
    tp: 'html';
  }[] = [];

  const totalKeywords = keywords.length;
  const minMatches = Math.floor(totalKeywords / 2) + 1;

  $('*').each((_, el) => {
    const id = $(el).attr('id');
    if (!id) return;

    let text = $(el).text().trim();
    text = text
      .replace(/[\n\+\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!text) return;

    const matchedSet = new Set<string>();

    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        matchedSet.add(keyword.toLowerCase());
      }
    }

    const matchedKeywords = Array.from(matchedSet);
    const total = matchedKeywords.length;

    if (total >= minMatches) {
      matches.push({
        id,
        text,
        matchedKeywords,
        total,
        tp: 'html',
      });
    }
  });

  return matches;
}
