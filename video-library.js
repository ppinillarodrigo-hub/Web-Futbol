/* FOOTY NOVA / Highlights discovery: multiple competitions, cached browser requests.
   Fetch only public ESPN summaries and news. No fabricated video URLs.
   Official / licensed provider restrictions remain in force.
*/
(function(global){
'use strict';
const leagues=[
 ['eng.1','Premier League'],['esp.1','LaLiga'],['ita.1','Serie A'],
 ['ger.1','Bundesliga'],['fra.1','Ligue 1'],['uefa.champions','Champions League'],
 ['uefa.europa','Europa League'],['usa.1','MLS'],['conmebol.libertadores','Copa Libertadores']
];
const dayISO=d=>new Date(d).toISOString().slice(0,10);
function daysAgo(day,count){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-count);return dayISO(d)}
function windowFor(id){
 const today=dayISO(new Date());
 if(id==='fifa.world')return ['2026-06-27','2026-07-20'];
 if(id==='conmebol.america.2024')return ['2024-06-20','2024-07-15'];
 if(id==='uefa.euro.2024')return ['2024-06-15','2024-07-15'];
 return [daysAgo(today,55),today];
}
async function gather({current,force=false,getMatches,getJSON,urls,clips,progress,scope='all'}){
 const selected=scope==='league'?[current]:[current,...leagues.map(x=>x[0]).filter(x=>x!==current)];
 const uniq=[...new Set(selected)].slice(0,10),all=[],stats=[];
 const labels=new Map(leagues);labels.set(current,global.FOOTY_LEAGUES?.find(x=>x.id===current)?.name||current);
 let attempted=0,ok=0;
 for(let i=0;i<uniq.length;i+=3){
  const batch=await Promise.allSettled(uniq.slice(i,i+3).map(async id=>{
   const dates=windowFor(id),games=await getMatches(id,dates[0],dates[1],force);
   return {id,files:games.filter(m=>m.status==='done').slice(-(id===current?11:4)).reverse()};
  }));
  const prepared=batch.filter(x=>x.status==='fulfilled').map(x=>x.value);
  for(const {id,files} of prepared){
   stats.push((labels.get(id)||id)+': '+files.length+' partidos');
   for(let k=0;k<files.length;k+=4){
    const results=await Promise.allSettled(files.slice(k,k+4).map(async match=>{
     const raw=await getJSON(urls.summary(id,match.id),force,900000);
     return clips(raw,match,labels.get(id)||id);
    }));
    for(const result of results){attempted++;
     if(result.status==='fulfilled'){
      ok++;
      const valid=result.value.filter(v=>v?.url);
      all.push(...valid);
      if(progress)progress(valid,id);
     }
    }
   }
  }
 }
 return {videos:all,stats,attempted,ok};
}
global.FOOTY_MEDIA={windowFor,leagues,gather};
})(window);
