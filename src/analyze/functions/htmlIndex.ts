import Handlebars from 'handlebars';

interface IndexData {
  urls: string[];
  keywords: string[];
}

export const htmlIndex = async (data: IndexData) => {
  try {
    const transformData = data.urls.map((url, i) => ({
      index: i + 1,
      url,
      keywords: data.keywords,
    }));

    const templateString = `
     <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Keyword Index Report</title>
  <style>
    body {
        width: 210mm;
        margin: 0 auto;
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        color: #333;
    }

    .report-header {
      margin-left: 10px;
      text-align: left;
      font-size: 18px;  
      color: rgb(49, 49, 49);
      margin: 0;
      padding-bottom: 10px;
    }

    .keywords-summary {
      margin-left: 15px;
      font-size: 16px;
      color: #003366;
      margin-bottom: 20px;
    }

    .keywords-summary span {
      background-color: #003366;
      color: white;
      padding: 5px 15px;
      margin-right: 10px;
      border-radius: 5px;
    }

    .report-body {
      margin: 20px;
    }

    .url-section {
      margin-bottom: 30px;
    }

    .url-section h2 {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #003366;
    }

    .keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 14px;
      color: #555;
      margin-top: 10px;
    }

    .keywords span {
      background-color: #003366;
      color: white;
      padding: 5px 12px;
      border-radius: 4px;
    }

    .keywords span:hover {
      background-color: #005699;
    }
  </style>
</head>
<body>

  <div class="report-header">
    <h1>Keyword Index Report</h1>
  </div>

  <!-- show all keywords -->
  <div class="keywords-summary">
    <h3>Keywords for all URLs:</h3>
    <div class="keywords">
      {{#each keywords}}
        <span>{{this}}</span>
      {{/each}}
    </div>
  </div>

  <div class="report-body">
    <!-- show Url -->
    {{#each urls}}
      <div class="url-section">
        <h2>{{index}}. URL: {{this.url}}</h2>
      </div>
    {{/each}}
  </div>

</body>
</html>
    `;

    const template = Handlebars.compile(templateString);

    const html = template({ urls: transformData, keywords: data.keywords });

    return html;
  } catch (error) {
    console.error('Error to generate index.html', error);
  }
};
