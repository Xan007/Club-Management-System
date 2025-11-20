-- Migration: Add performance indices for queries
-- Purpose: Optimize database queries for cotizaciones creation

-- Índices para tabla horarios_operacion
CREATE INDEX IF NOT EXISTS idx_horarios_dia_semana ON horarios_operacion(dia_semana);
CREATE INDEX IF NOT EXISTS idx_horarios_activo ON horarios_operacion(esta_activo);

-- Índices para tabla cotizaciones
CREATE INDEX IF NOT EXISTS idx_cotizaciones_numero_mes ON cotizaciones(cotizacion_numero);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_espacio ON cotizaciones(espacio_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_fecha ON cotizaciones(fecha);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON cotizaciones(estado);

-- Índices para tabla bloqueos_calendario
CREATE INDEX IF NOT EXISTS idx_bloqueos_espacio_fecha ON bloqueos_calendario(espacio_id, fecha);
CREATE INDEX IF NOT EXISTS idx_bloqueos_fecha ON bloqueos_calendario(fecha);

-- Índices para tabla tarifas
CREATE INDEX IF NOT EXISTS idx_tarifas_config_cliente ON tarifas(configuracion_espacio_id, tipo_cliente);
CREATE INDEX IF NOT EXISTS idx_tarifas_tipo_cliente ON tarifas(tipo_cliente);

-- Índices para tabla tarifas_hora_adicional
CREATE INDEX IF NOT EXISTS idx_tarifa_hora_config_cliente ON tarifas_hora_adicional(configuracion_espacio_id, tipo_cliente);
CREATE INDEX IF NOT EXISTS idx_tarifa_hora_personas ON tarifas_hora_adicional(min_personas);

-- Índices para tabla servicios_adicionales
CREATE INDEX IF NOT EXISTS idx_servicios_tipo_cliente ON servicios_adicionales(tipo_cliente, activo);
CREATE INDEX IF NOT EXISTS idx_servicios_activo ON servicios_adicionales(activo);

-- Índices para tabla espacios
CREATE INDEX IF NOT EXISTS idx_espacios_activo ON espacios(activo);

-- Índices para tabla configuracion_espacio
CREATE INDEX IF NOT EXISTS idx_config_espacio_id ON configuracion_espacio(espacio_id);
CREATE INDEX IF NOT EXISTS idx_config_tipo_cliente ON configuracion_espacio(tipo_cliente);
