# Guía Rápida: Ver Logs en Azure Web Service

## 🚀 Método 1: Log Stream (Más Rápido)

### Pasos:
1. Abrir **Azure Portal** (https://portal.azure.com)
2. Buscar tu **App Service** en la barra de búsqueda
3. En el menú izquierdo, expandir **Monitoring**
4. Click en **Log stream**
5. Seleccionar:
   - **Application logs** (para logs de tu app Node.js)
   - **Web server logs** (para logs del servidor HTTP)

### Qué verás:
```
2025-12-08T12:34:56 Iniciando Puppeteer para generar PDF...
2025-12-08T12:34:57 Browser lanzado exitosamente
2025-12-08T12:34:58 Contenido HTML cargado, generando PDF...
2025-12-08T12:34:59 PDF generado exitosamente
```

O si hay errores:
```
2025-12-08T12:34:56 Error generando PDF con Puppeteer: Failed to launch browser
2025-12-08T12:34:56 Detalles del error: { message: "..." }
```

---

## 📁 Método 2: Kudu Console (Más Detallado)

### Pasos:
1. En tu **App Service** en Azure Portal
2. Ir a **Development Tools** → **Advanced Tools**
3. Click en **Go** (se abre Kudu en nueva pestaña)
4. En Kudu, ir a **Debug console** → **CMD**
5. Navegar a la carpeta `LogFiles`:
   ```
   cd LogFiles
   dir
   ```
6. Abrir archivos de log directamente o descargarlos

### Rutas importantes:
- `LogFiles/Application/` - Logs de tu aplicación
- `LogFiles/http/` - Logs del servidor web
- `LogFiles/DetailedErrors/` - Errores detallados HTTP

---

## 💻 Método 3: Azure CLI (Desde tu PC)

### Requisitos:
- Tener instalado **Azure CLI**: https://aka.ms/installazurecli

### Comandos:

```powershell
# Login a Azure
az login

# Ver logs en tiempo real (reemplazar valores)
az webapp log tail `
  --name tu-app-service-name `
  --resource-group tu-resource-group

# Descargar todos los logs
az webapp log download `
  --name tu-app-service-name `
  --resource-group tu-resource-group `
  --log-file logs.zip
```

### Ejemplo real:
```powershell
az webapp log tail `
  --name club-meta-backend `
  --resource-group club-meta-rg
```

---

## 🔍 Método 4: Application Insights (Avanzado)

Si tienes Application Insights configurado:

1. En Azure Portal, ir a **Application Insights**
2. Click en **Logs** en el menú lateral
3. Ejecutar queries KQL:

```kql
traces
| where timestamp > ago(1h)
| where message contains "PDF"
| order by timestamp desc
```

---

## ⚙️ Habilitar Logs (Si no están activos)

### Pasos:
1. En tu **App Service**
2. Ir a **Monitoring** → **App Service logs**
3. Configurar:
   - **Application Logging (Filesystem)**: **On**
   - **Level**: **Information** o **Verbose**
   - **Web server logging**: **File System**
   - **Detailed Error Messages**: **On**
   - **Failed Request Tracing**: **On**
   - **Retention Period**: **7 días**
4. Click en **Save**
5. Esperar 30 segundos para que se aplique

---

## 🐛 Logs Específicos para Debugging de PDF

Después de configurar los logs, cuando generes un PDF verás:

```
[TIMESTAMP] Iniciando Puppeteer para generar PDF...
[TIMESTAMP] Intentando cargar plantilla desde: /home/site/wwwroot/build/app/resources/templates/pdf_template.html
[TIMESTAMP] Intentando cargar logo desde: /home/site/wwwroot/build/app/resources/images/logo_corpmeta.png
[TIMESTAMP] Intentando cargar CSS desde: /home/site/wwwroot/build/app/resources/css/pdf_styles.css
[TIMESTAMP] Browser lanzado exitosamente
[TIMESTAMP] Contenido HTML cargado, generando PDF...
[TIMESTAMP] PDF generado exitosamente
```

---

## 📊 Información del Sistema

Para ver información del sistema operativo y ambiente:

En **Kudu Console** ejecutar:

```bash
# Ver sistema operativo
uname -a

# Ver versión de Node
node --version

# Ver si Chromium está instalado
which chromium-browser
chromium-browser --version

# Ver memoria disponible
free -h

# Ver procesos
ps aux | grep node
```

---

## 🆘 Errores Comunes y Dónde Buscarlos

| Error | Dónde Buscar | Qué Buscar |
|-------|--------------|------------|
| PDF no se genera | Application logs | "Error generando PDF" |
| Chromium no inicia | Application logs | "Failed to launch browser" |
| Archivos no encontrados | Application logs | "ENOENT: no such file" |
| Sin memoria | Web server logs | "out of memory" |
| Timeout | Application logs | "TimeoutError" |

---

## 📱 VS Code Extension (Opcional)

1. Instalar extensión **Azure App Service** en VS Code
2. Hacer login en Azure
3. En la barra lateral de Azure:
   - Expandir tu suscripción
   - Expandir App Services
   - Click derecho en tu app
   - Seleccionar **Start Streaming Logs**

Verás logs en la terminal de VS Code en tiempo real.

---

## ✅ Checklist Antes de Revisar Logs

Antes de intentar generar un PDF y revisar logs:

- [ ] Logs habilitados en App Service
- [ ] Código con logs detallados desplegado
- [ ] App reiniciada después de cambios
- [ ] Log stream abierto en Azure Portal
- [ ] Intentar generar PDF desde la app
- [ ] Revisar inmediatamente los logs

---

## 🎯 Próximos Pasos

1. Habilitar logs en Azure (si no están activos)
2. Hacer deploy del código actualizado con logs detallados
3. Abrir Log Stream en Azure Portal
4. Intentar generar un PDF
5. Revisar qué error específico aparece
6. Aplicar la solución correspondiente según el error
