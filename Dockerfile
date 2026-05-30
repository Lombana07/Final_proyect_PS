# ── Base ──────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# ── Desarrollo ────────────────────────────────────────
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ── Producción ────────────────────────────────────────
FROM base AS production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]