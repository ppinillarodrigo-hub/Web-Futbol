// Use the verified AFC Champions League Elite badge; never reuse the old under-23 cup image for a different event.
(function(){
const oldLogo=window.footyLogoFor;
window.footyLogoFor=id=>{
 if(id==='afc.champions')return 'https://commons.wikimedia.org/wiki/Special:FilePath/AFC_Champions_League_Elite_Badge_Home.png';
 return typeof oldLogo==='function'?oldLogo(id):'';
};
window.footyUpdateLogos?.();
})();