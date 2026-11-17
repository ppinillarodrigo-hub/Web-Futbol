/* Emblemas proporcionados por el usuario. Los torneos y sus ediciones son entidades diferentes. */
(function(){
'use strict';
const positions=Object.freeze({
 'ger.2':0,'sco.1':1,'bel.1':2,'gre.1':3,'ser.1':4,
 'nor.1':5,'swe.1':6,'irl.1':7,'caf.champions':8,'afc.asian.cup':9
});
window.footyFreshLogoPosition=id=>Object.prototype.hasOwnProperty.call(positions,id)?positions[id]*100/9:null;
})();