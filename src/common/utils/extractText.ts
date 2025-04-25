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

// Allowed file extensions
const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.docx', '.txt'];

export async function extractText(url: string): Promise<string[]> {
  console.log(`Processing URL: ${url}`);

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: HEADERS,
  });

  const contentType = response.headers['content-type'];
  const texts: string[] = [];

  // If it's a webpage
  if (contentType.includes('text/html')) {
    const html = response.data.toString('utf-8');
    const $ = cheerio.load(html);

    // Remove irrelevant elements from the HTML (like headers, scripts, etc.)
    $('header, footer, nav, script, style').remove();

    // Extract only the content from the body
    const bodyText = $('body').text().trim();

    // If there is text in the body, add it to the results
    if (bodyText) {
      texts.push(bodyText);
    }

    // Search for valid file links on the page
    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && isValidFileLink(href)) {
        links.push(new URL(href, url).href);
      }
    });

    // Process the file links found
    for (const link of links) {
      try {
        const fileText = await extractFileText(link);
        texts.push(fileText);
      } catch (err) {
        console.warn(`Error processing file at ${link}:`, err.message);
      }
    }
  } else {
    // If it's a direct file, extract the text
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

  // Determine file type and extract text accordingly
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
    throw new Error(`Unsupported file type: ${contentType}`);
  }
}

// Validate if the file link is allowed
function isValidFileLink(link: string): boolean {
  const urlObj = new URL(link, 'https://example.com'); // 'https://example.com' is just a placeholder
  const ext = urlObj.pathname
    .slice(urlObj.pathname.lastIndexOf('.'))
    .toLowerCase();

  return ALLOWED_FILE_EXTENSIONS.includes(ext);
}
