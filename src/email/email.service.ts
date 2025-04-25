import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    reportHtml: string,
    title: string,
  ): Promise<void> {
    const htmlFilePath = await this.createHtmlFile(reportHtml, title);
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text: `Hi, your report is attached as an HTML file.`,
        html: this.generateEmailHtml(subject),
        attachments: [
          {
            filename: 'report.html',
            path: htmlFilePath,
            contentType: 'text/html',
          },
        ],
      });
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      this.deleteHtmlFile(htmlFilePath);
    }
  }

  private async createHtmlFile(
    htmlContent: string,
    title: string,
  ): Promise<string> {
    const dirPath = join(__dirname, 'tmp');

    try {
      mkdirSync(dirPath, { recursive: true });
    } catch (error) {
      console.error('Error creating tmp directory:', error);
    }

    const filePath = join(dirPath, `${title}-${Date.now()}.html`);
    writeFileSync(filePath, htmlContent);
    return filePath;
  }

  private deleteHtmlFile(filePath: string): void {
    try {
      unlinkSync(filePath);
      console.log(`File ${filePath} has been deleted.`);
    } catch (error) {
      console.error('Error deleting HTML file:', error);
    }
  }

  private generateEmailHtml(subject: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fc;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #fff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            h1 {
              color: #1a73e8;
            }
            p {
              color: #555;
              font-size: 16px;
              margin-bottom: 24px;
            }
            .footer {
              font-size: 12px;
              color: #888;
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${subject}</h1>
            <p>Hi,</p>
            <p>Your keyword report is attached as an HTML file.</p>
            <div class="footer">
              <p>Thanks for using our service!</p>
              <p>Report Keywords - DocHawk</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
