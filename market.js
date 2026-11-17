/* FOOTY NOVA / Mercado y actualidad.
   Noticias en directo desde los endpoints públicos de ESPN (cobertura variable).
   Una noticia periodística no es una confirmación del club. */
(function(){
'use strict';
const API='https://site.api.espn.com/apis/site/v2/sports/soccer/';
const feeds=[
 ['eng.1','Premier League'],['esp.1','LaLiga'],['ita.1','Serie A'],
 ['ger.1','Bundesliga'],['fra.1','Ligue 1'],['uefa.champions','Champions League'],
 ['usa.1','MLS']
];
const marketPattern=/transfer|signings?|signed|signs?\s|joins?\s|joined|loan|loanee|deal|bid|contract|move to|moves to|free agent|fichaj|traspas|cesi[oó]n|mercado|refuerz|incorpora|renovaci[oó]n|acuerdo|contrata/i;
const rumorPattern=/rumou?r|gossip|linked|interest|interested|could|may\s|might|target|eyeing|consider|in talks|negotiat|reportedly|rumor|pretend|interesa|sondea|podr[ií]a|negoci|apunta a/i;
let items=[],mode='mercado',search='',league='all',busy=false,last=0,successes=0,error='',favorites=[],pending=null;
const $=id=>document.getElementById(id);
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function https(url){try{const u=new URL(String(url||''));return u.protocol==='https:'?u.href:''}catch{return''}}
function articleFrom(raw,feed){
 const headline=String(raw?.headline||raw?.title||'').trim();
 const description=String(raw?.description||raw?.story||raw?.summary||'').replace(/<[^>]*>/g,' ').trim();
 const date=Date.parse(raw?.published||raw?.lastModified||raw?.date||'');
 const link=https(raw?.links?.web?.href||raw?.links?.mobile?.href||raw?.links?.api?.href||raw?.link||'');
 if(!headline||!link||!Number.isFinite(date))return null;
 const image=https(raw?.images?.[0]?.url||raw?.images?.[0]?.href||'');
 const text=headline+' '+description;
 const isTransfer=marketPattern.test(text);
 const isRumor=rumorPattern.test(headline);
 return {id:String(raw.id||link),title:headline,description,date,url:link,image,league:feed[0],leagueName:feed[1],transfer:isTransfer,rumor:isRumor};
}
function readableDate(date){try{return new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short',year:'numeric'}).format(new Date(date))}catch{return''}}
function card(x){
 const tag=x.rumor?'Rumor / seguimiento':x.transfer?'Noticia de mercado':'Actualidad';
 return '<article class="market-story">'+
  '<div class="market-story-cover">'+(x.image?'<img src="'+esc(x.image)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true">':'')+
  '<span class="market-source-mark">FOOTY</span></div>'+
  '<div class="market-story-body"><div class="market-story-meta"><span>'+esc(x.leagueName)+'</span><span>'+esc(readableDate(x.date))+'</span></div>'+
  '<span class="market-tag'+(x.rumor?' rumor':'')+'">'+esc(tag)+'</span>'+
  '<h3>'+esc(x.title)+'</h3><p>'+esc(x.description.slice(0,200)||'Lee la noticia completa en la fuente original.')+'</p>'+
  '<a href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer" class="market-story-link" aria-label="Leer noticia en ESPN: '+esc(x.title)+'">Leer en ESPN ↗</a></div></article>';
}
function filtered(){
 let a=items;
 if(mode==='mercado')a=a.filter(x=>x.transfer);
 else if(mode==='rumores')a=a.filter(x=>x.transfer&&x.rumor);
 else if(mode==='seguidos'){
  const names=favorites.map(x=>String(x.team||'').toLowerCase()).filter(x=>x.length>3);
  a=a.filter(x=>names.some(n=>(x.title+' '+x.description).toLowerCase().includes(n)));
 }
 if(league!=='all')a=a.filter(x=>x.league===league);
 if(search.trim()){const q=search.trim().toLowerCase();a=a.filter(x=>(x.title+' '+x.description+' '+x.leagueName).toLowerCase().includes(q))}
 return a.slice(0,48);
}
function draw(){
 const area=$('market-results');if(!area)return;
 const current=filtered();
 const cnt=$('market-count');if(cnt)cnt.textContent=current.length+' noticias';
 const stamp=$('market-updated');if(stamp)stamp.textContent=busy?'Consultando medios...':(last?'Revisado '+new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit'}).format(new Date(last))+' · ESPN': 'Pendiente de consulta');
 const stat=$('market-status');if(stat)stat.textContent=busy?'Actualizando fuentes...':error||'Información periodística de ESPN. Verifica siempre los anuncios oficiales de los clubes.';
 const btn=$('market-refresh');if(btn)btn.disabled=busy;
 const emptyState='<div class="market-empty"><span>◎</span><strong>'+(busy?'Buscando noticias recientes…':mode==='seguidos'?'Sin noticias sobre tus equipos favoritos':'No hay artículos que coincidan con este filtro')+'</strong><p>'+(successes?'Prueba otra categoría, liga o búsqueda.':'Consulta las fuentes oficiales mientras se recupera la conexión.')+'</p><button type="button" data-market-filter="todas">Ver todas las noticias</button></div>';
 area.innerHTML=current.length?current.map(card).join(''):emptyState;
 document.querySelectorAll('[data-market-filter]').forEach(b=>{b.classList.toggle('selected',b.dataset.marketFilter===mode);b.setAttribute('aria-pressed',String(b.dataset.marketFilter===mode))});
}
function render(savedFavorites=[]){
 favorites=Array.isArray(savedFavorites)?savedFavorites:[];
 return '<div class="market-page">'+
 '<section class="market-intro"><div><span class="market-kicker">TRANSFER WINDOW · FOOTY NOVA</span><h2>El mercado <em>no se detiene.</em></h2><p>Fichajes, rumores y noticias de las principales ligas. Los artículos se abren en la fuente original: una noticia no equivale a un fichaje oficial.</p></div><div class="market-intro-art" aria-hidden="true">↗<span>TRANSFER RADAR</span></div></section>'+
 '<div class="market-toolbar"><div class="market-filters" role="group" aria-label="Filtrar noticias">'+
 '<button type="button" data-market-filter="mercado">Fichajes</button><button type="button" data-market-filter="rumores">Rumores</button><button type="button" data-market-filter="todas">Actualidad</button><button type="button" data-market-filter="seguidos">Mis equipos</button></div>'+
 '<button type="button" class="market-refresh" id="market-refresh" data-market-refresh title="Actualizar noticias">↻ Actualizar</button></div>'+
 '<div class="market-search-row"><label class="market-search" for="market-search"><span>⌕</span><input id="market-search" placeholder="Buscar jugadores, equipos o fichajes…" value="'+esc(search)+'" autocomplete="off"></label>'+
 '<select id="market-league" aria-label="Filtrar por competición"><option value="all">Todas las ligas</option>'+feeds.map(f=>'<option value="'+f[0]+'"'+(league===f[0]?' selected':'')+'>'+esc(f[1])+'</option>').join('')+'</select></div>'+
 '<div class="market-section-top"><div><span class="market-kicker">RADAR DE ACTUALIDAD</span><h3>Últimas publicaciones</h3></div><div class="market-stat"><span id="market-count">0 noticias</span><small id="market-updated">Pendiente de consulta</small></div></div>'+
 '<div class="market-status" id="market-status" role="status">Preparando noticias...</div><div id="market-results" class="market-results"></div>'+
 '<section class="market-official"><div><span class="market-kicker">VERIFICACIÓN</span><h3>Anuncios oficiales</h3><p>Contrasta los movimientos con las páginas oficiales. Las noticias de ESPN se muestran como información periodística, nunca como confirmación automática.</p></div>'+
 '<div class="market-official-links">'+
 '<a href="https://www.laliga.com/" target="_blank" rel="noopener noreferrer">LaLiga ↗</a>'+
 '<a href="https://www.premierleague.com/en/news" target="_blank" rel="noopener noreferrer">Premier League ↗</a>'+
 '<a href="https://www.bundesliga.com/en/bundesliga/news" target="_blank" rel="noopener noreferrer">Bundesliga ↗</a>'+
 '<a href="https://www.uefa.com/" target="_blank" rel="noopener noreferrer">UEFA ↗</a>'+
 '<a href="https://www.mlssoccer.com/news/" target="_blank" rel="noopener noreferrer">MLS ↗</a></div></section></div>';
}
async function load(force=false){
 if(pending)return pending;
 if(!force&&last&&Date.now()-last<8*60*1000){draw();return}
 busy=true;error='';draw();
 pending=(async()=>{
  const results=await Promise.allSettled(feeds.map(async feed=>{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),9500);
    try{
      const res=await fetch(API+encodeURIComponent(feed[0])+'/news?limit=60',{signal:controller.signal,headers:{Accept:'application/json'}});
      if(!res.ok)throw Error('HTTP '+res.status);
      const json=await res.json();
      return (Array.isArray(json.articles)?json.articles:[]).map(a=>articleFrom(a,feed)).filter(Boolean);
    }finally{clearTimeout(timer)}
  }));
  const seen=new Set(),merged=[];successes=0;
  for(const r of results){if(r.status!=='fulfilled')continue;successes++;
   for(const a of r.value){const key=a.url.split('?')[0];if(seen.has(key))continue;seen.add(key);merged.push(a)}
  }
  if(successes){
   const cutoff=Date.now()-1000*60*60*24*100; // older articles are omitted from the 'latest' feed
   items=merged.filter(x=>x.date>=cutoff&&x.date<Date.now()+86400000).sort((a,b)=>b.date-a.date).slice(0,180);
   last=Date.now();
   error=items.length?'':'Las fuentes han respondido, pero no hay noticias recientes en este momento.';
  }else{error='No se han podido conectar las fuentes de noticias. Prueba de nuevo o entra en las páginas oficiales.'}
 })().catch(()=>{error='No se han podido consultar las noticias.'}).finally(()=>{busy=false;pending=null;draw()});
 return pending;
}
function click(e){
 const filter=e.target.closest('[data-market-filter]');
 if(filter){mode=filter.dataset.marketFilter;draw();return true}
 const refresh=e.target.closest('[data-market-refresh]');
 if(refresh){load(true);return true}
 return false;
}
function input(e){
 if(e.target.id==='market-search'){search=e.target.value.slice(0,100);draw();return true}
 if(e.target.id==='market-league'){league=e.target.value;draw();return true}
 return false;
}
window.FOOTY_MARKET={render,load,click,input};
})();