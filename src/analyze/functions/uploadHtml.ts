import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'test-html';

const ACCESS_KEY_ID = ;
const SECRET_ACCESS_KEY =;

const R2_ENDPOINT =;
const PUBLIC_URL_BASE = 'https://pub-101845c0643f4f30b922d9ae7cfe586d.r2.dev';

const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export async function uploadFile(
  htmlContent: string,
  title: string,
): Promise<string> {
  try {
    const fileName = `${title}.html`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(htmlContent, 'utf-8'),
      ContentType: 'text/html',
      ACL: 'public-read',
    });

    await s3.send(command);

    const publicUrl = `${PUBLIC_URL_BASE}/${fileName}`;
    return publicUrl;
  } catch (error) {
    return 'Failed to upload file to S3';
  }
}
