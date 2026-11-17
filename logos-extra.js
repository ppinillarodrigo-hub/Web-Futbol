/* FOOTY NOVA · Emblemas de Serie B y cinco ligas femeninas aportados por el usuario.
   Archivos webp locales con transparencia: sin CDNs y sin aumentar imágenes pequeñas. */
(function(){
  const original=window.footyLogoFor;
  const logos=Object.freeze({
    'ita.2':'./assets/serie-b-bkt.webp',
    'ger.w.1':'./assets/frauen-bundesliga.webp',
    'ita.w.1':'./assets/serie-a-women.webp',
    'fra.w.1':'./assets/premiere-ligue.webp',
    'eng.w.1':'./assets/wsl.webp',
    'esp.w.1':'./assets/liga-f.webp'
  });
  window.footyLogoFor=id=>logos[id] || (typeof original==='function'?original(id):'');
})();