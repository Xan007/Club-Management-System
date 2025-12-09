    # Manual de Instalación - Club El Meta

    Sistema de gestión de reservas y cotizaciones para espacios de eventos.

    ## Requisitos Previos

    - **Node.js**: v20.x o superior
    - **npm**: v10.x o superior
    - **Git**: Para clonar el repositorio
    - Cuenta en **Supabase** (gratuita)
    - Cuenta en **Resend** (gratuita)
    - Cuenta en **Meta for Developers** (opcional, solo para WhatsApp)

    ---

    ## 1. Clonar el Repositorio

    ```bash
    git clone https://github.com/Xan007/Club-Management-System.git
    cd Club-Management-System
    ```

    ---

    ## 2. Configuración de Supabase

    ### 2.1. Crear Proyecto en Supabase

    1. Ir a [https://supabase.com](https://supabase.com) y crear una cuenta
    2. Crear un nuevo proyecto
    3. Elegir región (recomendado: `us-east-1`)
    4. Configurar contraseña de base de datos (guardarla de forma segura)
    5. Esperar a que el proyecto se inicialice (~2 minutos)

    ### 2.2. Configurar Autenticación

    1. En el panel de Supabase, ir a **Authentication** → **Providers**
    2. Habilitar **Email provider**
    3. Ir a **Authentication** → **Settings**
    4. En **Auth Providers**, activar **Publishable Keys**
    5. Guardar la **Publishable Key** que aparece

    ### 2.3. Obtener Credenciales

    En **Project Settings** → **API**:
    - Copiar **Project URL** (ejemplo: `https://xxxxx.supabase.co`)
    - Copiar **Project API keys** → **service_role** (secret key)
    - Copiar **publishable key** (anon key)

    En **Project Settings** → **Database**:
    - Copiar **Host** (ejemplo: `aws-0-us-east-1.pooler.supabase.com`)
    - Copiar **Database name** (generalmente `postgres`)
    - Copiar **Port** (generalmente `5432`)
    - Copiar **User** (ejemplo: `postgres.xxxxx`)
    - La **Password** es la que configuraste al crear el proyecto

    ### 2.4. Crear Tablas de Base de Datos

    1. En Supabase, ir a **SQL Editor**
    2. Ejecutar el script `schema.sql`

    ### 2.5. Crear Buckets de Storage

    1. Ir a **Storage** en el panel de Supabase
    2. Crear los siguientes buckets públicos:
    - `salones_imagenes`
    - `salon_posts_imagenes`
    3. Configurar políticas de acceso público para lectura en ambos buckets

    ---

    ## 3. Configuración de Resend (Email)

    1. Crear cuenta en [https://resend.com](https://resend.com)
    2. Ir a **API Keys** en el dashboard
    3. Crear una nueva API Key
    4. Copiar el API Key (comienza con `re_`)
    5. Verificar un dominio o usar el dominio de prueba que proporciona Resend

    ---

    ## 4. Configuración de Meta for Developers (WhatsApp)

    > **Advertencia**: Esta integración está en fase de prueba. Solo funciona con números registrados.

    ### 4.1. Crear Cuenta de Developer

    1. Ir a [https://developers.facebook.com](https://developers.facebook.com)
    2. Crear cuenta de desarrollador
    3. Verificar identidad si es necesario

    ### 4.2. Crear App y Business Account

    1. En el dashboard, crear una **Business Account**
    2. Crear una nueva **App**
    3. Seleccionar tipo: **Business**
    4. Agregar el producto **WhatsApp**

    ### 4.3. Configurar WhatsApp Business API

    1. En la configuración de WhatsApp, obtener el **Phone Number ID**
    2. Ir a **WhatsApp** → **API Setup**
    3. Agregar números de prueba en **To** (máximo 5 números)

    ### 4.4. Crear System User y Access Token

    1. Ir a **Business Settings** → **System Users**
    2. Crear un nuevo System User con rol **Admin**
    3. Asignar la app al System User
    4. Generar un **Access Token** con todos los permisos
    5. Copiar el Access Token (comienza con `EAAV...`)

    ### 4.5. Agregar Números de Prueba

    1. En **WhatsApp** → **API Setup** → **To**
    2. Agregar los números de teléfono que usarás para pruebas
    3. Verificar cada número con el código de 6 dígitos enviado

    ---

    ## 5. Instalación del Backend

    ### 5.1. Instalar Dependencias

    ```bash
    cd backend
    npm install
    ```

    ### 5.2. Configurar Variables de Entorno

    Crear archivo `.env` en `backend/`:

    ```env
    # Timezone
    TZ=America/Bogota

    # Server
    PORT=3333
    HOST=0.0.0.0
    LOG_LEVEL=info
    NODE_ENV=development

    # App Key (generar uno único)
    APP_KEY=tu-app-key-de-32-caracteres-minimo

    # Database (Supabase)
    DB_HOST=aws-0-us-east-1.pooler.supabase.com
    DB_PORT=5432
    DB_USER=postgres.xxxxxxxxxxxxx
    DB_PASSWORD=tu-password-de-supabase
    DB_DATABASE=postgres

    # Supabase
    SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
    SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

    # CORS
    CORS_ORIGIN=http://localhost:4321

    # Resend (Email)
    RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
    RESEND_FROM_EMAIL=Club El Meta <noreply@tudominio.com>

    # Frontend
    FRONTEND_URL=http://localhost:4321
    FRONTEND_PATH=../frontend

    # WhatsApp (Meta Business API - Opcional)
    WHATSAPP_PHONE_NUMBER_ID=123456789012345
    WHATSAPP_ACCESS_TOKEN=EAAVxxxxxxxxxxxxxxxxxxxxxxxxx
    WHATSAPP_API_VERSION=v22.0
    ```

    ### 5.3. Generar APP_KEY

    ```bash
    node ace generate:key
    ```

    Copiar el resultado al archivo `.env` en `APP_KEY`.

    ### 5.4. Iniciar el Servidor de Desarrollo

    ```bash
    npm run dev
    ```

    El backend estará disponible en `http://localhost:3333`

    ---

    ## 6. Instalación del Frontend

    ### 6.1. Instalar Dependencias

    ```bash
    cd frontend
    npm install
    ```

    ### 6.2. Configurar Variables de Entorno

    Crear archivo `.env` en `frontend/`:

    ```env
    PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
    PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    PUBLIC_BACKEND_URL=http://localhost:3333
    ```

    ### 6.3. Iniciar el Servidor de Desarrollo

    ```bash
    npm run dev
    ```

    El frontend estará disponible en `http://localhost:4321`

    ---

    ## 7. Verificación de la Instalación

    ### 7.1. Verificar Backend

    ```bash
    curl http://localhost:3333/health
    ```

    Debería responder con un JSON de estado.

    ### 7.2. Verificar Frontend

    1. Abrir navegador en `http://localhost:4321`
    2. Verificar que carga la página principal
    3. Intentar acceder al login en `/admin/login`

    ---

    ## 8. Comandos Útiles

    ### Backend

    ```bash
    # Desarrollo
    npm run dev

    # Build para producción
    npm run build

    # Ejecutar en producción
    cd build
    npm ci --omit="dev"
    node bin/server.js

    # Ver rutas
    node ace list:routes
    ```

    ### Frontend

    ```bash
    # Desarrollo
    npm run dev

    # Build para producción
    npm run build

    # Preview de build
    npm run preview

    # Verificar tipos TypeScript
    npm run check
    ```

---

## 9. Despliegue en Azure Web Service

### 9.1. Configurar Variables de Entorno en Azure

En **Azure Portal** → **App Service** → **Configuration** → **Application settings**:

```
# Variables requeridas
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

# Variables para Puppeteer (generación de PDFs)
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WEBSITE_NODE_DEFAULT_VERSION=20-lts

# WhatsApp (opcional)
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAVxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_API_VERSION=v22.0
```

### 9.2. Habilitar Logs

En **Monitoring** → **App Service logs**:
- **Application Logging**: On (Level: Information)
- **Web server logging**: File System
- **Detailed Error Messages**: On
- **Retention Period**: 7 días

### 9.3. Ver Logs en Tiempo Real

**Opción 1**: Azure Portal → **Monitoring** → **Log stream**

**Opción 2**: Azure CLI
```powershell
az webapp log tail --name tu-app-service --resource-group tu-resource-group
```

**Opción 3**: Kudu Console → **Advanced Tools** → **Go** → **Debug console**

Ver documentación detallada: `backend/COMO_VER_LOGS_AZURE.md`

### 9.4. Solución de Problemas con PDFs

Si la generación de PDFs falla en Azure, revisar:
- Plan de App Service (mínimo **B1** con 512MB RAM)
- Logs de Puppeteer en Log Stream
- Documentación completa: `backend/AZURE_PDF_TROUBLESHOOTING.md`

---

## 10. Licencia

Este proyecto es propiedad de Corporación Club del Meta.

## 11. Contacto

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.