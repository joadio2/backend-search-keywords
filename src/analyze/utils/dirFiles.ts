import { mkdir } from 'fs/promises';
import * as path from 'path';

export async function DirFiles() {
  const dir = path.join(process.cwd(), 'files');
  try {
    await mkdir(dir, { recursive: true });
  } catch {
    console.log('error');
  }
  return dir;
}
