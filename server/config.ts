import path from 'path';

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  jwtSecret: string;
  geminiApiKey: string | null;
  maxFileUploadBytes: number;
  dataDir: string;
  storeFilePath: string;
}

export const config: AppConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  nodeEnv: (process.env.NODE_ENV as any) || 'development',
  jwtSecret: process.env.JWT_SECRET || 'signaledge_dev_secret_key_2026',
  geminiApiKey: process.env.GEMINI_API_KEY || null,
  maxFileUploadBytes: process.env.MAX_FILE_UPLOAD_BYTES
    ? parseInt(process.env.MAX_FILE_UPLOAD_BYTES, 10)
    : 5 * 1024 * 1024, // 5MB
  dataDir: path.join(process.cwd(), 'data'),
  storeFilePath: path.join(process.cwd(), 'data', 'store.json'),
};
