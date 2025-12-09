# Guía de Despliegue con Docker en Azure

## Opción 1: Azure Container Registry + Web App (Recomendada)

Esta es la forma más integrada con Azure, similar a lo que tienes ahora pero con Docker.

### Paso 1: Crear Azure Container Registry (ACR)

1. En **Azure Portal**, buscar **Container registries**
2. Click en **Create**
3. Configurar:
   - **Resource group**: Usar el mismo de tu App Service
   - **Registry name**: `clubmetaregistry` (debe ser único)
   - **Location**: `East US` (misma región que tu app)
   - **SKU**: `Basic` (más barato, suficiente para este proyecto)
4. Click en **Review + create** → **Create**

### Paso 2: Configurar GitHub Actions para Docker

El workflow ya no necesita hacer build de Node.js, solo construir y subir la imagen Docker.

Actualiza `.github/workflows/azure_club-el-meta.yml`:

```yaml
name: Build and deploy Docker container to Azure Web App

on:
  push:
    branches:
      - azure
  workflow_dispatch:

env:
  REGISTRY: clubmetaregistry.azurecr.io
  IMAGE_NAME: club-meta-backend

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: ${{ env.REGISTRY }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}

      - name: Build and push Docker image
        working-directory: ./backend
        run: |
          docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} .
          docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest .
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

      - name: Login to Azure
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZUREAPPSERVICE_CLIENTID_530545F87EFB409EB12C07B9B57C14C7 }}
          tenant-id: ${{ secrets.AZUREAPPSERVICE_TENANTID_CB63DDFB7F274979BFB13A3A75E0CFEC }}
          subscription-id: ${{ secrets.AZUREAPPSERVICE_SUBSCRIPTIONID_960F02193C8C480D89E429F8693F8C43 }}

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'club-el-meta'
          slot-name: 'Production'
          images: '${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}'
```

### Paso 3: Obtener Credenciales de ACR

1. En Azure Portal, ir a tu **Container Registry**
2. En el menú lateral, ir a **Access keys**
3. Habilitar **Admin user**
4. Copiar **Username** y **Password**

### Paso 4: Configurar Secrets en GitHub

1. En tu repositorio de GitHub: **Settings** → **Secrets and variables** → **Actions**
2. Agregar nuevos secrets:
   - `ACR_USERNAME`: El username del ACR
   - `ACR_PASSWORD`: El password del ACR

### Paso 5: Configurar Web App para usar Docker

1. En Azure Portal, ir a tu **App Service** (`club-el-meta`)
2. En **Deployment Center**:
   - **Source**: Container Registry
   - **Registry**: Azure Container Registry
   - **Registry name**: `clubmetaregistry`
   - **Image**: `club-meta-backend`
   - **Tag**: `latest`
   - **Continuous deployment**: On
3. Click en **Save**

### Paso 6: Configurar Variables de Entorno

En **Configuration** → **Application settings**, las mismas variables pero SIN las de Puppeteer:

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

# WhatsApp (opcional)
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAVxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_API_VERSION=v22.0
```

**NOTA**: Ya NO necesitas `PUPPETEER_*` porque Chromium viene en el Docker.

### Paso 7: Deploy

1. Hacer commit y push:
```bash
git add .
git commit -m "Configure Docker deployment with Puppeteer"
git push origin azure
```

2. Ver progreso en GitHub Actions
3. Esperar a que termine (primera vez tarda ~5-10 min)
4. Probar la app

---

## Opción 2: Azure Container Instances (Más Simple)

Si quieres algo más simple y barato:

### Configuración Manual

1. **Build local de la imagen:**
```bash
cd backend
docker build -t club-meta-backend .
```

2. **Probar localmente:**
```bash
docker run -p 3333:8080 \
  -e DB_HOST=... \
  -e SUPABASE_URL=... \
  (todas las env vars) \
  club-meta-backend
```

3. **Crear Container Instance en Azure:**
```bash
# Login a Azure
az login

# Crear container instance
az container create \
  --resource-group tu-resource-group \
  --name club-meta-backend \
  --image tu-registry.azurecr.io/club-meta-backend:latest \
  --cpu 1 --memory 1.5 \
  --registry-login-server tu-registry.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --dns-name-label club-meta-api \
  --ports 8080 \
  --environment-variables \
    DB_HOST=... \
    SUPABASE_URL=... \
    (etc.)
```

---

## Ventajas de Docker

✅ **Chromium incluido**: No más problemas de instalación
✅ **Reproducible**: Mismo ambiente siempre
✅ **Más rápido**: No necesita instalar dependencias en cada deploy
✅ **Más barato**: Puede usar planes más pequeños
✅ **Portable**: Funciona en cualquier servicio cloud

---

## Probar Localmente Antes de Deploy

```bash
# 1. Build de la imagen
cd backend
docker build -t club-meta-backend .

# 2. Crear archivo .env.docker con tus variables
# (copiar de .env pero ajustar PORT=8080)

# 3. Ejecutar
docker run --rm -p 3333:8080 --env-file .env.docker club-meta-backend

# 4. Probar
curl http://localhost:3333/health
```

---

## Debugging

Ver logs del contenedor:
```bash
# En Azure Portal
App Service → Log stream

# O con Azure CLI
az webapp log tail --name club-el-meta --resource-group tu-resource-group
```

Ver logs de build:
```bash
# En GitHub Actions, ver los logs del job
```

---

## Siguiente Paso

¿Quieres que actualice el workflow de GitHub Actions para que use Docker?

Te recomiendo **Opción 1** porque:
- Más integrado con tu setup actual
- Auto-deploy desde GitHub
- Mismas features de App Service (scaling, logs, etc.)
- Solo cambias el workflow, el resto queda igual
