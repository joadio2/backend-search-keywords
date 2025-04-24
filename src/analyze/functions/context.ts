export function analyzeMatchesInText(texts: string[], keywords: string[]) {
  const allMatches = [];

  for (const kw of keywords) {
    const matches = [];

    for (const text of texts) {
      const regex = new RegExp(
        `([\\s\\S]{0,100}?)(\\b${kw}\\b)([\\s\\S]{0,100}?)`,
        'gi',
      );
      const found = [...text.matchAll(regex)];

      for (const match of found) {
        let before = match[1];
        const keyword = match[2];
        let after = match[3];

        // variants of punctuation for improved context
        const backCut = Math.max(
          before.lastIndexOf('.'),
          before.lastIndexOf('('),
          before.lastIndexOf('¿'),
          before.lastIndexOf('¡'),
          before.lastIndexOf('!'),
        );
        if (backCut !== -1) {
          before = before.slice(backCut + 1).trimStart();
        }

        // Cut forward if there is a punctuation nearby
        const forwardCut = after.search(/[.?!¡)]/);
        if (forwardCut !== -1) {
          after = after.slice(0, forwardCut + 1).trimEnd();
        }

        const context = `${before} ${keyword} ${after}`.trim();

        matches.push({
          keyword: kw,
          context,
        });
      }
    }

    if (matches.length > 0) {
      allMatches.push(...matches);
    }
  }

  return allMatches;
}
