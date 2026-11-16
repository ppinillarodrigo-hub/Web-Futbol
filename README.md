# FOOTY NOVA · Edición mundial

Rediseño integral para GitHub Pages. El sitio está compuesto por HTML, CSS, JS y un escudo transparente.

## Publicar desde tu Chromebook

1. Sube los archivos de este paquete a la raíz del repositorio GitHub `ppinillarodrigo-hub/Web-Futbol`.
2. Conserva activado GitHub Pages → rama `main` → `/(root)`.
3. Entra en `https://ppinillarodrigo-hub.github.io/Web-Futbol/` y pulsa Ctrl + Shift + R.
4. En Google Sites, inserta la URL de GitHub Pages.

## Goleadores y competiciones

Las tablas, resultados y goleadores proceden de endpoints públicos de ESPN. ESPN no es la API oficial de cada liga. La disponibilidad depende del proveedor. Cuando no existe una tabla fiable, FOOTY NOVA muestra un aviso en lugar de inventar datos. El catálogo incluye 64 competiciones, no todas las existentes en el mundo.

## Resúmenes

La web busca vídeos embebibles en ESPN y permite configurar ScoreBat. La API de ScoreBat necesita un token. Su `free-feed` ofrece vídeos antiguos y `featured-feed` requiere un plan de pago. Más información: https://www.scorebat.com/video-api/docs/

La configuración introducida por cada usuario se guarda en la sesión de ese navegador; no se publica en GitHub. En producción, conecta ScoreBat a través de un backend para proteger el token.

También puedes añadir tus vídeos autorizados al archivo `catalogo.json` en el siguiente formato:

```json
{"version":1,"videos":[{"id":"partido-123","title":"Resumen del partido","competition":"LaLiga EA SPORTS","date":"2026-11-16","provider":"Archivo propio","url":"https://www.youtube.com/watch?v=VIDEO_ID"}]}
```

También admite enlaces HTTPS a MP4/WebM y URLs de reproductores incrustables de ScoreBat.

## Diseño

Paleta azul noche + azul océano + cian neón + verde en vivo; responsive para móvil y Chromebook; favicon sin esquinas blancas.
