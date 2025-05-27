import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'test-html';

const ACCESS_KEY_ID = 'ceb8d6f9c0883133fc6efa395fd95d44';
const SECRET_ACCESS_KEY =
  '63f991228e716cf768c1fc8ec477bfd611f8073cb7cc8fce6f2197041d947d4d';

const R2_ENDPOINT =
  'https://ed5e9f2a9f6742d593d025c023d72040.r2.cloudflarestorage.com';
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
    const fileName = `${title}-${Date.now()}.html`;

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
