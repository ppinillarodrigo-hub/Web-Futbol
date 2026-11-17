/* FOOTY NOVA · Emblemas de Serie B y cinco ligas femeninas aportados por el usuario.
   Archivos webp locales con transparencia: sin CDNs y sin aumentar imágenes pequeñas. */
(function(){
  const original=window.footyLogoFor;
  const logos=Object.freeze({
    'ger.2':'./assets/crisp/ger-2.webp',
    'sco.1':'./assets/crisp/sco-1.webp',
    'bel.1':'./assets/crisp/bel-1.webp',
    'gre.1':'./assets/crisp/gre-1.webp',
    'ser.1':'./assets/crisp/ser-1.webp',
    'nor.1':'./assets/crisp/nor-1.webp',
    'swe.1':'./assets/crisp/swe-1.webp',
    'irl.1':'./assets/crisp/irl-1.webp',
    'caf.champions':'./assets/crisp/caf-champions.webp',
    'afc.asian.cup':'./assets/crisp/afc-asian-cup.webp',
    'ita.2':'./assets/serie-b-bkt.webp',
    'fifa.world':'./assets/fifa-world-cup-trophy.webp',
    'conmebol.america.2024':'./assets/copa-america-2024.webp',
    'uefa.euro.2028':'./assets/euro-2028.webp',
    'uefa.euro':'./assets/euro-2028.webp',
    'fra.1':'./assets/ligue1-new.webp',
    'por.1':'./assets/liga-portugal-new.webp',
    'aut.1':'./assets/bundesliga-austria-new.webp',
    'ger.w.1':'./assets/frauen-bundesliga.webp',
    'ita.w.1':'./assets/serie-a-women.webp',
    'fra.w.1':'./assets/premiere-ligue.webp',
    'eng.w.1':'./assets/wsl.webp',
    'esp.w.1':'./assets/liga-f.webp',
    'uefa.nations':'https://commons.wikimedia.org/wiki/Special:FilePath/Uefa_nations_league_textlogo.png',
    'concacaf.gold':'https://commons.wikimedia.org/wiki/Special:FilePath/Concacaf_Gold_Cup_2021.svg',
    'concacaf.nations.league':'https://commons.wikimedia.org/wiki/Special:FilePath/CONCACAF_Nations_League_(2026).svg',
    'caf.nations':'https://commons.wikimedia.org/wiki/Special:FilePath/2025_Africa_Cup_of_Nations_logo.svg'
  });
  window.footyLogoFor=id=>logos[id] || (typeof original==='function'?original(id):'');
})();