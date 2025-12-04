/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     TipoRol:
 *       type: string
 *       enum: [admin, particular]
 *       description: Rol del usuario. 'admin' para administrador, 'particular' para usuario normal.
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID del usuario (mismo que auth.users.id)
 *         rol:
 *           $ref: '#/components/schemas/TipoRol'
 *         nombre_completo:
 *           type: string
 *           nullable: true
 *         telefono:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     SalonPost:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         espacioId:
 *           type: integer
 *           nullable: true
 *           description: ID del espacio/salón relacionado
 *         titulo:
 *           type: string
 *         slug:
 *           type: string
 *           description: URL amigable única
 *         excerpt:
 *           type: string
 *           nullable: true
 *           description: Resumen corto del post
 *         content:
 *           type: string
 *           description: Contenido completo (Markdown o HTML)
 *         mainImageUrl:
 *           type: string
 *           nullable: true
 *           description: URL de la imagen principal
 *         publicado:
 *           type: boolean
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         espacio:
 *           type: object
 *           nullable: true
 *           description: Espacio relacionado (cuando se precarga)
 *     SalonPostSummary:
 *       type: object
 *       description: Versión resumida del post para listados
 *       properties:
 *         id:
 *           type: integer
 *         espacioId:
 *           type: integer
 *           nullable: true
 *         titulo:
 *           type: string
 *         slug:
 *           type: string
 *         excerpt:
 *           type: string
 *           nullable: true
 *         mainImageUrl:
 *           type: string
 *           nullable: true
 *         publishedAt:
 *           type: string
 *           format: date-time
 *     SalonPostInput:
 *       type: object
 *       required:
 *         - titulo
 *         - content
 *       properties:
 *         espacioId:
 *           type: integer
 *           nullable: true
 *           description: ID del espacio relacionado (opcional)
 *         titulo:
 *           type: string
 *           example: "Conoce nuestro Salón Principal"
 *         slug:
 *           type: string
 *           description: Se genera automáticamente si no se proporciona
 *           example: "conoce-nuestro-salon-principal"
 *         excerpt:
 *           type: string
 *           example: "Descubre las instalaciones y servicios..."
 *         content:
 *           type: string
 *           description: Contenido en Markdown o HTML
 *           example: "# Título\n\nContenido del post..."
 *         mainImageUrl:
 *           type: string
 *           description: URL de la imagen principal (Supabase Storage)
 *         publicado:
 *           type: boolean
 *           default: false
 * tags:
 *   - name: Auth
 *     description: Autenticación y registro de usuarios
 *   - name: Users
 *     description: Operaciones de usuario autenticado
 *   - name: Admin
 *     description: Operaciones administrativas (solo para rol admin)
 *   - name: Disponibilidad
 *     description: Consultar disponibilidad de espacios y horas - PÚBLICA
 *   - name: Cotizaciones
 *     description: Sistema de cotizaciones para eventos - PÚBLICA (sin autenticación requerida)
 *   - name: Admin - Horarios
 *     description: Gestión de horarios de operación
 *   - name: Admin - Plantillas PDF
 *     description: Gestión de plantillas HTML para generación de PDF
 *   - name: Admin - Socios
 *     description: Gestión de socios con códigos y descuentos
 *   - name: Blog - Salones
 *     description: Blog informativo sobre los salones - PÚBLICO (con cache)
 *   - name: Admin - Blog Salones
 *     description: Gestión del blog de salones (solo admin)
 */
export const openapiDocsRoot = {}
