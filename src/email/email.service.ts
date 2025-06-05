import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, title: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text: `Hi, your report is attached as an HTML file.`,
        html: this.generateEmailHtml(subject, title),
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  private generateEmailHtml(subject: string, title: string): string {
    const reportUrl = `https://frontend-search-keywords.onrender.com/report?title=${encodeURIComponent(title)}`;
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
              .button {
              display: inline-block;
              padding: 14px 28px;
              background-color: #1a73e8;
              color: #ffffff;
              font-weight: bold;
              border-radius: 6px;
              text-decoration: none;
              font-size: 16px;
              transition: background-color 0.3s ease;
            }
            .button:hover {
              background-color: #0f5fc2;
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
              <a class="button" href="${reportUrl}" target="_blank">View Report Online</a>
              <div class="footer">
                <p>Thanks for using our service!</p>
                <p>Report Keywords - DocHawk</p>
              </div>
            </div>
          </body>
        </html>
      `;
  }

  private formatDateTime(date: Date): string {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    });
  }

  async confirmScheduleEmail(
    subject: string,
    title: string,
    scheduledAt: Date,
    email: string,
  ): Promise<void> {
    try {
      const htmlContent = await this.generateConfirmationEmailHtml(
        subject,
        title,
        scheduledAt,
      );
      await this.mailerService.sendMail({
        to: email,
        subject,
        text: `Hi, your report is attached as an HTML file.`,
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  private async generateConfirmationEmailHtml(
    subject: string,
    title: string,
    scheduledAt: Date,
  ): Promise<string> {
    const formattedDate = this.formatDateTime(scheduledAt);

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f1f5f9;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
              text-align: center;
            }
            h1 {
              color: #1a73e8;
              margin-bottom: 16px;
            }
            p {
              font-size: 16px;
              margin-bottom: 16px;
            }
            
            .footer {
              font-size: 12px;
              color: #777;
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${subject}</h1>
            <p>Hello,</p>
            <p>Your keyword report titled <strong>${title}</strong> has been successfully scheduled.</p>
            <p><strong>Scheduled for:</strong><br>${formattedDate}</p>
            <div class="footer">
              <p>Thank you for using DocHawk</p>
              <p>&copy; ${new Date().getFullYear()} DocHawk Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
