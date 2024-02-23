import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  server: {
    port: Number(process.env.PORT) || 3001,
  },
};

export default config;