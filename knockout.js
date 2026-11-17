/* FOOTY NOVA: Camino a la final.
 * Usa resultados y nombres de ronda provenientes de ESPN; jamás inventa cruces.
 * No infiere los emparejamientos de columnas: el sorteo oficial determina el camino.
 */
(function(global){
'use strict';
const CUPS=new Set([
 'uefa.champions','uefa.europa','uefa.europa.conf','uefa.wchampions','uefa.euro',
 'conmebol.libertadores','conmebol.sudamericana','conmebol.recopa','conmebol.libertadores.femenina',
 'conmebol.america','conmebol.america.2024','concacaf.champions','concacaf.gold',
 'afc.champions','afc.asian.cup','caf.champions','caf.nations','fifa.world','fifa.wwc',
 'esp.copa_del_rey','eng.fa','ger.dfb_pokal','ita.coppa_italia','uefa.nations',
 'esp.2'
]);
const ESC=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const labels={playoff:'Playoffs',r32:'Dieciseisavos',r16:'Octavos',qf:'Cuartos',sf:'Semifinales',final:'Final'};
const order=['playoff','r32','r16','qf','sf','final'];
const MONTHS=(y,m)=>String(y)+String(m).padStart(2,'0');
const canShow=id=>CUPS.has(id)||/copa|cup|pokal|champions|recopa|libertadores|sudamericana|nations|europa|euro/.test(id);
function months(id,year){
 let start,end;
 if(id==='fifa.world'||id==='fifa.wwc'){start=[year,5];end=[year,8]}
 else if(id.startsWith('conmebol.')||id.startsWith('concacaf.')){start=[year,2];end=[year,12]}
 else if(id==='afc.asian.cup'||id==='caf.nations'){start=[year,1];end=[year,12]}
 else{start=[year,9];end=[year+1,6]}
 const out=[];for(let y=start[0],m=start[1];y<end[0]||(y===end[0]&&m<=end[1]);m++){if(m===13){m=1;y++}out.push(MONTHS(y,m))}
 return out;
}
function seasonYear(id,selectedYear){
 if(Number.isInteger(selectedYear))return selectedYear;
 const d=new Date(),y=d.getFullYear(),m=d.getMonth()+1;
 if(id==='fifa.world')return 2026;
 if(id==='conmebol.america.2024')return 2024;
 if(id==='uefa.euro')return 2028;
 if(id.startsWith('conmebol.')||id.startsWith('concacaf.')||id==='afc.asian.cup'||id==='caf.nations')return y;
 return m<7?y-1:y;
}
function stage(s){
 const x=String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(/group|fase de liga|league phase|first stage|regular season|preliminary league/.test(x))return null;
 if(/semi[\s-]*final|semifinal|last four|final four/.test(x))return 'sf';
 if(/quarter[\s-]*final|cuartos|last eight/.test(x))return 'qf';
 if(/round of 32|dieciseisav|32avos|last 32/.test(x))return 'r32';
 if(/round of 16|octavos|last 16|eighth.?final/.test(x))return 'r16';
 if(/knockout.phase.play.off|play.off|playoff|repechaje/.test(x))return 'playoff';
 if(/\bfinal\b|the final|gran final/.test(x))return 'final';
 return null;
}
function extractStage(e){
 const c=e?.competitions?.[0]||{},week=e?.week||{};
 const possibilities=[
 c.round?.displayName,c.round?.name,e.round?.displayName,e.round?.name,
 week.text,week.displayName,week.name,
 c.type?.text,c.type?.name,e.season?.type?.name,
 c.notes?.map(x=>x.headline||x.text).join(' '),e.notes?.map(x=>x.headline||x.text).join(' '),
 e.group?.name
 ];
 for(const s of possibilities){if(!s)continue;const a=stage(s);if(a)return a}
 return null;
}
function parseEvent(e){
 const c=e?.competitions?.[0]||{},t=c.competitors||[];
 if(t.length<2||!e.id)return null;
 const h=t.find(x=>x.homeAway==='home')||t[0],a=t.find(x=>x.homeAway==='away')||t[1];
 const typ=e.status?.type||c.status?.type||{};
 const date=Date.parse(e.date||c.date||'');
 const score=x=>x?.score===0?0:Number.isFinite(Number(x?.score))?Number(x.score):null;
 const name=x=>x?.team?.displayName||x?.team?.name||'Por confirmar';
 return {id:String(e.id),round:extractStage(e),date:Number.isFinite(date)?date:null,
  home:name(h),away:name(a),homeId:String(h.team?.id||name(h)),awayId:String(a.team?.id||name(a)),
  hscore:score(h),ascore:score(a),played:!!(typ.completed||typ.state==='post'),status:typ.shortDetail||typ.detail||'',
  venue:c.venue?.fullName||'',eventName:e.name||''};
}
function fixtures(events){
 const seen=new Set(),buckets={};for(const v of order)buckets[v]=[];
 const unidentified=[];
 for(const event of events){
  const m=parseEvent(event);if(!m||seen.has(m.id))continue;seen.add(m.id);
  if(m.round)buckets[m.round].push(m);else unidentified.push(m);
 }
 const rounds=order.map(key=>{
  const g=new Map();
  for(const match of buckets[key]){
   const pair=[match.homeId,match.awayId].sort().join('/');
   const grp=g.get(pair)||[];grp.push(match);g.set(pair,grp)
  }
  const ties=[...g.values()].map(g=>g.sort((a,b)=>(a.date||0)-(b.date||0))).sort((a,b)=>(a[0].date||0)-(b[0].date||0));
  return {key,title:labels[key],ties};
 });
 return {rounds,unidentified,identified:rounds.reduce((n,x)=>n+x.ties.length,0)};
}
async function load(id,getJSON,force=false,selectedYear=null){
 const y=seasonYear(id,selectedYear);
 const periods=months(id,y);
 const fetched=[];let success=0;
 for(let i=0;i<periods.length;i+=4){
  const settled=await Promise.allSettled(periods.slice(i,i+4).map(period=>
   getJSON('https://site.api.espn.com/apis/site/v2/sports/soccer/'+encodeURIComponent(id)+'/scoreboard?dates='+period+'&limit=300',force,750000)));
  for(const z of settled)if(z.status==='fulfilled'&&Array.isArray(z.value?.events)){success++;fetched.push(...z.value.events)}
 }
 if(!success)throw new Error('ESPN no ha proporcionado el calendario de esta competición');
 const rounds=fixtures(fetched);
 return {...rounds,year:y,periods:periods.length,success,events:fetched.length};
}
function fixtureCard(tie){
 const first=tie[0],last=tie[tie.length-1];
 const score=(teamId)=>{
  if(!tie.every(m=>m.played&&m.hscore!==null&&m.ascore!==null))return null;
  let total=0;for(const m of tie)total+=m.homeId===teamId?m.hscore:m.ascore;
  return total;
 };
 const firstName=first.home,secondName=first.away;
 const h=score(first.homeId),a=score(first.awayId);
 const aggregate=tie.length>1&&h!==null&&a!==null;
 const status=aggregate?'Global · '+h+'–'+a:last.played?'Finalizado':last.date?new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short'}).format(new Date(last.date)):'Por confirmar';
 const team=(name,result,highlight)=>'<div class="ko-team"><span class="ko-team-name">'+ESC(name)+'</span><b'+(highlight?' class="ko-winner"':'')+'>'+(result===null?'–':result)+'</b></div>';
 const homeResult=aggregate?h:first.hscore,awayResult=aggregate?a:first.ascore;
 return '<div class="ko-tie" tabindex="0" role="group" aria-label="'+ESC(firstName+' contra '+secondName)+'">'+
  team(firstName,homeResult,aggregate&&h>a)+team(secondName,awayResult,aggregate&&a>h)+
  '<div class="ko-tie-meta"><span>'+ESC(status)+'</span><span>'+(tie.length>1?tie.length+' partidos':'1 partido')+'</span></div></div>';
}
function render(id,data,official,loading,error){
 const link=String(official||'').startsWith('https://')?official:'';
 const officialLink= id==='uefa.champions'?'https://www.uefa.com/uefachampionsleague/fixtures-results/bracket/':
 id==='uefa.europa'?'https://www.uefa.com/uefaeuropaleague/fixtures-results/bracket/':
 id==='uefa.europa.conf'?'https://www.uefa.com/uefaconferenceleague/fixtures-results/bracket/':link;
 const head='<section class="ko-heading"><div><span class="ko-kicker">FASE FINAL / CAMINO AL TÍTULO</span><h3>El camino a la final</h3><p>Cuadro por rondas con partidos publicados por ESPN. Los cruces futuros no se inventan y el orden visual no sustituye al sorteo oficial.</p></div>'+
 '<div class="ko-heading-actions"><button type="button" data-ko-reload>↻ Actualizar</button>'+(officialLink?'<a target="_blank" rel="noopener noreferrer" href="'+ESC(officialLink)+'">Cuadro oficial ↗</a>':'')+'</div></section>';
 if(loading)return head+'<div class="ko-state">Consultando rondas y eliminatorias…</div>';
 if(error)return head+'<div class="ko-state"><strong>No se han podido obtener los cruces</strong><p>'+ESC(error)+'</p>'+(officialLink?'<a href="'+ESC(officialLink)+'" target="_blank" rel="noopener noreferrer">Consultar los cruces oficiales ↗</a>':'')+'</div>';
 const r=data?.rounds||order.map(key=>({key,title:labels[key],ties:[]}));
 const visible=r.filter(v=>v.key!=='r32'||v.ties.length);
 const columns=visible.map(({key,title,ties})=>{
   return '<section class="ko-round"><div class="ko-round-header"><span>'+ESC(title)+'</span><small>'+ties.length+' cruces</small></div>'+
    '<div class="ko-ties">'+(ties.length?ties.slice(0,18).map(fixtureCard).join(''):'<div class="ko-pending">Emparejamientos por confirmar</div>')+
    (ties.length>18?'<div class="ko-pending">+ '+(ties.length-18)+' cruces adicionales en el sitio oficial</div>':'')+'</div></section>';
 }).join('');
 const found=data?.identified||0,unidentified=data?.unidentified?.length||0;
 const info='<p class="ko-note">'+(found?'Rondas reconocidas con partidos publicados. ':'Sin emparejamientos de fase final identificados todavía. ')+
 (unidentified?'ESPN también tiene '+unidentified+' partidos sin ronda identificada que no se han asignado a un cruce. ':'')+
 'Las llaves entre rondas solo son definitivas tras el sorteo oficial.</p>';
 const unclassified=unidentified?'<details class="ko-other"><summary>Ver '+unidentified+' partidos sin ronda identificada</summary><div class="ko-other-grid">'+data.unidentified.slice(0,30).map(x=>'<div><strong>'+ESC(x.home)+' – '+ESC(x.away)+'</strong><span>'+ESC(x.date?new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short',year:'numeric'}).format(new Date(x.date)):'Por confirmar')+'</span></div>').join('')+'</div></details>':'';
 return head+'<div class="ko-view"><div class="ko-rounds" role="group" aria-label="Progreso de las eliminatorias hasta la final">'+columns+'</div></div>'+info+unclassified;
}
global.FOOTY_KNOCKOUT={canShow,load,render,fixtures,stage,seasonYear};
})(window);
