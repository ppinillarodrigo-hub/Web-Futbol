/* FOOTY NOVA: position zones for verified league formats.
   This mapping labels minimum guaranteed places and promotion/relegation positions.
   UEFA extra slots, domestic cups, licensing, sanctions and season exceptions can
   change the final allocation: show explicit warning and always link official rules.
*/
(function(global){
'use strict';
const rules={
 'uefa.champions':{size:36,z:[
  [1,8,'r16','Octavos de final (directo)'],[9,24,'playoff','Playoff de eliminatorias'],[25,36,'out','Eliminado']],
  note:'Fase liga UEFA: 1.º–8.º a octavos; 9.º–24.º a playoff; 25.º–36.º eliminados.'},
 'uefa.europa':{size:36,z:[
  [1,8,'r16','Octavos de final (directo)'],[9,24,'playoff','Playoff de eliminatorias'],[25,36,'out','Eliminado']],
  note:'Fase liga UEFA: 1.º–8.º a octavos; 9.º–24.º a playoff; 25.º–36.º eliminados.'},
 'uefa.europa.conf':{size:36,z:[
  [1,8,'r16','Octavos de final (directo)'],[9,24,'playoff','Playoff de eliminatorias'],[25,36,'out','Eliminado']],
  note:'Fase liga UEFA: 1.º–8.º a octavos; 9.º–24.º a playoff; 25.º–36.º eliminados.'},
 'esp.1':{size:20,z:[[1,4,'champions','Champions League · plazas base'],[18,20,'relegation','Descenso directo']],note:'Las plazas europeas adicionales dependen de copa, títulos y coeficientes; consulta la distribución oficial.'},
 'eng.1':{size:20,z:[[1,4,'champions','Champions League · plazas base'],[18,20,'relegation','Descenso directo']],note:'Las plazas UEFA adicionales pueden cambiar por rendimiento europeo y copas. Solo se señalan plazas base.'},
 'ita.1':{size:20,z:[[1,4,'champions','Champions League · plazas base'],[18,20,'relegation','Descenso directo']],note:'Las plazas UEFA adicionales pueden cambiar por campeones de copa y rendimiento europeo.'},
 'ger.1':{size:18,z:[[1,4,'champions','Champions League · plazas base'],[16,16,'relegation-playoff','Promoción/descenso'],[17,18,'relegation','Descenso directo']],note:'El puesto 16.º disputa eliminatoria contra el 3.º de la 2. Bundesliga; plazas europeas extra variables.'},
 'fra.1':{size:18,z:[[1,3,'champions','Champions League · plazas base'],[16,16,'relegation-playoff','Promoción/descenso'],[17,18,'relegation','Descenso directo']],note:'El 16.º disputa la promoción con un equipo de Ligue 2; las plazas europeas extra son variables.'},
 'esp.2':{size:22,z:[[1,2,'promotion','Ascenso directo'],[3,6,'promotion-playoff','Playoff de ascenso'],[19,22,'relegation','Descenso directo']],note:'El playoff determina la tercera plaza de ascenso.'},
 'eng.2':{size:24,z:[[1,2,'promotion','Ascenso directo'],[3,8,'promotion-playoff','Playoff de ascenso 2026/27'],[22,24,'relegation','Descenso directo']],note:'Nuevo formato 2026/27: seis equipos (3.º–8.º) en playoff de Championship. En temporadas anteriores fueron 3.º–6.º.',validFrom:2026},
 'eng.3':{size:24,z:[[1,2,'promotion','Ascenso directo'],[3,6,'promotion-playoff','Playoff de ascenso'],[21,24,'relegation','Descenso directo']],note:'League One: dos ascensos automáticos y uno mediante playoff.'},
 'eng.4':{size:24,z:[[1,3,'promotion','Ascenso directo'],[4,7,'promotion-playoff','Playoff de ascenso'],[23,24,'relegation','Descenso directo']],note:'League Two: tres ascensos automáticos y un ascenso mediante playoff.'},
 'ger.2':{size:18,z:[[1,2,'promotion','Ascenso directo'],[3,3,'promotion-playoff','Promoción a Bundesliga'],[16,16,'relegation-playoff','Promoción/descenso'],[17,18,'relegation','Descenso directo']],note:'3.º de 2. Bundesliga juega la promoción con el 16.º de Bundesliga.'}
};
const cls={champions:'zona-champions',r16:'zona-champions',playoff:'zona-playoff','relegation-playoff':'zona-dangerplay',relegation:'zona-danger',out:'zona-danger',
 promotion:'zona-promotion','promotion-playoff':'zona-playoff'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function config(id,total,groupCount=1,season=''){
 const c=rules[id];if(!c||total!==c.size||groupCount!==1)return null;
 const match=String(season).match(/20\d{2}/),y=match?Number(match[0]):new Date().getFullYear();
 if(id==='eng.2'&&y<2026){return {...c,z:c.z.map(z=>z[2]==='promotion-playoff'?[3,6,z[2],'Playoff de ascenso (formato anterior)']:z),note:'Para esta temporada, el playoff de Championship es del 3.º al 6.º.'}}
 return c;
}
function get(id,rank,total,groupCount=1,season=''){
 const c=config(id,total,groupCount,season);
 if(!c||!Number.isFinite(Number(rank)))return null;
 const n=Number(rank),zone=c.z.find(([a,b])=>n>=a&&n<=b);
 return zone?{className:cls[zone[2]],type:zone[2],title:zone[3],from:zone[0],to:zone[1]}:null;
}
function legend(id,total,groupCount=1,season='',official=''){
 const c=config(id,total,groupCount,season);
 const link=String(official).startsWith('https://')?'<a target="_blank" rel="noopener noreferrer" href="'+esc(official)+'">Reglamento y clasificación oficial ↗</a>':'';
 if(!c)return '<div class="zone-legend zone-unverified"><span class="zone-intro">Zonas no verificadas para esta tabla: no se señalan ascensos, descensos ni plazas continentales sin respaldo.</span>'+link+'</div>';
 const unique=[];for(const z of c.z)if(!unique.some(x=>x[2]===z[2]&&x[3]===z[3]))unique.push(z);
 return '<div class="zone-legend"><div class="zone-legend-items">'+unique.map(z=>
  '<span class="zone-legend-item"><i class="'+cls[z[2]]+'"></i><b>'+z[0]+(z[0]!==z[1]?'–'+z[1]:'')+'.º</b> '+esc(z[3])+'</span>').join('')+
  '</div><p>'+esc(c.note)+' Zonas informativas, no clasificación matemática definitiva: sanciones y reglas especiales pueden alterar los cupos. '+link+'</p></div>';
}
global.FOOTY_ZONES={get,config,legend};
})(window);
