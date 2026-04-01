// src/shared/config/configuration.ts
import { registerAs } from '@nestjs/config';
import * as z from 'zod';

const envVarsSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  MP_ACCESS_TOKEN: z.string().min(1),
  MP_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  APP_URL: z.string().url(),
  PORT: z.coerce.number().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envVarsSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  throw new Error('Environment validation failed');
}

export default registerAs('configuration', () => ({
  database: {
    url: parsed.data.DATABASE_URL,
  },
  jwt: {
    secret: parsed.data.JWT_SECRET,
    expiresIn: parsed.data.JWT_EXPIRES_IN,
  },
  mercadopago: {
    accessToken: parsed.data.MP_ACCESS_TOKEN,
    webhookSecret: parsed.data.MP_WEBHOOK_SECRET,
  },
  resend: {
    apiKey: parsed.data.RESEND_API_KEY,
    fromEmail: parsed.data.RESEND_FROM_EMAIL,
  },
  app: {
    url: parsed.data.APP_URL,
    port: parsed.data.PORT,
  },
  nodeEnv: parsed.data.NODE_ENV,
}));
