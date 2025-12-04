/**
 * @openapi
 * /api/salon-posts:
 *   get:
 *     tags: [Blog - Salones]
 *     summary: Listar posts publicados
 *     description: Obtiene todos los posts del blog que están publicados. Respuesta cacheada (5 min).
 *     parameters:
 *       - in: query
 *         name: espacio_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del espacio/salón
 *     responses:
 *       '200':
 *         description: Lista de posts publicados
 *         headers:
 *           Cache-Control:
 *             schema:
 *               type: string
 *             description: "public, s-maxage=300, stale-while-revalidate=59"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SalonPostSummary'
 *
 * /api/salon-posts/{slug}:
 *   get:
 *     tags: [Blog - Salones]
 *     summary: Obtener un post por slug
 *     description: Obtiene el detalle completo de un post publicado. Respuesta cacheada (5 min).
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug único del post
 *         example: conoce-nuestro-salon-principal
 *     responses:
 *       '200':
 *         description: Detalle del post
 *         headers:
 *           Cache-Control:
 *             schema:
 *               type: string
 *             description: "public, s-maxage=300, stale-while-revalidate=59"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SalonPost'
 *       '404':
 *         description: Post no encontrado
 *
 * /admin/salon-posts:
 *   get:
 *     tags: [Admin - Blog Salones]
 *     summary: Listar todos los posts (admin)
 *     description: Obtiene todos los posts incluyendo borradores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de todos los posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SalonPost'
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No tienes permisos
 *   post:
 *     tags: [Admin - Blog Salones]
 *     summary: Crear nuevo post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalonPostInput'
 *     responses:
 *       '201':
 *         description: Post creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalonPost'
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No tienes permisos
 *
 * /admin/salon-posts/{id}:
 *   get:
 *     tags: [Admin - Blog Salones]
 *     summary: Obtener post por ID (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     responses:
 *       '200':
 *         description: Detalle del post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SalonPost'
 *       '404':
 *         description: Post no encontrado
 *   put:
 *     tags: [Admin - Blog Salones]
 *     summary: Actualizar post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalonPostInput'
 *     responses:
 *       '200':
 *         description: Post actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalonPost'
 *       '404':
 *         description: Post no encontrado
 *   delete:
 *     tags: [Admin - Blog Salones]
 *     summary: Eliminar post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Post eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '404':
 *         description: Post no encontrado
 *
 * /admin/salon-posts/{id}/publish:
 *   post:
 *     tags: [Admin - Blog Salones]
 *     summary: Publicar o despublicar post
 *     description: Cambia el estado de publicación de un post. Si no se envía `publicado`, se alterna el estado actual.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicado:
 *                 type: boolean
 *                 description: Estado de publicación deseado (opcional, si no se envía se alterna)
 *     responses:
 *       '200':
 *         description: Estado de publicación actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalonPost'
 *       '404':
 *         description: Post no encontrado
 */
export const salonPostsPaths = {}
