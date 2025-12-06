-- Agregar campo imagenes (JSONB) a salon_posts
ALTER TABLE salon_posts 
ADD COLUMN IF NOT EXISTS imagenes JSONB;

-- Actualizar posts existentes con imágenes de ejemplo
UPDATE salon_posts 
SET imagenes = '[
  {"url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", "alt": "Boda en salón"},
  {"url": "https://images.unsplash.com/photo-1525772764200-be829a350797?w=800", "alt": "Decoración floral"},
  {"url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800", "alt": "Mesa principal"}
]'::jsonb
WHERE slug = 'boda-familiar-salon-mi-llanura';

UPDATE salon_posts 
SET imagenes = '[
  {"url": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800", "alt": "Reunión corporativa"},
  {"url": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800", "alt": "Equipo de trabajo"},
  {"url": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800", "alt": "Presentación"}
]'::jsonb
WHERE slug = 'reunion-corporativa-exitosa';

UPDATE salon_posts 
SET imagenes = '[
  {"url": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800", "alt": "XV Años"},
  {"url": "https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=800", "alt": "Decoración XV años"},
  {"url": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800", "alt": "Celebración"}
]'::jsonb
WHERE slug = 'celebracion-xv-anos-terraza';
