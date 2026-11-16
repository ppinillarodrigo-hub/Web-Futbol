[GUIA_CHROMEBOOK_FOOTY_WORLD.md](https://github.com/user-attachments/files/34941127/GUIA_CHROMEBOOK_FOOTY_WORLD.md)
# FOOTY WORLD — Guía para Chromebook

## 1. Archivos

- `index.html`: web completa, con diseño responsive y JS.
- `catalogo.json`: lista de resúmenes que verán todos los visitantes cuando ambos archivos estén en el mismo alojamiento HTTPS. Comienza vacío.
- `FOOTY_WORLD_CODIGO_CORREGIDO.txt`: copia del código para copiar/pegar.

## 2. Probar sin instalar programas

1. En tu Chromebook abre **Archivos > Descargas**.
2. Abre `index.html` con Chrome (o, si tu editor lo abre como texto, usa **Abrir con > Chrome**).
3. Comprueba las secciones Clasificación, Partidos, Resúmenes, Favoritos y el modo oscuro.
4. Si los datos ESPN no se cargan cuando lo abres como archivo, publícalo en HTTPS: los navegadores pueden restringir peticiones desde `file://` y los proveedores pueden bloquear solicitudes.

## 3. Publicar usando GitHub Pages (sin Linux ni terminal)

1. En Chrome entra en https://github.com e inicia sesión o crea una cuenta.
2. Crea un repositorio nuevo público llamado `footy-world`. Puedes marcar «Add a README file» para inicializar la rama principal.
3. En el repositorio pulsa **Add file > Upload files** y sube **index.html** y **catalogo.json** del paquete.
4. Confirma los cambios mediante **Commit changes** (en algunas vistas aparece **Propose changes**).
5. Ve a **Settings > Pages**, en «Build and deployment» elige **Deploy from a branch**.
6. Selecciona `main` y `/(root)`; pulsa **Save**.
7. Cuando GitHub publique el sitio, ve a `https://TUUSUARIO.github.io/footy-world/`, sustituyendo `TUUSUARIO` por tu usuario real. También puedes pulsar **Visit site** en la sección Pages.

**Atención:** GitHub Pages hace públicos los archivos de la web. No incluyas contraseñas, tokens privados ni películas o resúmenes alojados como secretos. Para vídeos pesados utiliza un proveedor de vídeo que permita reproducción incrustada, no el repositorio.

## 4. Integrarlo en Google Sites

Opción recomendada con web publicada:

1. Abre https://sites.google.com/new e inicia sesión.
2. Abre tu sitio, o crea una página llamada **Fútbol**.
3. En el panel derecho pulsa **Insertar > Insertar** (en la interfaz inglesa, **Insert > Embed**).
4. Selecciona la pestaña **Por URL / By URL** e introduce `https://TUUSUARIO.github.io/footy-world/`.
5. Pulsa **Insertar / Insert** y agranda el bloque al ancho disponible. También puedes usar **Páginas > Inserción de página completa / Full page embed**.
6. Pulsa **Publicar / Publish** en Google Sites.

Opción rápida para pruebas, sin GitHub: en **Insertar > Insertar > Insertar código**, copia TODO `FOOTY_WORLD_CODIGO_CORREGIDO.txt`, pulsa Siguiente e Insertar. Es menos fiable para una aplicación compleja con scripts, peticiones externas y un `catalogo.json` público.

## 5. Añadir resúmenes propios a la web

1. Ten una **URL HTTPS reproducible** de un vídeo (un enlace de YouTube embebible, un MP4 alojado en un servidor/CDN, WebM o un enlace HLS). Un enlace normal de previsualización de Google Drive **no** equivale a un MP4 directo.
2. En la web publicada pulsa **Resúmenes > Añadir vídeo**.
3. Elige la competición; escribe título, equipos, fecha y, si lo tienes, ID del partido. Pega la URL del vídeo; pulsa **Guardar resumen**.
4. Ese vídeo queda guardado **solo en ese navegador**. Para publicarlo para todos: abre **Resúmenes > Fuentes y catálogo > Exportar catálogo JSON**.
5. En ChromeOS abre **Archivos > Descargas**, renombra el JSON exportado a `catalogo.json`.
6. En GitHub reemplaza/actualiza el archivo `catalogo.json` en la raíz del repositorio con el nuevo JSON y confirma el cambio.
7. Al desplegarse los cambios en GitHub Pages, todos los visitantes verán ese catálogo (sin necesidad de editar `index.html`).

No publiques clips añadidos como **archivo local** mediante `blob:`; no pueden ser reproducidos por otros usuarios. Súbelos primero a un proveedor de vídeo autorizado y agrega la URL pública de inserción o streaming.

## 6. Conectar ScoreBat (opcional)

1. Entra en https://www.scorebat.com/video-api/docs/ y consulta **Access** para obtener el token de API y plan.
2. En tu web: **Resúmenes > Fuentes y catálogo**.
3. Escribe el token en el campo destinado a ello, elige **Gratis** para probar y pulsa **Conectar ScoreBat**.
4. El feed gratuito suele mostrar partidos de al menos 7 días de antigüedad y no cubre todos los encuentros. Para vídeos recientes o por competición necesitas el plan correspondiente.
5. El token se guarda **temporalmente en la pestaña** y solo funciona para tu navegador; no es una integración de backend para todos los visitantes. Para el uso público de tu propia API, gestiona el token en un servidor y sirve un catálogo público sin secretos.

## 7. Si algo falla

- **No se ve clasificación:** la fuente ESPN no ofrece datos para esa competición o la consulta fue bloqueada. Prueba otra liga, pulsa Actualizar y consulta la web oficial. La fuente no es una API oficial de las ligas.
- **No salen resúmenes:** el proveedor puede no haber publicado vídeo reproducible. La versión gratuita de ScoreBat no es un archivo completo.
- **Vídeo bloqueado:** YouTube y proveedores pueden impedir la inserción, la reproducción por región o por política del sitio.
- **Funciona solo para ti:** los clips añadidos al navegador son locales. Exporta y actualiza `catalogo.json` en tu hosting.
- **Chromebook gestionado:** tu centro puede restringir GitHub, la publicación o las URLs de proveedores; en ese caso necesitas un alojamiento permitido por el administrador.
- **Google Sites muestra una caja pequeña:** agranda el bloque o utiliza la inserción de página completa.

## Comprobaciones realizadas

Se han probado, en Chromium de escritorio y móvil y **con respuestas simuladas** de los proveedores, la carga de clasificación, favoritos, navegación, inclusión de YouTube, cierre del reproductor, ScoreBat con URL directa y carga de `catalogo.json`. No se ha verificado la disponibilidad externa real de los vídeos ni la compatibilidad de tu dominio específico con Google Sites.
