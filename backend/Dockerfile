# ============================================
# Stage 1: Build
# ============================================
FROM node:20-slim AS build

# Instalar dependencias del sistema necesarias para el build
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar todas las dependencias (incluyendo dev)
RUN npm ci

# Copiar código fuente
COPY . .

# Build del proyecto
RUN node ace build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-slim

# Instalar dependencias del sistema para Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libxshmfence1 \
    libglib2.0-0 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root para seguridad
RUN groupadd -r nodeapp && useradd -r -g nodeapp -G audio,video nodeapp \
    && mkdir -p /home/nodeapp/Downloads \
    && chown -R nodeapp:nodeapp /home/nodeapp

# Configurar variables de entorno para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production \
    PORT=8080

WORKDIR /app

# Copiar el build desde la stage anterior
COPY --from=build --chown=nodeapp:nodeapp /app/build ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Cambiar al usuario no-root
USER nodeapp

# Exponer puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["node", "./bin/server.js"]
