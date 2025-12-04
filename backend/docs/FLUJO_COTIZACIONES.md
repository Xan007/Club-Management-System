# Flujo de Cotizaciones - Club El Meta

## 📋 Resumen del Proceso

El sistema de cotizaciones permite a los usuarios solicitar presupuestos para reservar espacios del club. El flujo completo incluye consulta de disponibilidad, creación de cotización, aceptación y bloqueo de calendario.

---

## 🔄 Flujo Completo (Actualizado)

### 📱 **Comunicación Gerente-Cliente**
El sistema envía emails automáticamente, pero la coordinación real ocurre por WhatsApp/teléfono:
- Gerente y cliente hablan y coordinan detalles
- Pueden ajustar la cotización según necesidades
- Cliente confirma verbalmente: "Ok, me parece bien"
- Gerente solicita pago de abono (50%)
- Cliente realiza transferencia/pago
- **Gerente confirma pago recibido → cierra cotización**

---

### 1️⃣ **Consultar Disponibilidad**

**Endpoint:** `GET /api/disponibilidad/horas`

El cliente selecciona un espacio y fecha para consultar qué horas están disponibles.

```http
GET /api/disponibilidad/horas?espacioId=1&fecha=2025-12-15
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "fecha": "2025-12-15",
    "espacioId": 1,
    "horarioOperacion": {
      "horaInicio": "08:00",
      "horaFin": "22:00",
      "diaSemana": "Viernes"
    },
    "horasDisponibles": ["08:00", "09:00", "10:00", "14:00", "15:00"],
    "totalSlots": 14,
    "slotsDisponibles": 5
  }
}
```

**Funcionamiento:**
- Genera slots de 1 hora desde la hora de apertura hasta el cierre
- Consulta la tabla `bloqueos_calendario` para filtrar horas ocupadas
- Retorna solo horas realmente disponibles

---

### 2️⃣ **Crear Cotización**

**Endpoint:** `POST /api/cotizaciones`

El cliente completa el formulario con los datos del evento y solicita la cotización.

```http
POST /api/cotizaciones
Content-Type: application/json

{
  "espacioId": 1,
  "configuracionEspacioId": 2,
  "fecha": "2025-12-15",
  "horaInicio": "10:00",
  "duracion": 4,
  "tipoEvento": "social",
  "asistentes": 50,
  "tipoCliente": "particular",
  "servicios": [1, 3],
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "3001234567",
  "observaciones": "Evento de cumpleaños"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cotización creada exitosamente",
  "data": {
    "cotizacion": {
      "id": 30,
      "cotizacionNumero": "2025-12-0030",
      "valorTotal": 850000,
      "estado": "pendiente",
      "estadoPago": "sin_pagar"
    },
    "detalles": [
      {
        "servicio": "Alquiler de Salón (4h)",
        "cantidad": 1,
        "valorUnitario": 700000,
        "total": 700000
      }
    ],
    "montoAbono": 425000,
    "disponible": true
  }
}
```

**¿Qué hace el sistema?**
- ✅ Valida disponibilidad de fecha/hora
- ✅ Calcula tarifa según configuración, duración, asistentes
- ✅ Aplica recargos nocturnos si aplica
- ✅ Genera número de cotización único
- ✅ Envía emails automáticos:
  - **Al cliente:** PDF de cotización + instrucciones de pago
  - **Al gerente:** Notificación de nueva solicitud

**Estados:**
- `estado: "pendiente"` → Cotización creada, esperando respuesta del cliente
- `estadoPago: "sin_pagar"` → No se ha registrado ningún pago

---

### 3️⃣ **Editar Cotización (Opcional)**

**Endpoint:** `PUT /api/cotizaciones/:id`

Después de hablar con el cliente, el gerente puede ajustar la cotización antes de cerrarla.

```http
PUT /api/cotizaciones/30
Content-Type: application/json

{
  "fecha": "2025-12-16",
  "horaInicio": "14:00",
  "asistentes": 60,
  "observaciones": "Cliente solicita 10 sillas adicionales"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cotización actualizada exitosamente",
  "data": {
    "cotizacion": {
      "id": 30,
      "valorTotal": 920000,
      "fecha": "2025-12-16",
      "hora": "14:00"
    },
    "montoAbono": 460000
  }
}
```

