/* FOOTY NOVA: branded in-page player.
 * Direct authorized MP4 / WebM sources are native HTML5.
 * YouTube / ScoreBat embeds remain hosted players inside the FOOTY shell,
 * because their stream is not available for native playback.
 */
(function(global){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const https=u=>{try{const x=new URL(u);return x.protocol==='https:'?x.href:''}catch{return''}};
function render(v,details){
 if(!v)return '<section class="footy-player footy-player-empty"><div class="player-empty-icon">▷</div><h3>Reproductor FOOTY</h3><p>Selecciona un resumen para verlo aquí, sin abandonar FOOTY NOVA.</p></section>';
 const p=details||{},url=https(p.url||v.url),source=https(v.url);
 const valid=p.kind==='iframe'||p.kind==='video';
 const media=!url||!valid?'<div class="footy-player-fallback">No se dispone de un formato reproducible en este navegador. Consulta la fuente autorizada.</div>':
  p.kind==='video'?
  '<video id="footy-native-video" class="footy-stage" preload="metadata" playsinline controls controlsList="nodownload" src="'+esc(url)+'"></video>':
  '<iframe id="footy-embed" class="footy-stage" src="'+esc(url)+'" title="'+esc(v.title)+'" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" loading="eager"></iframe>';
 return '<section class="footy-player" aria-label="Reproductor de vídeo FOOTY NOVA">'+
  '<div class="footy-player-head"><div class="footy-player-brand">◉ FOOTY <b>PLAYER</b> <span>· RESÚMENES</span></div><button type="button" data-close-player aria-label="Cerrar reproductor">✕</button></div>'+
  '<div class="footy-player-frame">'+media+'</div>'+
  '<div class="footy-player-meta"><div><span class="footy-player-provider">'+esc(v.provider||'Proveedor autorizado')+'</span><h3>'+esc(v.title||'Resumen de partido')+'</h3><p>'+esc(v.competition||'')+'</p></div>'+
  '<div class="footy-player-actions">'+(p.kind==='video'?'<button data-native-fullscreen type="button" aria-label="Pantalla completa">⛶ Pantalla completa</button>':'')+
  (source?'<a href="'+esc(source)+'" target="_blank" rel="noopener noreferrer">Fuente original ↗</a>':'')+'</div></div>'+
  '<p class="footy-player-note">'+(p.kind==='iframe'?'Este vídeo se reproduce dentro de FOOTY NOVA mediante el reproductor obligatorio del proveedor; sus controles pueden ser propios de YouTube o ScoreBat.':'Reproducción HTML5 dentro de FOOTY NOVA. Requiere que el servidor permita el vídeo y proporcione un formato compatible.')+'</p>'+
 '</section>';
}
function click(event){
 const fs=event.target.closest('[data-native-fullscreen]');
 if(fs){const el=document.getElementById('footy-native-video');if(el?.requestFullscreen)el.requestFullscreen().catch(()=>{});return true}
 return false;
}
global.FOOTY_PLAYER={render,click};
})(window);
