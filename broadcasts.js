/* FOOTY NOVA | Guía de emisión 2026/27 (España).
 * Operadores con derechos ≠ canal exacto de cada encuentro.
 * Consultar enlaces oficiales antes de interpretar una ficha como confirmación.
 * Fuente: LALIGA, Movistar Plus+, DAZN y Premier League, verificadas 2026-11-18.
 */
(function (global) {
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const commons=filename=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(filename).replace(/%2F/g,'/');
 const channels=Object.freeze({
  movistar:{name:'Movistar Plus+',logo:commons('Movistar Plus+ 2022 logo.svg'),href:'https://www.movistarplus.es/deportes/futbol/la-liga-ea-sports/calendario'},
  laligam:{name:'Movistar LALIGA',logo:commons('LaLigaTV por Movistar Plus+ 2023 Logo.svg'),href:'https://www.movistar.es/tv/agenda-deportiva/calendario-laliga-futbol-partidos-televisados'},
  championsm:{name:'Liga de Campeones por M+',logo:commons('Liga de Campeones por Movistar Plus+ 2022 logo.svg'),href:'https://www.movistarplus.es/deportes/futbol/'},
  dazn:{name:'DAZN',logo:commons('DAZN logo.svg'),href:'https://www.dazn.com/es-ES/home'},
  daznlaliga:{name:'DAZN LALIGA',logo:commons('DAZN LaLiga logo.svg'),href:'https://www.dazn.com/es-ES/home'},
  espn:{name:'ESPN',logo:commons('ESPN wordmark.svg'),href:'https://www.espn.com/soccer/'},
  rtve:{name:'RTVE Play',logo:commons('RTVE Play logo.svg'),href:'https://www.rtve.es/play/'}
 });
 const rights=Object.freeze({
  'esp.1':{channels:['laligam','daznlaliga'],exclusive:false,
   source:'https://www.laliga.com/iframes/external-consumer-broadcast',
   note:'LaLiga informa del canal específico en su programación oficial. No todos los encuentros se emiten en ambos operadores.'},
  'esp.2':{channels:['laligam','dazn'],exclusive:false,
   source:'https://www.movistar.es/tv/agenda-deportiva/calendario-laliga-futbol-partidos-televisados',
   note:'LaLiga Hypermotion está disponible a través de varios paquetes. Revisa el canal concreto antes de cada jornada.'},
  'eng.1':{channels:['dazn'],exclusive:true,
   source:'https://dazngroup.com/press-room/dazn-se-refuerza-en-futbol-renueva-la-premier-league-y-la-emirates-fa-cup-en-exclusiva-en-espana-y-portugal-hasta-2031/',
   note:'DAZN es titular de los derechos de Premier League en España. La disponibilidad depende de la suscripción o distribución contratada.'},
  'uefa.champions':{channels:['championsm'],exclusive:true,
   source:'https://www.movistarplus.es/comunicacion/notas-de-prensa/vuelve-la-uefa-champions-league-arranca-la-mejor-competicion-europea-de-clubes-al-completo-en-movistar-plus/',
   note:'Movistar Plus+ emite la Champions League 2026/27. El dial exacto puede cambiar según el partido.'},
  'uefa.europa':{channels:['championsm'],exclusive:true,
   source:'https://www.movistar.es/tv/futbol/laliga/',
   note:'La Europa League se incluye entre las competiciones de fútbol de Movistar Plus+. Comprueba el canal concreto.'},
  'uefa.europa.conf':{channels:['championsm'],exclusive:true,
   source:'https://www.movistarplus.es/comunicacion/notas-de-prensa/arranca-laliga-ea-sports-en-movistar-plus-vive-la-temporada-al-completo-con-todos-los-partidos-en-directo-y-una-cobertura-exclusiva/',
   note:'La Conference League figura en la oferta de fútbol de Movistar Plus+. Consulta el dial de la jornada.'}
 });
 function badge(id,small=false){
  const ch=channels[id];if(!ch)return '';
  return '<span class="tv-provider'+(small?' tv-provider-small':'')+'" title="'+esc(ch.name)+'">'+
   '<img src="'+esc(ch.logo)+'" loading="lazy" decoding="async" alt="" referrerpolicy="no-referrer" onerror="this.hidden=true">'+
   '<span>'+esc(ch.name)+'</span></span>';
 }
 function nationalGuide(league){
  const r=rights[league];
  return r?{...r,country:'España'}:null;
 }
 function metadata(m){
  const broadcasts=Array.isArray(m?.broadcasts)?m.broadcasts:[];
  const names=[...new Set(broadcasts.flatMap(x=>Array.isArray(x?.names)?x.names:typeof x?.name==='string'?[x.name]:[]))];
  const found=[];
  for(const name of names){
   if(/\bespn\b/i.test(name)&&!found.includes('espn'))found.push('espn');
   if(/\bdazn\b/i.test(name)&&!found.includes('dazn'))found.push('dazn');
  }
  return found;
 }
 function small(league,m){
  const r=nationalGuide(league);
  if(!r){
   const meta=metadata(m);
   return meta.length?'<span class="tv-mini-note">📺 ESPN informa de una señal · territorio sin verificar</span>':
   '<span class="tv-mini-note">📺 Emisión en España sin verificar</span>';
  }
  const list=r.channels.slice(0,2).map(id=>badge(id,true)).join('');
  const qualifier=r.exclusive?'Operador con derechos en España':'Operadores de la liga · canal por confirmar';
  return '<span class="tv-compact" title="'+esc(qualifier)+'">'+list+'<span class="tv-mini-note">'+esc(qualifier)+'</span></span>';
 }
 function card(league,m){return small(league,m)}
 function details(league,m,official){
  const r=nationalGuide(league),ids=r?.channels||[];
  const link=r?.source||(/https:\/\//.test(official||'')?official:'');
  const intro=r?.exclusive?'Operador con derechos en España':'Emisores de la competición en España';
  const names=r?ids.map(id=>'<a class="tv-detail-link" target="_blank" rel="noopener noreferrer" href="'+esc(channels[id].href)+'">'+badge(id,false)+'</a>').join(''):'';
  const note=r?.note||'La fuente consultada no confirma qué cadena emitirá este partido en España.';
  const broadcasts=metadata(m);
  const international=broadcasts.length?'<div class="tv-international"><small>Señales citadas por ESPN (país no verificado; no implica emisión en España)</small><div class="tv-channel-row">'+broadcasts.map(id=>badge(id)).join('')+'</div></div>':'';
  return '<section class="tv-details"><div class="tv-title">📺 Dónde ver el partido <span class="tv-country">🇪🇸 España</span></div>'+
   (names?'<div class="tv-description">'+esc(intro)+'</div><div class="tv-channel-row">'+names+'</div>':'<p class="tv-unknown">No se ha verificado un operador para España.</p>')+
   '<p class="tv-disclaimer">'+esc(note)+'</p>'+
   (link?'<a class="tv-schedule-link" href="'+esc(link)+'" target="_blank" rel="noopener noreferrer">Comprobar canal y horario en la programación oficial ↗</a>':'')+
   international+'</section>';
 }
 function leagueBox(league,official){
  const r=nationalGuide(league);
  if(!r)return '<section class="tv-league-guide"><strong>📺 Dónde verlo en España</strong><p>Operadores sin verificar para esta competición.</p>'+
    (String(official).startsWith('https://')?'<a href="'+esc(official)+'" target="_blank" rel="noopener noreferrer">Web de la competición ↗</a>':'')+'</section>';
  return '<section class="tv-league-guide"><div><strong>📺 Dónde verlo en España</strong><span>'+esc(r.exclusive?'Operador de la competición':'Reparto por partido')+'</span></div>'+
   '<div class="tv-channel-row">'+r.channels.map(id=>badge(id)).join('')+'</div><p>'+esc(r.note)+'</p>'+
   '<a href="'+esc(r.source)+'" target="_blank" rel="noopener noreferrer">Comprobar programación oficial ↗</a></section>';
 }
 global.FOOTY_TV={card,small,details,leagueBox,nationalGuide,metadata};
})(window);