**Qué hace:**
- ✅ Recalcula precios si cambian datos del evento
- ✅ Permite actualizar contacto, observaciones
- ✅ Genera nuevo PDF con cambios
- ⚠️ Solo funciona en cotizaciones "pendientes" (no cerradas)

**Después de editar:**
Puedes reenviar la cotización actualizada al cliente:
```http
POST /api/cotizaciones/30/enviar-correo
```

---

### 4️⃣ **Cerrar Cotización y Convertir en Reserva** ⭐

**Endpoint:** `POST /api/cotizaciones/:id/cerrar`

**Este es el paso principal.** Cuando el gerente confirma el pago del cliente, cierra la cotización.

**Caso 1: Cerrar con abono del 50%**
```http
POST /api/cotizaciones/30/cerrar
Content-Type: application/json

{
  "estadoPago": "abonado",
  "montoPago": 425000
}
```

**Caso 2: Cerrar con pago completo (100%)**
```http
POST /api/cotizaciones/30/cerrar
Content-Type: application/json

{
  "estadoPago": "pagado",
  "montoPago": 850000
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cotización cerrada exitosamente como reserva. 2 cotización(es) conflictivas canceladas.",
  "data": {
    "id": 30,
    "numero": "2025-12-0030",
    "estado": "Aceptada",
    "estadoPago": "Abonado",
    "montoPagado": 425000,
    "fechaConfirmacion": "2025-12-04T10:30:00.000-05:00",
    "cotizacionesCanceladas": 2
  }
}
```

**¿Qué hace el sistema?**
1. ✅ Valida que el monto sea suficiente (≥50% para abono, 100% para pagado)
2. ✅ Cambia `estado` de `"pendiente"` → `"aceptada"` (CERRADA)
3. ✅ Registra `montoPagado` y `estadoPago`
4. ✅ Registra `fechaConfirmacion` con timestamp
5. ✅ **Crea bloqueo en calendario:**
   - Tabla `bloqueos_calendario`
   - Tipo: `"reserva_confirmada"`
   - Hora inicio y fin calculadas
6. ✅ **CANCELA AUTOMÁTICAMENTE cotizaciones que se crucen:**
   - Busca otras cotizaciones pendientes para mismo espacio y fecha
   - Detecta conflictos de horario
   - Cambia su estado a `"rechazada"`
   - Agrega nota: "[SISTEMA] Cancelada automáticamente por conflicto con reserva #30"

**Ejemplo de bloqueo creado:**
```sql
INSERT INTO bloqueos_calendario (
  espacio_id, 
  fecha, 
  hora_inicio, 
  hora_fin, 
  razon, 
  tipo_bloqueo
) VALUES (
  1, 
  '2025-12-15', 
  '10:00:00', 
  '14:00:00',
  'Evento confirmado: Juan Pérez',
  'reserva_confirmada'
);
```

**Impacto:**
- 🚫 La hora bloqueada ya NO aparecerá en futuras consultas
- ✅ Cotizaciones conflictivas canceladas automáticamente
- 📧 (Futuro) Se puede notificar por email a clientes de cotizaciones canceladas

---

### 5️⃣ **Registrar Pagos Adicionales (Después del Cierre)**

**Endpoint:** `POST /api/cotizaciones/:id/registrar-pago`  
💡 **Uso:** Para registrar el saldo restante después de cerrar con abono

Si cerraste la cotización con **abono del 50%**, puedes registrar el pago restante:

**Registrar saldo final (50% restante):**
```http
POST /api/cotizaciones/30/registrar-pago
Content-Type: application/json

{
  "monto": 425000,
  "metodoPago": "transferencia",
  "observaciones": "Saldo final pagado antes del evento"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Pago registrado exitosamente",
  "data": {
    "id": 30,
    "estadoPago": "Pagado",
    "montoPagado": 850000,
    "valorTotal": 850000
  }
}
```

**¿Qué hace?**
- ✅ Suma el monto al total pagado
- ✅ Si `montoPagado >= valorTotal`, cambia `estadoPago` a `"pagado"`
- ✅ Si `montoPagado >= valorTotal * 0.5`, mantiene `"abonado"`
- ✅ Registra método de pago y observaciones

**Estados de pago:**
- `sin_pagar` → No se ha registrado ningún pago (estado inicial)
- `abonado` → Abono registrado (≥50% del total) - reserva confirmada
- `pagado` → Pago completo (100% del total) - sin saldo pendiente

