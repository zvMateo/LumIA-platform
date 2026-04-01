import { registerAs } from '@nestjs/config';
import * as z from 'zod';

const envVarsSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  MP_ACCESS_TOKEN: z.string().min(1),
  MP_WEBHOOK_SECRET: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().positive().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  MAIL_FROM: z.string().email(),
  APP_URL: z.string().url(),
  PORT: z.coerce.number().positive().default(3001),
  N8N_WEBHOOK_URL: z
    .string()
    .url()
    .default('https://gmn8nwebhook.goodapps.space'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export default registerAs('configuration', () => {
  const parsed = envVarsSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Environment validation failed');
  }

  return {
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
    mail: {
      host: parsed.data.SMTP_HOST,
      port: parsed.data.SMTP_PORT,
      user: parsed.data.SMTP_USER,
      pass: parsed.data.SMTP_PASS,
      from: parsed.data.MAIL_FROM,
    },
    app: {
      url: parsed.data.APP_URL,
      port: parsed.data.PORT,
    },
    n8nWebhookUrl: parsed.data.N8N_WEBHOOK_URL,
    nodeEnv: parsed.data.NODE_ENV,
  };
});
