import * as dotenv from 'dotenv';

dotenv.config();

export const __prod__ = process.env.NODE_ENV === 'production';
