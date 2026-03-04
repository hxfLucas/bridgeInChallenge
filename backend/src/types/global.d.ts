import 'express-serve-static-core';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGO_URI?: string;
      CORS_ALLOWED_ORIGINS?: string;
      EMAIL_ENABLED?: string;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    context?: any;
  }
}
