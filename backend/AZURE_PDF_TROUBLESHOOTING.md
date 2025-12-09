# Solución de Problemas - Generación de PDFs en Azure Web Service

## Problema Identificado

La generación de PDFs con Puppeteer falla en Azure Web Service por las siguientes razones:

1. **Chromium requiere dependencias del sistema** que no están instaladas por defecto en Azure App Service
2. **Limitaciones de memoria** en planes básicos de App Service
3. **Permisos de ejecución** para Chromium
4. **Rutas de archivos** que pueden no estar disponibles en el build

---

## Soluciones Implementadas

### 1. Mejoras en el Código

- ✅ Agregados logs detallados para debugging
- ✅ Agregadas flags de Puppeteer para Azure (`--no-sandbox`, `--disable-setuid-sandbox`, `--single-process`)
- ✅ Manejo de errores mejorado con información detallada
- ✅ Variable de entorno `PUPPETEER_EXECUTABLE_PATH` para configurar la ruta de Chromium

### 2. Configuración de Azure (IMPORTANTE)

Debes realizar los siguientes pasos en Azure Portal:

#### A. Configurar Variables de Entorno

1. Ir a **Azure Portal** → Tu **App Service**
2. En el menú lateral, ir a **Configuration** → **Application settings**
3. Agregar las siguientes variables:

```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = false
PUPPETEER_EXECUTABLE_PATH = /usr/bin/chromium-browser
WEBSITE_NODE_DEFAULT_VERSION = 20-lts
```

4. Click en **Save** y confirmar el reinicio

#### B. Aumentar el Plan de App Service (Si es necesario)

Si estás en el plan **Free (F1)** o **Shared (D1)**:

1. Ir a **Scale up (App Service plan)**
2. Cambiar al menos a **Basic B1** (tiene más memoria RAM)
3. Puppeteer requiere al menos **512MB de RAM** para funcionar

#### C. Habilitar Logging Detallado

1. Ir a **Monitoring** → **App Service logs**
2. Activar:
   - **Application Logging (Filesystem)**: On, Level: Information
   - **Detailed Error Messages**: On
   - **Failed Request Tracing**: On
   - **Web server logging**: File System
3. Configurar **Retention Period (Days)**: 7 días
4. Click en **Save**

---

## Cómo Ver los Logs en Azure

### Opción 1: Log Stream en Tiempo Real (Recomendado)

1. En **Azure Portal**, ir a tu **App Service**
2. En el menú lateral, ir a **Monitoring** → **Log stream**
3. Seleccionar **Application logs** o **Web server logs**
4. Verás logs en tiempo real, incluyendo:
   - Intentos de lanzar Puppeteer
   - Rutas de archivos que se intentan cargar
   - Errores específicos de Chromium

### Opción 2: Descargar Logs Completos

1. Ir a **Development Tools** → **Advanced Tools** → **Go**
2. Se abrirá **Kudu** (panel de administración avanzado)
3. Ir a **Tools** → **Zip** para descargar logs completos
4. O ir a **Debug console** → **CMD** → navegar a `LogFiles/Application`

### Opción 3: Usando Azure CLI (Local)

```bash
# Instalar Azure CLI
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login
az login

# Ver logs en tiempo real
az webapp log tail --name <nombre-app-service> --resource-group <nombre-resource-group>

# Descargar logs
az webapp log download --name <nombre-app-service> --resource-group <nombre-resource-group> --log-file logs.zip
```

### Opción 4: VS Code Extension

1. Instalar extensión **Azure App Service** en VS Code
2. Conectar tu cuenta de Azure
3. Click derecho en tu App Service → **Start Streaming Logs**

---

## Verificar el Problema

### Logs a Buscar

Cuando intentes generar un PDF, busca en los logs:

```
Iniciando Puppeteer para generar PDF...
Intentando cargar plantilla desde: [ruta]
Intentando cargar logo desde: [ruta]
Intentando cargar CSS desde: [ruta]
```

### Errores Comunes

#### Error 1: "Failed to launch the browser process"
```
Error: Failed to launch the browser process!
```
**Solución**: Chromium no está instalado o no tiene permisos. Necesitas usar un App Service con Docker o cambiar a Azure Container Instances.

#### Error 2: "ENOENT: no such file or directory"
```
Error: ENOENT: no such file or directory, open '/home/site/wwwroot/build/app/resources/...'
```
**Solución**: Los archivos de resources no se copiaron al build. Verifica `tsconfig.json` y que los archivos estén en la carpeta correcta.

#### Error 3: "Cannot find module 'puppeteer'"
```
Error: Cannot find module 'puppeteer'
```
**Solución**: Las dependencias no se instalaron. Verifica que `npm install` se ejecute en el deployment.

---

## Solución Alternativa: Usar Azure Container Instances (Recomendado para Producción)

Si los problemas persisten, la mejor solución es usar Docker:

### 1. Crear Dockerfile

```dockerfile
FROM node:20-slim

# Instalar dependencias de Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer para usar Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3333

CMD ["node", "bin/server.js"]
```

### 2. Desplegar a Azure Container Registry

```bash
# Build de la imagen
docker build -t club-meta-backend .

# Push a Azure Container Registry
az acr login --name <tu-registry>
docker tag club-meta-backend <tu-registry>.azurecr.io/club-meta-backend:latest
docker push <tu-registry>.azurecr.io/club-meta-backend:latest
```

---

## Verificación Post-Deploy

### 1. Probar Endpoint de Salud

```bash
curl https://<tu-app>.azurewebsites.net/health
```

### 2. Probar Generación de PDF

```bash
# Usar el endpoint que genera PDF (ajustar según tu API)
curl -X POST https://<tu-app>.azurewebsites.net/api/cotizaciones/<id>/pdf
```

### 3. Revisar Logs Inmediatamente

Después de probar, revisar los logs para ver:
- Si Puppeteer se inicia correctamente
- Si encuentra los archivos de resources
- Si hay errores de memoria o permisos

---

## Checklist de Configuración

- [ ] Variables de entorno configuradas en Azure
- [ ] App Service logs habilitados
- [ ] Plan de App Service al menos B1 (512MB RAM)
- [ ] Archivos de resources incluidos en el build
- [ ] Código con logs detallados desplegado
- [ ] Logs revisados después de deployment

---

## Contacto

Si después de seguir estos pasos el problema persiste, revisar los logs detallados y compartirlos para análisis adicional.
