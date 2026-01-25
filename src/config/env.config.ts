/* src/config/env.ts */

if (!process || !process.env) {
  console.error('❌ process.env is not available');
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/*                               ENV VALIDATION                                */
/* -------------------------------------------------------------------------- */

const REQUIRED_ENVS = [
  // App
  'PORT',
  'NODE_ENV',

  // Database
  'DATABASE_URL',

  // JWT
  'JWT_SECRET',
  'JWT_EXPIRES_IN',

  // Redis
  'REDIS_URL',

  // SMTP
  'SMTP_EMAIL_USER',
  'SMTP_EMAIL_PASSWORD',

  /* *****  AWS ***** */

  // S3
  'AWS_S3_BUCKET_REGION',
  'AWS_S3_BUCKET_NAME',

  // Rekognition
  'AWS_REKOGNITION_REGION',
  'AWS_REKOGNITION_COLLECTION_ID',

  // IAM
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
] as const;

for (const key of REQUIRED_ENVS) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

/* -------------------------------------------------------------------------- */
/*                              PROCESS SAFETY                                 */
/* -------------------------------------------------------------------------- */

process.on('exit', (code) => {
  console.log(`🛑 Process exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
  process.exit(1);
});

/* -------------------------------------------------------------------------- */
/*                                   ENV                                      */
/* -------------------------------------------------------------------------- */

export const ENV = Object.freeze({
  /* ------------------------------- APP ----------------------------------- */
  APP: {
    PORT: Number(process.env.PORT),
    ENVIRONMENT: process.env.NODE_ENV as 'development' | 'production' | 'test',
  },

  /* ------------------------------ DATABASE -------------------------------- */
  DATABASE: {
    URL: process.env.DATABASE_URL!,
    HOST: process.env.DB_HOST || '',
    PORT: Number(process.env.DB_PORT || 5432),
    USERNAME: process.env.DB_USERNAME || '',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_DATABASE || '',
  },

  /* -------------------------------- JWT ---------------------------------- */
  JWT: {
    SECRET: process.env.JWT_SECRET!,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN! || '30d',
  },

  /* -------------------------------- REDIS -------------------------------- */
  REDIS: {
    URL: process.env.REDIS_URL! || 'redis://localhost:6379',
  },

  /* -------------------------------- SMTP --------------------------------- */
  SMTP: {
    USER: process.env.SMTP_EMAIL_USER!,
    PASSWORD: process.env.SMTP_EMAIL_PASSWORD!,
  },

  /* -------------------------------- OTP ---------------------------------- */
  OTP: {
    SIGNUP_EXPIRY_SECONDS: Number(process.env.SIGNUP_OTP_EXPIRY_SECONDS || 300),
    FORGOT_PASSWORD_EXPIRY_SECONDS: Number(process.env.FORGOT_PASSWORD_OTP_EXPIRY_SECONDS || 3600),
  },

  /* ------------------------------- OAUTH --------------------------------- */
  OAUTH: {
    GOOGLE_API_URL: process.env.GOOGLE_OAUTH_API_URL || '',
  },

  /* -------------------------------- AWS ---------------------------------- */
  AWS: {
    IAM: {
      ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
      SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    },

    S3: {
      REGION: process.env.AWS_S3_BUCKET_REGION!,
      BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME!,
    },

    REKOGNITION: {
      REGION: process.env.AWS_REKOGNITION_REGION!,
      COLLECTION_ID: process.env.AWS_REKOGNITION_COLLECTION_ID!,
    },

    CLOUDFRONT: {
      URL: process.env.AWS_CLOUDFRONT_URL || '',
    },
  },
});
