# VocTest IA

Test vocacional con IA · NestJS + Next.js + MercadoPago

## Setup (5 pasos)

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno
cp api/.env.example api/.env        # editar con tus credenciales
cp web/.env.local.example web/.env.local

# 3. Crear y migrar la base de datos
pnpm db:generate && pnpm db:migrate

# 4. Iniciar en desarrollo
pnpm dev
```

**URLs:** Frontend → http://localhost:3000 · API → http://localhost:3001

## Variables de entorno clave

| Variable | Dónde | Descripción |
|---|---|---|
| `DATABASE_URL` | `api/.env` | PostgreSQL connection string |
| `JWT_SECRET` | `api/.env` | Secret para tokens JWT |
| `MP_ACCESS_TOKEN` | `api/.env` | MercadoPago access token |
| `N8N_WEBHOOK_URL` | `api/.env` | URL base del webhook n8n |
| `SMTP_HOST/PORT/USER/PASS` | `api/.env` | Gmail SMTP para emails |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | `web/.env.local` | MercadoPago public key |
