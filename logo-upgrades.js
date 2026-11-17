// Assign the supplied AFC trophy to the club competition, preserving all other existing logos.
(function(){
const oldLogo=window.footyLogoFor;
window.footyLogoFor=id=>{
 if(id==='afc.champions')return './assets/afc-u23-asian-cup.webp';
 return typeof oldLogo==='function'?oldLogo(id):'';
};
window.footyUpdateLogos?.();
})();