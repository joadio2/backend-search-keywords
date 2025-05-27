type PageInput = {
  page: number;
  texts: { text: string }[];
};

export function pdfFilter(pages: PageInput[], keywords: string[]) {
  const matches: {
    id: string;
    text: string;
    matchedKeywords: string[];
    total: number;
    tp: 'html';
  }[] = [];

  const totalKeywords = keywords.length;
  const minMatches = Math.floor(totalKeywords / 2) + 1;

  for (const pageData of pages) {
    for (const { text: rawText } of pageData.texts) {
      let text = rawText.trim();
      text = text
        .replace(/[\n\+\-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!text) continue;

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
          id: pageData.page.toString(),
          text,
          matchedKeywords,
          total,
          tp: 'html',
        });
      }
    }
  }
  console.log(matches);
  return matches;
}
