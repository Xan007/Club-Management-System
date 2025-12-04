# Configuración de Validación de Fechas

Esta documentación explica cómo modificar las restricciones de fechas para las cotizaciones.

## Backend (AdonisJS)

**Archivo:** `backend/config/app.ts`

```typescript
export const cotizacionConfig = {
  /**
   * Días máximos en el futuro permitidos para reservas
   * Por defecto: 30 días (1 mes)
   */
  diasMaximosFuturo: 30,

  /**
   * Permitir reservas para el día actual
   * true = se permiten reservas para hoy
   * false = solo fechas futuras
   */
  permitirHoy: true,
}
```

### Ejemplos de Configuración Backend:

**Permitir reservas hasta 60 días (2 meses) en el futuro:**
```typescript
diasMaximosFuturo: 60
```

**Solo permitir reservas a partir de mañana:**
```typescript
permitirHoy: false
```

**Permitir reservas hasta 90 días (3 meses):**
```typescript
diasMaximosFuturo: 90
```

---

## Frontend (Astro)

**Archivo:** `frontend/src/pages/obtener-cotizacion.astro`

Busca estas líneas cerca de la línea 740:

```javascript
// CONFIGURACIÓN DE VALIDACIÓN DE FECHAS (modifica estos valores según necesites)
const DIAS_MAXIMO_FUTURO = 30  // Máximo 30 días (1 mes) en el futuro
const PERMITIR_HOY = true       // true = permitir reservas para hoy, false = solo futuras
```

### Ejemplos de Configuración Frontend:

**Permitir reservas hasta 60 días (2 meses) en el futuro:**
```javascript
const DIAS_MAXIMO_FUTURO = 60
```

**Solo permitir reservas a partir de mañana:**
```javascript
const PERMITIR_HOY = false
```

**Permitir reservas hasta 7 días (1 semana):**
```javascript
const DIAS_MAXIMO_FUTURO = 7
```

---

## ⚠️ IMPORTANTE

**Debes mantener los valores sincronizados entre backend y frontend:**

- Si cambias `diasMaximosFuturo` en backend, cambia `DIAS_MAXIMO_FUTURO` en frontend al mismo valor
- Si cambias `permitirHoy` en backend, cambia `PERMITIR_HOY` en frontend al mismo valor

### Ejemplo de Cambio Sincronizado:

**Backend** (`backend/config/app.ts`):
```typescript
export const cotizacionConfig = {
  diasMaximosFuturo: 45,  // 45 días
  permitirHoy: false,     // Solo futuras
}
```

**Frontend** (`frontend/src/pages/obtener-cotizacion.astro`):
```javascript
const DIAS_MAXIMO_FUTURO = 45   // 45 días
const PERMITIR_HOY = false      // Solo futuras
```

---

## Mensajes de Error

Los usuarios verán estos mensajes si intentan fechas inválidas:

- **Fecha pasada:** `"La fecha debe ser hoy o posterior"` (si `permitirHoy: true`)
- **Fecha pasada:** `"La fecha debe ser posterior a hoy"` (si `permitirHoy: false`)
- **Fecha muy lejana:** `"La fecha no puede ser mayor a X días en el futuro"`

---

## Validaciones Aplicadas

✅ **Backend:** Valida en `POST /api/cotizaciones` y `PUT /api/cotizaciones/:id`
✅ **Frontend:** Input HTML con atributos `min` y `max` automáticos
✅ **Zona horaria:** America/Bogota (Colombia)
