# Blog de Salones - Documentación Técnica

## Resumen

Sistema de blog para publicar información sobre los salones del club. Almacena entradas en base de datos (Supabase), soporta Markdown en el contenido, y está optimizado para cache en CDN.

---

## Arquitectura

```
Frontend (Astro)  →  Backend (AdonisJS)  →  Base de datos (Supabase)
     ↓                      ↓
   Vercel CDN          Cache-Control headers
```

**Decisión de diseño:** Se eligió almacenar en tabla SQL en vez de archivos `.md` porque:
- Permite edición sin redeploy
- Facilita búsquedas y filtros
- Mejor para contenido que no cambia frecuentemente

---

## Base de Datos

### Tabla: `salon_posts`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `espacio_id` | INTEGER | FK a `espacios` (nullable) |
| `titulo` | VARCHAR(255) | Título del post |
| `slug` | VARCHAR(255) | URL amigable (único) |
| `excerpt` | TEXT | Resumen corto para listados |
| `content` | TEXT | Contenido completo (Markdown/HTML) |
| `main_image_url` | TEXT | URL imagen principal |
| `publicado` | BOOLEAN | Si está visible públicamente |
| `published_at` | TIMESTAMPTZ | Fecha de publicación |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

**Índices:**
- `idx_salon_posts_slug` - Búsqueda por slug
- `idx_salon_posts_espacio_id` - Filtro por salón
- `idx_salon_posts_publicado` - Filtro por estado

---

## API Endpoints

### Públicos (sin auth, con cache)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/salon-posts` | Lista posts publicados |
| GET | `/api/salon-posts/:slug` | Detalle de un post |

**Query params (lista):**
- `espacio_id` - Filtrar por salón

**Cache:** `Cache-Control: public, s-maxage=300, stale-while-revalidate=59`

### Admin (requiere auth + rol admin)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/admin/salon-posts` | Lista todos (incluye borradores) |
| POST | `/admin/salon-posts` | Crear post |
| GET | `/admin/salon-posts/:id` | Ver post por ID |
| PUT | `/admin/salon-posts/:id` | Actualizar post |
| DELETE | `/admin/salon-posts/:id` | Eliminar post |
| POST | `/admin/salon-posts/:id/publish` | Publicar/despublicar |

---

## Archivos del Backend

```
backend/
├── app/
│   ├── models/
│   │   └── salon_post.ts          # Modelo Lucid
│   ├── controllers/
│   │   └── salon_posts_controller.ts  # CRUD + cache
│   └── docs/
│       ├── openapi.ts             # Schemas OpenAPI
│       └── paths/
│           └── salon_posts.ts     # Documentación endpoints
├── database/
│   └── seeders/
│       └── salon_posts_seeder.ts  # Datos de ejemplo
└── start/
    └── routes.ts                  # Rutas registradas
```

---

## Campos del Post

| Campo | Uso |
|-------|-----|
| `titulo` | Título visible del artículo |
| `slug` | URL: `/salones/blog/conoce-nuestro-salon` |
| `excerpt` | Texto corto para tarjetas/listados |
| `content` | Artículo completo en Markdown |
| `main_image_url` | Imagen de portada |
| `publicado` | `true` = visible, `false` = borrador |

---

## Caching

Los endpoints públicos devuelven headers de cache para que el CDN (Vercel) guarde las respuestas:

```
Cache-Control: public, s-maxage=300, stale-while-revalidate=59
```

- `s-maxage=300`: CDN cachea por 5 minutos
- `stale-while-revalidate=59`: Sirve contenido viejo mientras refresca

**Resultado:** La mayoría de usuarios reciben respuesta desde CDN, sin query a la BD.

---

## Flujo de Publicación

1. Admin crea post con `publicado: false` (borrador)
2. Admin edita contenido hasta estar listo
3. Admin llama `POST /admin/salon-posts/:id/publish`
4. El post se marca `publicado: true` y `published_at: now()`
5. CDN sirve el nuevo contenido en la próxima petición (max 5 min)

---

## Contenido Markdown

El campo `content` soporta Markdown estándar:

```markdown
# Título principal

Texto con **negritas** y *cursivas*.

## Subtítulo

- Lista item 1
- Lista item 2

| Columna 1 | Columna 2 |
|-----------|-----------|
| Dato 1    | Dato 2    |
```

**Frontend:** Renderizar con `marked`, `remark`, o similar.

---

## Ejemplo de Respuesta

**GET /api/salon-posts/conoce-nuestro-salon-principal**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "espacioId": 1,
    "titulo": "Conoce nuestro Salón Principal",
    "slug": "conoce-nuestro-salon-principal",
    "excerpt": "Descubre las instalaciones...",
    "content": "# Salón Principal\n\nNuestro **Salón Principal**...",
    "mainImageUrl": null,
    "publicado": true,
    "publishedAt": "2025-12-04T06:09:19.255Z",
    "createdAt": "2025-12-04T06:09:19.255Z",
    "updatedAt": "2025-12-04T06:09:19.255Z",
    "espacio": {
      "id": 1,
      "nombre": "Salón Principal"
    }
  }
}
```

---

## Documentación Swagger

Disponible en:
- Redoc: `http://localhost:3333/docs`
- Swagger UI: `http://localhost:3333/docs/swagger`