💡 **Nota:** Cuando cierras con `estadoPago: "pagado"`, ya no necesitas registrar pagos adicionales.

---

## 📊 Estados de Cotización

| Estado | Descripción | ¿Bloquea calendario? |
|--------|-------------|---------------------|
| `pendiente` | Cotización creada, esperando respuesta del cliente | ❌ No |
| `aceptada` | Cliente confirmó y administrador aceptó la reserva | ✅ Sí |
| `rechazada` | Cotización rechazada (cliente o administrador) | ❌ No |
| `vencida` | Cotización expiró sin confirmación | ❌ No |

## 💰 Estados de Pago

| Estado Pago | Condición | Descripción |
|-------------|-----------|-------------|
| `sin_pagar` | `monto_pagado = 0` | Sin pagos registrados |
| `abono_pendiente` | Cotización aceptada | Esperando primer pago |
| `abonado` | `monto_pagado ≥ 50%` | Abono recibido |
| `pagado` | `monto_pagado ≥ 100%` | Pago completo |

---

## 🗓️ Sistema de Bloqueos de Calendario

La tabla `bloqueos_calendario` gestiona la disponibilidad de espacios:

### Tipos de Bloqueo

| Tipo | Descripción | ¿Cómo se crea? |
|------|-------------|---------------|
| `reserva_confirmada` | Evento confirmado con pago | Automático al aceptar cotización |
| `mantenimiento` | Mantenimiento programado | Manual (admin) |
| `manual` | Bloqueo administrativo | Manual (admin) |

### Estructura de Bloqueo

```typescript
{
  id: 1,
  espacioId: 1,
  fecha: "2025-12-15",
  horaInicio: "10:00:00",
  horaFin: "14:00:00",
  razon: "Evento confirmado: Juan Pérez",
  tipoBloqueo: "reserva_confirmada",
  createdAt: "2025-12-04T10:30:00",
  updatedAt: "2025-12-04T10:30:00"
}
```

---

## 🔗 Resumen de Endpoints

| Método | Ruta | Descripción | ¿Requiere auth? |
|--------|------|-------------|----------------|
| `GET` | `/api/disponibilidad/horas` | Consultar horas disponibles | ❌ No |
| `POST` | `/api/cotizaciones` | Crear cotización y enviar emails | ❌ No |
| `GET` | `/api/cotizaciones` | Listar cotizaciones | ❌ No |
| `GET` | `/api/cotizaciones/:id` | Ver detalle de cotización | ❌ No |
| `PUT` | `/api/cotizaciones/:id` | **Editar cotización pendiente** | ⚠️ Recomendado |
| `POST` | `/api/cotizaciones/:id/cerrar` | **Cerrar como reserva + auto-cancelar conflictos** | ⚠️ Recomendado |
| `POST` | `/api/cotizaciones/:id/registrar-pago` | Registrar pagos adicionales | ⚠️ Recomendado |
| `GET` | `/api/cotizaciones/:id/pdf` | Descargar PDF | ❌ No |
| `POST` | `/api/cotizaciones/:id/enviar-correo` | Reenviar emails | ⚠️ Recomendado |
| ~~`POST`~~ | ~~`/api/cotizaciones/:id/aceptar`~~ | ⚠️ **DEPRECADO** - usar `/cerrar` | ⚠️ Recomendado |

---

## 📝 Ejemplo de Flujo Completo (Caso Real)

```bash
# 1. Cliente consulta disponibilidad desde el frontend
GET /api/disponibilidad/horas?espacioId=1&fecha=2025-12-15
# → Obtiene horas disponibles: ["08:00", "09:00", "10:00", ...]

# 2. Cliente crea cotización desde formulario web
POST /api/cotizaciones
# → Recibe cotización #2025-12-0030 con valor $850,000
# → Sistema envía emails automáticamente (cliente + gerente)

# 3. Gerente habla con cliente por WhatsApp
# Cliente: "Mejor lo hacemos 5 horas, no 4"

# 4. Gerente edita cotización
PUT /api/cotizaciones/30
Body: { "duracion": 5 }
# → Recalcula precio: $1,050,000
# → Nuevo PDF generado

# 5. Gerente reenvía cotización actualizada
POST /api/cotizaciones/30/enviar-correo
# → Cliente y gerente reciben emails con nuevo PDF

# 6. Cliente confirma: "Ok, me parece bien"
# Cliente transfiere abono del 50% ($525,000)

# 7. Gerente confirma pago y cierra cotización
POST /api/cotizaciones/30/cerrar
Body: { "estadoPago": "abonado", "montoPago": 525000 }
# → Estado cambia a "aceptada" (RESERVA CONFIRMADA)
# → Calendario bloqueado (10:00-15:00 del 2025-12-15)
# → Sistema cancela automáticamente cotizaciones #28 y #29 que se cruzaban
# → Respuesta: "2 cotización(es) conflictivas canceladas"

# 8. Día antes del evento, cliente paga saldo restante ($525,000)
POST /api/cotizaciones/30/registrar-pago
Body: { "monto": 525000, "metodoPago": "efectivo" }
# → Estado pago: "pagado" (100% completado)

# 9. Futuras consultas de disponibilidad
GET /api/disponibilidad/horas?espacioId=1&fecha=2025-12-15
# → Ya NO muestra 10:00-15:00 (bloqueadas por reserva #30)
```

