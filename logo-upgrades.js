// Assign the supplied AFC trophy to the club competition, preserving all other existing logos.
(function(){
const oldLogo=window.footyLogoFor;
window.footyLogoFor=id=>{
 if(id==='afc.u23')return ''; // do not repeat the club trophy in the U23 national-team cup
 if(id==='afc.champions')return './assets/afc-u23-asian-cup.webp';
 return typeof oldLogo==='function'?oldLogo(id):'';
};
window.footyUpdateLogos?.();
})();