/* FOOTY NOVA — goleadores: fuentes verificables y enlaces a federaciones.
   GitHub Pages no puede leer arbitrariamente HTML de ligas externas por CORS.
   Los datos históricos están anclados a sus ediciones y fechas; los demás se
   consultan en ESPN y se enlazan a la clasificación oficial correspondiente.
*/
(function(global){
'use strict';
const officialUrls={
 'esp.1':'https://www.laliga.com/estadisticas/laliga-easports/goleadores',
 'esp.2':'https://www.laliga.com/estadisticas/laliga-hypermotion/goleadores',
 'eng.1':'https://www.premierleague.com/en/stats',
 'ita.1':'https://www.legaseriea.it/serie-a',
 'ger.1':'https://www.bundesliga.com/en/bundesliga/stats/players/goals/',
 'ger.2':'https://www.bundesliga.com/en/2bundesliga/stats/players/goals/',
 'uefa.champions':'https://www.uefa.com/uefachampionsleague/statistics/players/goals/',
 'uefa.europa':'https://www.uefa.com/uefaeuropaleague/statistics/players/?order=desc&sortBy=goals',
 'uefa.europa.conf':'https://www.uefa.com/uefaconferenceleague/statistics/players/goals/',
 'uefa.wchampions':'https://www.uefa.com/womenschampionsleague/statistics/players/goals/',
 'uefa.nations':'https://www.uefa.com/uefanationsleague/statistics/players/goals/',
 'uefa.euro':'https://www.uefa.com/uefaeuro/statistics/players/goals/',
 'uefa.euro.2024':'https://www.uefa.com/uefaeuro/history/seasons/2024/statistics/',
 'uefa.euro.2028':'https://www.uefa.com/uefaeuro/',
 'fifa.world':'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/statistics/player-statistics',
 'fifa.wwc':'https://www.fifa.com/en/tournaments/womens/womensworldcup',
 'conmebol.america':'https://copaamerica.com/es/',
 'conmebol.america.2024':'https://copaamerica.com/es/novedades/copa-america-2024-goleadores-asistencias-lidere',
 'conmebol.libertadores':'https://gol.conmebol.com/libertadores/es/tournament-stats',
 'conmebol.sudamericana':'https://www.conmebol.com/sudamericana/',
 'conmebol.recopa':'https://www.conmebol.com/recopa/',
 'usa.1':'https://www.mlssoccer.com/stats/players/',
 'eng.w.1':'https://womensleagues.thefa.com/statistics/',
 'usa.nwsl':'https://www.nwslsoccer.com/stats',
 'caf.nations':'https://www.cafonline.com/caf-africa-cup-of-nations/',
 'jpn.1':'https://www.jleague.jp/en/stats/',
 'fra.1':'https://ligue1.com/en',
 'fra.2':'https://ligue2.fr/',
 'por.1':'https://www.ligaportugal.pt/',
 'ita.2':'https://www.legab.it/',
 'eng.2':'https://www.efl.com/competitions/championship/',
 'eng.3':'https://www.efl.com/',
 'eng.4':'https://www.efl.com/',
 'fifa.worldq.uefa':'https://www.uefa.com/european-qualifiers/',
 'fifa.worldq.conmebol':'https://www.conmebol.com/eliminatorias-sudamericanas/',
 'fifa.worldq.afc':'https://www.the-afc.com/en/national/asian_qualifiers.html'
};
const archive={
 'fifa.world':{
   season:'Mundial 2026',updated:'2026-07-20',source:'FIFA — clasificación final de goleadores',
   url:'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/statistics/player-statistics',
   players:[['Kylian Mbappé','Francia',10],['Lionel Messi','Argentina',8],['Jude Bellingham','Inglaterra',7],['Erling Haaland','Noruega',7],['Ousmane Dembélé','Francia',6],['Harry Kane','Inglaterra',6],['Mikel Oyarzabal','España',5],['Ismaïla Sarr','Senegal',4],['Julián Quiñones','México',4],['Vinícius Júnior','Brasil',4]]
 },
 'conmebol.america.2024':{
   season:'Copa América 2024',updated:'2024-07-14',source:'CONMEBOL — clasificación final',
   url:'https://copaamerica.com/en/news/copa-america-2024-top-scorers-assists-leaders',
   players:[['Lautaro Martínez','Argentina',5],['Salomón Rondón','Venezuela',3],['Jhon Córdoba','Colombia',2],['Luis Díaz','Colombia',2],['Jefferson Lerma','Colombia',2],['Julián Álvarez','Argentina',2]]
 },
 'uefa.euro.2024':{
   season:'EURO 2024',updated:'2024-07-14',source:'UEFA — clasificación final',
   url:'https://www.uefa.com/uefaeuro/history/seasons/2024/statistics/',
   players:[['Cody Gakpo','Países Bajos',3],['Harry Kane','Inglaterra',3],['Georges Mikautadze','Georgia',3],['Jamal Musiala','Alemania',3],['Dani Olmo','España',3],['Ivan Schranz','Eslovaquia',3]]
 }
};
const num=v=>{if(typeof v==='number')return Number.isFinite(v)?v:null;if(typeof v==='string'&&/^\s*\d+(?:[.,]\d+)?\s*$/.test(v))return Number(v.trim().replace(',','.'));return null};
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const goalRe=/(^|[^a-z])(goals?|goles|goalscored|scoring)([^a-z]|$)/i;
const invalidRe=/assists?|own.goal|conceded|against|allowed|per.?match|average|keepers?|shots?|saves?/i;
const goalTag=o=>{const t=normalize([o.name,o.displayName,o.type?.name||o.type,o.category?.name||o.category,o.abbreviation].filter(Boolean).join(' '));return goalRe.test(t)&&!invalidRe.test(t)};
const goalFromStats=obj=>{
 if(!obj||typeof obj!=='object')return null;
 for(const k of ['goals','goalsScored','totalGoals','goalCount']){const n=num(obj[k]);if(n!==null)return n}
 const seen=new WeakSet();let found=null;
 const search=(v,d=0)=>{if(found!==null||!v||typeof v!=='object'||d>6||seen.has(v))return;seen.add(v);
   if(Array.isArray(v)){for(const x of v.slice(0,80))search(x,d+1);return}
   if(goalTag(v)){const n=num(v.value??v.displayValue??v.stat?.value);if(n!==null){found=n;return}}
   for(const k of ['stats','statistics','categories','splits','values'])if(v[k])search(v[k],d+1);
 };
 search(obj);return found;
};
function parse(response){
 const rows=[],seen=new WeakSet();
 function walk(v,ctx='',d=0){
   if(!v||typeof v!=='object'||d>10||seen.has(v))return;seen.add(v);
   if(Array.isArray(v)){for(const item of v.slice(0,250))walk(item,ctx,d+1);return}
   const isGoal=goalTag(v),context=isGoal?'goals':ctx;
   const player=v.athlete?.athlete||v.athlete||v.player||v.athleteData||null;
   const candidate=player||((v.athleteId||v.playerId)?v:null);
   if(candidate){
     const name=typeof candidate==='object'?(candidate.displayName||candidate.fullName||candidate.shortName||candidate.name||''):'';
     const ref=(typeof candidate==='object'&&(candidate.$ref||candidate.href))||(v.athlete?.$ref)||'';
     let goals=goalFromStats(v);
     if(goals===null&&context==='goals')goals=num(v.value??v.displayValue);
     if(goals!==null&&goals>=0&&(name||ref)){
       const team=candidate?.team?.displayName||v.team?.displayName||v.team?.name||'';
       const headshot=candidate?.headshot?.href||candidate?.headshot||'';
       rows.push({id:String(candidate?.id||v.athleteId||''),name,team,headshot:typeof headshot==='string'&&/^https:\/\//.test(headshot)?headshot:'',goals,ref});
     }
   }
   for(const key of ['leaders','categories','items','results','athletes','entries','players','groups','statistics','splits','data'])if(v[key])walk(v[key],context,d+1);
 }
 walk(response);
 const map=new Map();for(const p of rows){const key=p.id?'id:'+p.id:p.ref?'ref:'+p.ref:'name:'+normalize(p.name)+':'+normalize(p.team);const prior=map.get(key);if(!prior||prior.goals<p.goals)map.set(key,p)}
 return [...map.values()].sort((a,b)=>b.goals-a.goals||a.name.localeCompare(b.name,'es'));
}
function archiveFor(id){const entry=archive[id];if(!entry)return null;return {
 rows:entry.players.map(([name,team,goals],i)=>({id:'archive-'+id+'-'+i,name,team,goals,headshot:'',ref:''})),
 source:entry.source,asOf:entry.updated,season:entry.season,url:entry.url,official:true,archive:true
}}
function linkFor(id,defaultLink){return officialUrls[id]||defaultLink||''}
function resolveRef(ref){if(typeof ref!=='string')return'';try{const u=new URL(ref.replace('sports.core.api.espn.pvt','sports.core.api.espn.com'));return u.protocol==='https:'&&u.hostname==='sports.core.api.espn.com'?u.href:''}catch{return''}}
async function fetchLive(id,getJSON,force){
 const root=`https://site.web.api.espn.com/apis/common/v3/sports/soccer/${encodeURIComponent(id)}/statistics/byathlete`;
 const urls=[
  root+'?category=scoring&sort=goals:desc&limit=60',
  root+'?sort=goals:desc&limit=60',
  `https://site.api.espn.com/apis/site/v2/sports/soccer/${encodeURIComponent(id)}/leaders`,
  `https://sports.core.api.espn.com/v2/sports/soccer/leagues/${encodeURIComponent(id)}/leaders`
 ];
 const problems=[];
 for(const u of urls){
  try{
    let records=parse(await getJSON(u,force,6*60*1000));
    if(!records.length)continue;
    const refs=records.filter(p=>!p.name&&resolveRef(p.ref)).slice(0,18);
    for(let i=0;i<refs.length;i+=5){await Promise.allSettled(refs.slice(i,i+5).map(async p=>{
       try{const v=await getJSON(resolveRef(p.ref),force,6*60*1000);p.name=v.displayName||v.fullName||v.name||p.name;p.id=String(v.id||p.id);p.team=v.team?.displayName||p.team;const h=v.headshot?.href||v.headshot;if(typeof h==='string'&&/^https:\/\//.test(h))p.headshot=h}catch{}
    }))}
    records=records.filter(p=>p.name&&Number.isFinite(p.goals)).sort((a,b)=>b.goals-a.goals||a.name.localeCompare(b.name,'es')).slice(0,40);
    if(records.length)return {rows:records,source:'ESPN (datos no oficiales)',official:false,url:linkFor(id),asOf:new Date().toISOString().slice(0,10),season:'Temporada del proveedor'};
  }catch(e){problems.push(String(e?.message||e))}
 }
 return {rows:[],source:'Sin datos conectados',official:false,url:linkFor(id),error:problems.slice(0,2).join('; ')};
}
async function load(id,getJSON,force=false){
 const a=archiveFor(id);if(a)return a;
 return await fetchLive(id,getJSON,force);
}
global.FOOTY_SCORERS={parse,load,archiveFor,linkFor,goalFromStats};
})(window);