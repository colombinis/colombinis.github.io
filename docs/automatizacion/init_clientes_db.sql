-- Schema para la DB de clientes
-- Esta DB almacena el progreso de cada cliente en el funnel de cada trabajo

-- Tabla de clientes: estado general del proceso
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    nombre TEXT,
    telefono_whatsapp TEXT,
    trabajo_id TEXT NOT NULL,        -- ej: 'landing', 'ecommerce', 'auto-int'
    payment_id TEXT,                 -- ID del pago en Mercado Pago
    payment_status TEXT,             -- 'pending', 'approved', 'rejected'
    estado TEXT DEFAULT 'inicio_formulario',  -- inicio_formulario | en_progreso | completo | abandonado
    pasos_completados JSONB DEFAULT '{}',    -- { "1": true, "2": false, ... }
    metadata JSONB DEFAULT '{}',             -- datos adicionales del cliente
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de progreso de formulario: cada respuesta guardada
CREATE TABLE IF NOT EXISTS progreso_formulario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id),
    paso INTEGER NOT NULL,
    campo TEXT NOT NULL,
    valor TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_clientes_trabajo ON clientes(trabajo_id);
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON clientes(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_updated ON clientes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_progreso_cliente ON progreso_formulario(cliente_id);
CREATE INDEX IF NOT EXISTS idx_progreso_paso ON progreso_formulario(paso);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_clientes
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- VISTA: estadísticas de funnel por trabajo
CREATE OR REPLACE VIEW funnel_stats AS
SELECT
    trabajo_id,
    estado,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY trabajo_id), 1) as porcentaje
FROM clientes
GROUP BY trabajo_id, estado
ORDER BY trabajo_id, estado;

-- VISTA: clientes con riesgo de abandono (última actividad > 24h)
CREATE OR REPLACE VIEW clientes_en_riesgo AS
SELECT
    id,
    email,
    nombre,
    trabajo_id,
    estado,
    updated_at as ultima_actividad,
    EXTRACT(EPOCH FROM (NOW() - updated_at))/3600 as horas_inactivas
FROM clientes
WHERE estado IN ('inicio_formulario', 'en_progreso')
  AND updated_at < NOW() - INTERVAL '24 hours'
ORDER BY updated_at ASC;