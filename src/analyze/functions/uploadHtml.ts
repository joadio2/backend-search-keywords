import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'test-html';

const ACCESS_KEY_ID = '9e23d42488bcfb2bb6862dec3d392f02';
const SECRET_ACCESS_KEY =
  'eb9d9729468c59f6073bad1b33d632989c149eb74a288926721d4257f099b2c1';

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
