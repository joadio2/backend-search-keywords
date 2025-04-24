import Handlebars from 'handlebars';
import { ReportData } from './interfaceMatches';
export const htmlReport = async (data: ReportData) => {
  try {
    const templateString = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Detailed Report</title>
        <style>
          body {
            width: 210mm;
            margin: 10px auto;
            border: 2px solid #939292;
            border-radius: 5px;
            padding: 0;
            font-family: "Roboto", sans-serif;
            background-color: #fff;
            color: #333;
          }
          .report-body {
            margin: 10px;
            padding: 10px;
          }
          .report-header {
            text-align: left;
            font-size: 16px;
            color: rgb(49, 49, 49);
            margin-bottom: 10px;
          }
          .report-header h1 {
            font-size: 26px;
            text-align: center;
            margin: 0;
          }
          .matches-section {
            margin-top: 30px;
          }
          .match-item {
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
          }
          .match-item h3 {
            font-size: 16px;
            color: #003366;
          }
          .tags {
            margin-top: 10px;
          }
          .tags span {
            background-color: #003366;
            color: white;
            padding: 5px 15px;
            margin-right: 10px;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="report-body">
          <div class="report-header">
            <h1>Detailed Report for URL:</h1>
            <h1>{{url}}</h1>
            <p><strong>Created By:</strong> {{createdBy.name}} ({{createdBy.role}})</p>
            <p><strong>Match Count:</strong> {{matchCount}}</p>
            <p><strong>Status:</strong> {{status}}</p>
            <p><strong>Report Type:</strong> {{reportType}}</p>
            <div class="tags">
              <strong>Tags:</strong>
              {{#each tags}}
                <span>{{this}}</span>
              {{/each}}
            </div>
          </div>

          <div class="matches-section">
            <h2>Matches:</h2>
            {{#each matches}}
              <div class="match-item">
                <h3>Keyword: "{{keyword}}"</h3>
                <p><strong>Context:</strong> {{context}}</p>
                {{#if page}}<p><strong>Page:</strong> {{page}}</p>{{/if}}
              </div>
            {{/each}}
          </div>
        </div>
      </body>
    </html>
        `;
    const template = Handlebars.compile(templateString);
    const html = template(data);
    return html;
  } catch (error) {
    console.error('Error to generate index.html', error);
  }
};
