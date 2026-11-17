// Preserve source assets and assign the supplied Asian champions trophy to the club competition.
(function(){
const oldLogo=window.footyLogoFor;
const oldNational=window.footyNationalSpriteFor;
const oldCup=window.footyCupSpriteFor;
const over={
'afc.champions':'./assets/afc-u23-asian-cup.webp',
'conmebol.libertadores':'https://commons.wikimedia.org/wiki/Special:FilePath/Copa_Libertadores_logo.svg',
'conmebol.sudamericana':'https://commons.wikimedia.org/wiki/Special:FilePath/Copa_Sudamericana_logo.svg',
'conmebol.recopa':'https://commons.wikimedia.org/wiki/Special:FilePath/Recopa_Sudamericana_logo.svg',
'esp.copa_del_rey':'https://commons.wikimedia.org/wiki/Special:FilePath/Copa_del_Rey_logo.svg',
'eng.fa':'https://commons.wikimedia.org/wiki/Special:FilePath/FA_Cup_2020_logo.svg'
};
window.footyLogoFor=id=>{
 if(id==='afc.u23')return '';
 return over[id]||(typeof oldLogo==='function'?oldLogo(id):'');
};
window.footyNationalSpriteFor=id=>typeof oldNational==='function'?oldNational(id):null;
window.footyCupSpriteFor=id=>Object.prototype.hasOwnProperty.call(over,id)?null:(typeof oldCup==='function'?oldCup(id):null);
window.footyUpdateLogos?.();
})();