---

## 🛡️ Validaciones y Reglas de Negocio

### Al crear cotización:
- ✅ Fecha debe ser posterior a hoy
- ✅ Duración: mínimo 4h, máximo 8h (horas adicionales se cobran aparte)
- ✅ Espacio debe existir y estar activo
- ✅ Configuración debe pertenecer al espacio seleccionado
- ✅ Asistentes no pueden exceder capacidad de configuración

### Al editar cotización:
- ✅ Cotización debe estar en estado "pendiente" (no aceptada ni rechazada)
- ✅ Recalcula precios automáticamente si cambias: duración, configuración, asistentes, servicios
- ✅ Permite actualizar: nombre cliente, email, teléfono, observaciones (sin recalcular)

### Al cerrar cotización:
- ✅ Cotización debe estar en estado "pendiente"
- ✅ Validación de montos:
  - `estadoPago: "abonado"` → montoPago debe ser ≥ 50% del valorTotal
  - `estadoPago: "pagado"` → montoPago debe ser = 100% del valorTotal
- ✅ Crea bloqueo en calendario automáticamente
- ✅ Cancela automáticamente cotizaciones pendientes que se crucen en horario

### Al registrar pago adicional:
- ✅ Cotización debe estar en estado "aceptada" (ya cerrada)
- ✅ Monto debe ser > 0
- ✅ Método de pago debe ser válido
- ✅ Suma de pagos no debe exceder el total

---

## 🎯 Caso de Uso Real

**Escenario:** María quiere reservar el salón "MI LLANURA" para su boda.

1. **María ingresa al sitio web** → Selecciona salón y fecha (2025-12-15)
2. **Sistema muestra horas disponibles** → María elige 10:00 AM
3. **María llena formulario** → 80 asistentes, 4 horas, disposición Banquete
4. **Sistema genera cotización #2025-12-0030** → Envía PDF al email de María y gerente
5. **Gerente habla con María por WhatsApp** → María pide cambiar a 5 horas
6. **Gerente edita cotización** → PUT /api/cotizaciones/30 → nuevo valor: $1,050,000
7. **Gerente reenvía cotización actualizada** → María recibe nuevo PDF
8. **María confirma y transfiere abono del 50%** → $525,000
9. **Gerente verifica pago y cierra cotización** → POST /api/cotizaciones/30/cerrar
10. **Sistema bloquea calendario (10:00-15:00)** → Cancela automáticamente cotizaciones #28 y #29 que se cruzaban
11. **Día antes del evento** → María paga saldo ($525,000) → Estado: "pagado"
12. **Día del evento** → María celebra su boda 🎉

---

## 📚 Documentación API

Toda la API está documentada en Swagger/OpenAPI:

**URL:** `http://localhost:3333/docs`

Swagger muestra:
- Estructura completa de requests/responses
- Ejemplos interactivos
- Esquemas de datos
- Códigos de error

---

## 🔧 Mantenimiento

### Ver bloqueos activos:
```sql
SELECT * FROM bloqueos_calendario 
WHERE fecha >= CURRENT_DATE 
ORDER BY fecha, hora_inicio;
```

### Eliminar bloqueo (cancelación):
```sql
DELETE FROM bloqueos_calendario 
WHERE id = 123;
```

### Ver cotizaciones pendientes:
```sql
SELECT * FROM cotizaciones 
WHERE estado = 'pendiente' 
AND fecha >= CURRENT_DATE;
```
