(function(){
const dir='https://a.espncdn.com/i/leaguelogos/soccer/';
const ids={'esp.1':15,'eng.1':23,'ita.1':12,'ger.1':10,'fra.1':9,'ned.1':11,'por.1':14,'tur.1':18,'arg.1':1,'bra.1':85,'mex.1':22,'jpn.1':2199,'chn.1':2350,'tha.1':2341,'aus.1':1308};
const external={
 'uefa.champions':'https://commons.wikimedia.org/wiki/Special:FilePath/UEFA_Champions_League_logo_no_text.svg',
 'uefa.europa':'https://commons.wikimedia.org/wiki/Special:FilePath/UEFA_Europa_League_logo_(2024_version).svg',
 'uefa.europa.conf':'https://commons.wikimedia.org/wiki/Special:FilePath/UEFA_Conference_League_full_logo_(2024_version).svg',
 'uefa.wchampions':'https://commons.wikimedia.org/wiki/Special:FilePath/UEFA_Women%27s_Champions_League_logo.svg',
 'conmebol.libertadores':'https://commons.wikimedia.org/wiki/Special:FilePath/Copa_Libertadores_logo.svg',
 'conmebol.sudamericana':'https://commons.wikimedia.org/wiki/Special:FilePath/Copa_Sudamericana_logo.svg',
 'conmebol.recopa':'https://commons.wikimedia.org/wiki/Special:FilePath/Recopa_Sudamericana_logo.svg',
 'eng.2':'https://commons.wikimedia.org/wiki/Special:FilePath/EFL_Championship_logo.svg',
 'eng.3':'https://commons.wikimedia.org/wiki/Special:FilePath/EFL_League_One_logo.svg',
 'eng.4':'https://commons.wikimedia.org/wiki/Special:FilePath/EFL_League_Two_logo.svg',
 'ita.2':'https://commons.wikimedia.org/wiki/Special:FilePath/Serie_B_logo.svg',
 'ger.2':'https://commons.wikimedia.org/wiki/Special:FilePath/2._Bundesliga_logo.svg',
 'fra.2':'https://commons.wikimedia.org/wiki/Special:FilePath/Ligue_2_logo.svg',
 'ned.2':'https://commons.wikimedia.org/wiki/Special:FilePath/Eerste_Divisie_logo.svg',
 'bel.1':'https://commons.wikimedia.org/wiki/Special:FilePath/Belgian_Pro_League_logo.svg',
 'sco.1':'https://commons.wikimedia.org/wiki/Special:FilePath/Scottish_Premiership_logo.svg',
 'aut.1':'https://commons.wikimedia.org/wiki/Special:FilePath/Austrian_Football_Bundesliga_logo.svg',
 'gre.1':'https://commons.wikimedia.org/wiki/Special:FilePath/Super_League_Greece_logo.svg',
 'den.1':'https://commons.wikimedia.org/wiki/Special:FilePath/Danish_Superliga_logo.svg',
 'nor.1':'https://commons.wikimedia.org/wiki/Special:FilePath/Eliteserien_logo.svg',
 'swe.1':'https://commons.wikimedia.org/wiki/Special:FilePath/Allsvenskan_logo.svg'
};
const marks={};for(const [id,n] of Object.entries(ids))marks[id]={dark:dir+'500-dark/'+n+'.png',light:dir+'500/'+n+'.png'};
for(const [id,url] of Object.entries(external))marks[id]={dark:url,light:url};
window.footyLogoFor=id=>{const item=marks[id];return item?(document.documentElement.dataset.theme==='light'?item.light:item.dark):''};
window.footyUpdateLogos=()=>document.querySelectorAll('img[data-league-logo]').forEach(im=>{const url=window.footyLogoFor(im.dataset.leagueLogo);if(url&&im.getAttribute('src')!==url){im.parentElement.classList.remove('logo-loaded');im.src=url;}else if(!url){im.hidden=true;im.parentElement.classList.remove('logo-loaded')}});
window.footyHydrateLogos=async()=>{try{let r=await fetch('https://api-football-standings.azharimm.site/leagues');if(!r.ok)return;let o=await r.json();for(const x of o.data||[]){if(!marks[x.id]&&x.logos?.light&&/^https:\/\//.test(x.logos.light))marks[x.id]={light:x.logos.light,dark:x.logos.dark||x.logos.light};}window.footyUpdateLogos();}catch(e){}};
})();