(function(){var d=document,$=function(i){return d.getElementById(i)},K='tasbih-v1',S={sel:0,counts:{},goal:33,vib:1},P=[['SubhanAllah',33,'سُبْحَانَ ٱللَّٰهِ'],['Alhamdulillah',33,'ٱلْحَمْدُ لِلَّٰهِ'],['Allahu Akbar',34,'ٱللَّٰهُ أَكْبَر'],['La ilaha illa Allah',100,'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ'],['Om Namah Shivaya',108,'ॐ नमः शिवाय'],['Om (Aum)',108,'ॐ'],['Ram Ram',108,'राम राम'],['Waheguru',108,'ਵਾਹਿਗੁਰੂ'],['Free count',0,'']];
 try{var x=JSON.parse(localStorage.getItem(K));if(x)S=Object.assign(S,x)}catch(e){}
 function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
 var sel=$('tb-sel'),cnt=$('tb-cnt'),lbl=$('tb-lbl'),goal=$('tb-goal'),pr=$('tb-pr'),tap=$('tb-tap'),tot=$('tb-tot');if(!sel)return;
 P.forEach(function(p,i){var o=d.createElement('option');o.value=i;o.textContent=p[0]+(p[1]?' ('+p[1]+')':'');sel.appendChild(o)});
 function draw(){var i=S.sel,c=S.counts[i]||0,g=S.goals&&S.goals[i]!==undefined?S.goals[i]:P[i][1];sel.value=i;cnt.textContent=c;lbl.textContent=P[i][2];goal.value=g;pr.max=g||1;pr.value=g?Math.min(c,g):0;pr.hidden=!g;
  var t=0;for(var k in S.counts)t+=S.counts[k];tot.textContent=t;$('tb-vib').checked=!!S.vib;
  if(g&&c>=g){cnt.style.color='var(--teal)'}else cnt.style.color=''}
 function bump(){var i=S.sel,g=S.goals&&S.goals[i]!==undefined?S.goals[i]:P[i][1];S.counts[i]=(S.counts[i]||0)+1;save();draw();
  if(S.vib&&navigator.vibrate){try{navigator.vibrate(g&&S.counts[i]%g===0?[80,60,80]:15)}catch(e){}}}
 tap.addEventListener('click',bump);
 d.addEventListener('keydown',function(e){if(e.target&&/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key===' '||e.key==='Enter'){e.preventDefault();bump()}});
 sel.addEventListener('change',function(){S.sel=+sel.value;save();draw()});
 goal.addEventListener('change',function(){S.goals=S.goals||{};S.goals[S.sel]=Math.max(0,parseInt(goal.value||0,10));save();draw()});
 $('tb-undo').addEventListener('click',function(){var i=S.sel;if(S.counts[i]>0)S.counts[i]--;save();draw()});
 $('tb-reset').addEventListener('click',function(){S.counts[S.sel]=0;save();draw()});
 $('tb-vib').addEventListener('change',function(){S.vib=$('tb-vib').checked?1:0;save()});
 draw()})();