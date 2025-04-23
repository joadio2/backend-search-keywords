import axios from 'axios';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { htmlToText } from 'html-to-text';
import * as cheerio from 'cheerio';
import { URL } from 'url';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
};

export async function extractText(url: string): Promise<string[]> {
  console.log(`Procesando URL: ${url}`);

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: HEADERS,
  });

  const contentType = response.headers['content-type'];
  const texts: string[] = [];

  // if a webpage
  if (contentType.includes('text/html')) {
    const html = response.data.toString('utf-8');
    const $ = cheerio.load(html);
    const links: string[] = [];

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.match(/\.(pdf|docx|txt|html?)$/i)) {
        links.push(new URL(href, url).href);
      }
    });

    // Processes file links, extracting text from each and handling any errors.

    for (const link of links) {
      try {
        const fileText = await extractFileText(link);

        texts.push(fileText);
      } catch (err) {
        console.warn(`Error procesando archivo en ${link}:`, err.message);
      }
    }
  } else {
    const fileText = await extractFileText(url);
    texts.push(fileText);
  }

  return texts;
}

export async function extractFileText(url: string): Promise<string> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: HEADERS,
  });

  const contentType = response.headers['content-type'];

  // file type
  if (contentType.includes('pdf')) {
    const data = await pdfParse(response.data);
    return data.text;
  } else if (contentType.includes('wordprocessingml')) {
    const result = await mammoth.extractRawText({ buffer: response.data });
    return result.value;
  } else if (contentType.includes('text/plain')) {
    return response.data.toString('utf-8');
  } else if (contentType.includes('html')) {
    return htmlToText(response.data.toString('utf-8'));
  } else {
    throw new Error(`Tipo de archivo no soportado: ${contentType}`);
  }
}
