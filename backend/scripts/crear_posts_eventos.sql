-- Limpiar posts anteriores
DELETE FROM salon_posts WHERE id IN ('1', '2');

-- Insertar nuevos posts de eventos
INSERT INTO salon_posts (espacio_id, titulo, slug, excerpt, content, main_image_url, publicado, published_at, created_at, updated_at)
VALUES 
-- Post 1: Boda
(1, 'Boda Familiar en Salón Mi Llanura', 'boda-familiar-salon-mi-llanura', 
'Una celebración inolvidable llena de amor y alegría', 
'El pasado sábado 25 de noviembre celebramos una hermosa boda en nuestro **Salón Mi Llanura**. 

La decoración en tonos blancos y dorados, combinada con arreglos florales naturales, creó un ambiente romántico y elegante que dejó sin aliento a todos los invitados.

Los novios y sus familias disfrutaron de una velada mágica, con una cena espectacular y una pista de baile que no paró hasta la madrugada.

¡Gracias por confiar en nosotros para su día especial! 💕', 
'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 
true, NOW(), NOW(), NOW()),

-- Post 2: Evento Corporativo
(3, 'Reunión Corporativa Exitosa', 'reunion-corporativa-exitosa', 
'Equipo de trabajo celebra logros del trimestre', 
'La empresa **Tech Solutions** eligió nuestro **Salón Empresarial** para celebrar los logros del último trimestre.

El evento contó con una presentación corporativa en la mañana, seguida de un almuerzo de networking donde los equipos pudieron compartir experiencias y fortalecer lazos profesionales.

El ambiente profesional pero acogedor de nuestro salón fue el escenario perfecto para esta celebración corporativa.

¡Felicitaciones al equipo por sus resultados! 🎯', 
'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', 
true, NOW() - INTERVAL '2 days', NOW(), NOW()),

-- Post 3: XV Años
(4, 'Celebración de XV Años en la Terraza', 'celebracion-xv-anos-terraza', 
'Una fiesta mágica al aire libre', 
'La **Terraza** se vistió de gala para celebrar los XV años de María José. 

La decoración en tonos rosa y plateado, junto con la iluminación nocturna, transformaron el espacio en un lugar de ensueño. Los invitados disfrutaron de una velada al aire libre con música en vivo y una cena buffet internacional.

El baile del vals bajo las estrellas fue el momento más emotivo de la noche.

¡Feliz XV años, María José! ✨', 
'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 
true, NOW() - INTERVAL '5 days', NOW(), NOW());
