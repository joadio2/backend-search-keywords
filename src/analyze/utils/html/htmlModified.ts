import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { DirFiles } from '../dirFiles';
import { writeFile } from 'fs/promises';
import * as path from 'path';

type SegmentedHtml = {
  fileName: string;
  html: string;
};
export async function htmlModified(html: string): Promise<SegmentedHtml> {
  const $ = cheerio.load(html);

  const selectorsToId = [
    'span',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'li',
    'blockquote',
    'caption',
    'td',
    'th',
    'label',
    'pre',
    'em',
    'strong',
    'b',
    'i',
  ];

  const excludeSelectors = [
    'script',
    'style',
    'noscript',
    'header',
    'footer',
    'meta',
    'link',
    'title',
    'svg',
  ];

  let idCounter = 1;

  const excludedNodes = new Set<Element>();

  excludeSelectors.forEach((sel) => {
    $(sel).each((_, el) => {
      excludedNodes.add(el as Element);
      $(el)
        .find('*')
        .each((_, child) => {
          excludedNodes.add(child as Element);
        });
    });
  });

  selectorsToId.forEach((selector) => {
    $(selector).each((_, el) => {
      const element = el as Element;
      if (!$(el).attr('id') && !excludedNodes.has(element)) {
        $(el).attr('id', `seg-${idCounter++}`);
      }
    });
  });

  const segmentedHtml = $.html();
  const dir = await DirFiles();
  const fileName = `segmented-${Date.now()}.html`;
  const filePath = path.join(dir, fileName);
  await writeFile(filePath, segmentedHtml, 'utf-8');

  return {
    fileName: fileName,
    html: segmentedHtml,
  };
}
