# Configuración del Startup Command en Azure App Service

## ⚠️ IMPORTANTE: Configuración Actual

Para que Puppeteer funcione con GitHub Actions deployment en Azure App Service, necesitas configurar el **Startup Command**.

## 🔧 Pasos en Azure Portal

1. Ir a **Azure Portal** → Tu **App Service** (`club-el-meta`)
2. En el menú lateral, ir a **Configuration** → **General Settings**
3. En **Startup Command**, poner **EXACTAMENTE**:

```bash
apt-get update -yy && apt-get install -yy chromium && node bin/server.js
```

4. Click en **Save**
5. Esperar a que reinicie (30-60 segundos)

---

## 📋 Alternativa: Si el método chromium no funciona

Si ves errores como `libnspr4.so: cannot open shared object file`, usa este comando más completo:

```bash
apt-get update -yy && apt-get install -yy libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2 && node bin/server.js
```

---

## ❌ Errores Comunes

### Error: "Container didn't respond to HTTP pings"
**Causa**: El comando no termina con `node bin/server.js`
**Solución**: Asegúrate de que el startup command termine con `node bin/server.js`

### Error: "libnspr4.so: cannot open shared object file"
**Causa**: Faltan librerías compartidas
**Solución**: Usar el comando alternativo con más paquetes (arriba)

### Error: Timeout durante startup
**Causa**: Descargar muchos paquetes tarda mucho
**Solución**: 
1. Aumentar `WEBSITES_CONTAINER_START_TIME_LIMIT` a `1800` en Application Settings
2. O escalar a un SKU más grande (B2, P1v2, etc.)

---

## ✅ Verificar que funciona

1. Después de configurar el Startup Command, ir a **Log stream**
2. Deberías ver:
   ```
   Reading package lists...
   Building dependency tree...
   ...
   Unpacking chromium ...
   Setting up chromium ...
   Express and Puppeteer listening on port 8080
   ```

3. Probar generar un PDF desde tu app

---

## 🚀 Deployment con GitHub Actions

El archivo `.github/workflows/azure_club-el-meta.yml` ya está configurado para:
1. Build del backend con AdonisJS
2. Instalar Chromium en la cache de Puppeteer durante el build
3. Subir todo a Azure

**Push para deployar:**
```bash
git add .
git commit -m "Restore GitHub Actions workflow"
git push origin azure
```

---

## 📊 Variables de Entorno Necesarias en Azure

En **Configuration** → **Application settings**, asegúrate de tener:

```
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=5432
DB_USER=postgres.xxxxxxxxxxxxx
DB_PASSWORD=tu-password-de-supabase
DB_DATABASE=postgres
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Club El Meta <noreply@tudominio.com>
APP_KEY=tu-app-key-de-32-caracteres-minimo
CORS_ORIGIN=https://tu-frontend.vercel.app
FRONTEND_URL=https://tu-frontend.vercel.app
PORT=8080
PUPPETEER_CACHE_DIR=/home/site/wwwroot/.cache/puppeteer
WEBSITES_CONTAINER_START_TIME_LIMIT=1800
```

**NO necesitas** `PUPPETEER_EXECUTABLE_PATH` ni `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` con este método.

---

## 🐛 Ver Logs en Tiempo Real

```bash
# Opción 1: Azure Portal
Azure Portal → App Service → Monitoring → Log stream

# Opción 2: Azure CLI
az webapp log tail --name club-el-meta --resource-group tu-resource-group
```

---

## 💡 Resumen

1. ✅ Workflow de GitHub Actions restaurado
2. ⚙️ Configura Startup Command en Azure Portal
3. 🚀 Push a `origin azure` 
4. 📊 Verifica logs en Log stream
5. 🎯 Prueba generar PDF

El problema era que el `chromium` package solo no incluye todas las shared libraries necesarias, o el comando no termina con `node bin/server.js`.
