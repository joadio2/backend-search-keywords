function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function analyzeMatchesInText(texts: string[], keywords: string[]) {
  const allMatches = [];

  console.log(`🧠 Starting text analysis with ${texts.length} blocks`);
  console.log(`🔍 Keywords:`, keywords);

  for (const kw of keywords) {
    const escapedKw = escapeRegExp(kw);
    const matches = [];
    const regex = new RegExp(
      `([\\s\\S]{0,100}?)(\\b${escapedKw}\\b)([\\s\\S]{0,100}?)`,
      'gi',
    );

    for (const text of texts) {
      const found = [...text.matchAll(regex)];

      for (const match of found) {
        let before = match[1];
        const keyword = match[2];
        let after = match[3];

        // Context trimming based on punctuation
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
      console.log(`✅ "${kw}" → ${matches.length} matches found`);
      console.log(`🔸 Example context: "${matches[0].context}"`);
      allMatches.push(...matches);
    } else {
      console.log(`⚠️ "${kw}" → 0 matches`);
    }
  }

  console.log(`📊 Total matches found: ${allMatches.length}`);
  return allMatches;
}
