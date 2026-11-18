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

## Datos en vivo y operadores de TV (18-11-2026)

- Las jornadas y las clasificaciones se consultan al abrir la web. Con la pestaña visible se sondean partidos en directo cada ~30 segundos, encuentros restantes cada ~2 minutos y clasificaciones cada ~5 minutos; los tiempos dependen también de la respuesta de ESPN.
- La fecha del calendario avanza al día siguiente si está activado el seguimiento de la jornada actual. Las fechas históricas seleccionadas manualmente se respetan.
- La hora de la última actualización refleja la última **respuesta de datos válida**, no la hora de renderizar. Ante un error se conserva la última tabla o marcador obtenido y se comunica la pérdida de actualización.
- GitHub Pages no ejecuta consultas mientras el navegador está cerrado. ESPN es una fuente pública no oficial y puede fallar o no ofrecer una liga determinada.
- «Dónde verlo» muestra operadores con derechos en España (Movistar Plus+, DAZN) con logos y referencias verificadas. Un operador de liga no equivale a la confirmación del canal exacto de todos sus partidos; se enlaza la programación oficial.
- Consultar emisión por encuentro en LaLiga: https://www.laliga.com/iframes/external-consumer-broadcast
