(function(){'use strict';
var d=document,$=function(s){return d.querySelector(s)},S=window.SunCalc,T={"RAHU": [2, 7, 5, 6, 4, 3, 8], "GULIKA": [6, 5, 4, 3, 2, 1, 7], "YAMA": [4, 3, 2, 1, 7, 6, 5], "DC": ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"], "NC": ["Shubh", "Amrit", "Chal", "Rog", "Kaal", "Labh", "Udveg"], "DS": ["Amrit", "Rog", "Labh", "Shubh", "Chal", "Kaal", "Udveg"], "NS": ["Chal", "Kaal", "Udveg", "Amrit", "Rog", "Labh", "Shubh"], "GOOD": {"Amrit": "good", "Shubh": "good", "Labh": "good", "Chal": "neutral", "Udveg": "avoid", "Kaal": "avoid", "Rog": "avoid"}, "WD": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]};
var RK=window.RK={};
function dayOf(y,m,dd){var x=new Date(Date.UTC(y,m-1,dd)).getUTCDay();return (x+6)%7}
function part(r,s,n){var w=(s-r)/8;return [r+(n-1)*w,r+n*w]}
RK.calc=function(y,m,dd,lat,lon,tz){
 var off=tz?S.offset(tz,y,m,dd):null;if(off===null)off=Math.round(lon/15)*60;
 var t=S.times(y,m,dd,lat,lon);if(t.rise===null)return {polar:t.polar,off:off};
 var n=new Date(Date.UTC(y,m-1,dd+1)),t2=S.times(n.getUTCFullYear(),n.getUTCMonth()+1,n.getUTCDate(),lat,lon);
 var off2=tz?S.offset(tz,n.getUTCFullYear(),n.getUTCMonth()+1,n.getUTCDate()):null;if(off2===null)off2=off;
 var rise=t.rise+off,set=t.set+off,nrise=t2.rise===null?rise+1440:t2.rise+off2+1440;
 var wd=dayOf(y,m,dd),o={wd:wd,off:off,rise:rise,set:set,rahu:part(rise,set,T.RAHU[wd]),gulika:part(rise,set,T.GULIKA[wd]),yama:part(rise,set,T.YAMA[wd])};
 var d15=(set-rise)/15;o.abhijit=[rise+7*d15,rise+8*d15];
 var w=(set-rise)/8,i=T.DC.indexOf(T.DS[wd]),k;o.day=[];for(k=0;k<8;k++)o.day.push([T.DC[(i+k)%7],rise+k*w,rise+(k+1)*w]);
 var w2=(nrise-set)/8,j=T.NC.indexOf(T.NS[wd]);o.night=[];for(k=0;k<8;k++)o.night.push([T.NC[(j+k)%7],set+k*w2,set+(k+1)*w2]);
 return o};
function hm(m){if(m===null||isNaN(m))return '—';var x=Math.round(m)%1440;if(x<0)x+=1440;return ('0'+Math.floor(x/60)).slice(-2)+':'+('0'+x%60).slice(-2)}
function hm12(m){var x=Math.round(m)%1440;if(x<0)x+=1440;var h=Math.floor(x/60),mi=x%60;return (h%12||12)+':'+('0'+mi).slice(-2)+(h<12?' am':' pm')}
RK.hm=hm;
function nowIn(tz,y,m,dd){try{var p=new Intl.DateTimeFormat('en-GB',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()),g={};p.forEach(function(q){g[q.type]=+q.value});
 if(g.year===y&&g.month===m&&g.day===dd)return g.hour*60+g.minute;}catch(e){}return null}
function chog(list,now,label){var rows=list.map(function(c){var cl=T.GOOD[c[0]],tag=cl==='good'?'Good':cl==='neutral'?'Neutral':'Avoid';
 var on=now!==null&&((now>=c[1]&&now<c[2])||(now+1440>=c[1]&&now+1440<c[2]));
 return '<tr'+(on?' class="now"':'')+'><td>'+c[0]+(on?' <b>(now)</b>':'')+'</td><td class="w3-n">'+hm(c[1])+' – '+hm(c[2])+'</td><td><span class="rk-'+cl+'">'+tag+'</span></td></tr>'}).join('');
 return '<h3>'+label+'</h3><div class="tbl"><table class="w3"><thead><tr><th>Choghadiya<th class="w3-n">Time<th>Kind</thead><tbody>'+rows+'</tbody></table></div>'}
RK.render=function(o,name,y,m,dd,tz){
 if(o.polar)return '<p class="w3-empty">The sun does not rise and set normally at this place on this date, so these timings cannot be worked out.</p>';
 var now=tz?nowIn(tz,y,m,dd):null,wdn=T.WD[o.wd];
 var txt=name+', '+wdn+' '+dd+'/'+m+'/'+y+': Rahu Kaal '+hm(o.rahu[0])+' to '+hm(o.rahu[1])+'; sunrise '+hm(o.sunrise===undefined?o.rise:o.rise)+', sunset '+hm(o.set)+'. (shareyourgroup.com)';
 var h='<h2>'+name+', '+wdn+' '+dd+'/'+m+'/'+y+'</h2><ul class="w3-chips"><li><b>'+hm(o.rahu[0])+' – '+hm(o.rahu[1])+'</b><small>Rahu Kaal</small></li><li><b>'+hm(o.rise)+'</b><small>Sunrise</small></li><li><b>'+hm(o.set)+'</b><small>Sunset</small></li></ul>';
 h+='<div class="tbl"><table class="w3"><thead><tr><th>Period<th class="w3-n">Time (local, 24 hour)<th>Traditional view</thead><tbody>'+
  '<tr><td>Rahu Kaal</td><td class="w3-n">'+hm(o.rahu[0])+' – '+hm(o.rahu[1])+'</td><td>Avoid starting new work</td></tr>'+
  '<tr><td>Gulika Kaal</td><td class="w3-n">'+hm(o.gulika[0])+' – '+hm(o.gulika[1])+'</td><td>Not for things you want repeated</td></tr>'+
  '<tr><td>Yamaganda</td><td class="w3-n">'+hm(o.yama[0])+' – '+hm(o.yama[1])+'</td><td>Avoid starting new work</td></tr>'+
  '<tr><td>Abhijit muhurat</td><td class="w3-n">'+hm(o.abhijit[0])+' – '+hm(o.abhijit[1])+'</td><td>Considered favourable</td></tr></tbody></table></div>';
 h+=chog(o.day,now,'Day Choghadiya (sunrise to sunset)')+chog(o.night,now,'Night Choghadiya (sunset to next sunrise)');
 h+='<p class="acts noprint"><button class="btn sm" type="button" data-copy="'+txt.replace(/"/g,'&quot;')+'">Copy</button> <button class="btn ghost sm" type="button" data-wa="'+txt.replace(/"/g,'&quot;')+'">Share on WhatsApp</button></p>';
 return h};
function run(){var box=$('#rk-form');if(!box)return;
 var q=$('#rk-q'),list=$('#rk-list'),dt=$('#rk-date'),out=$('#rk-out'),cur=null,C=[],fx=box.getAttribute('data-city');if(fx){try{cur=JSON.parse(fx)}catch(e){}}
 function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
 function calc(){if(!cur){out.innerHTML='<p class="w3-empty">Choose a city or use your location.</p>';return}
  var p=(dt.value||'').split('-').map(Number);if(p.length<3||!p[0]){var n=new Date();p=[n.getFullYear(),n.getMonth()+1,n.getDate()]}
  out.innerHTML=RK.render(RK.calc(p[0],p[1],p[2],cur.lat,cur.lon,cur.tz),cur.name,p[0],p[1],p[2],cur.tz)}
 function today(){var n=new Date();dt.value=n.getFullYear()+'-'+('0'+(n.getMonth()+1)).slice(-2)+'-'+('0'+n.getDate()).slice(-2)}
 function pick(c){cur=c;q.value=c.name;list.innerHTML='';try{history.replaceState(null,'','#c='+c.slug)}catch(e){}calc()}
 today();dt.addEventListener('input',calc);dt.addEventListener('change',calc);
 if(fx){calc();return}
 fetch('/rahukaal/data/cities.json').then(function(r){return r.json()}).then(function(j){C=j.c.map(function(a){return {name:a[0],slug:a[1],lat:a[2],lon:a[3],tz:j.z[a[4]],cc:a[5],k:norm(a[0]+' '+a[5])}});
  var m=location.hash.match(/c=([a-z0-9-]+)/);if(m)C.forEach(function(c){if(c.slug===m[1])pick(c)});
  if(!cur){var tzn;try{tzn=Intl.DateTimeFormat().resolvedOptions().timeZone}catch(e){}if(tzn==='Asia/Calcutta'||tzn==='Asia/Kolkata'){C.forEach(function(c){if(c.slug==='delhi')cur=c});if(cur){q.value=cur.name;calc()}}else calc()}});
 q.addEventListener('input',function(){var v=norm(q.value.trim());list.innerHTML='';if(v.length<2)return;var n=0;C.forEach(function(c){if(n<8&&c.k.indexOf(v)>-1){n++;var b=d.createElement('button');b.type='button';b.className='sug';b.textContent=c.name+(c.cc!=='IN'?', '+c.cc:'');b.addEventListener('click',function(){pick(c)});list.appendChild(b)}})});
 $('#rk-loc').addEventListener('click',function(){if(!navigator.geolocation){out.innerHTML='<p class="w3-empty">Your browser cannot share its location.</p>';return}
  navigator.geolocation.getCurrentPosition(function(p){var tz;try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone}catch(e){}cur={name:'Your location',slug:'',cc:'',lat:p.coords.latitude,lon:p.coords.longitude,tz:tz};q.value='Your location';list.innerHTML='';calc()},function(){out.innerHTML='<p class="w3-empty">Location was not shared. Search for your city instead.</p>'})});
 calc()}
if(d.readyState!=='loading')run();else d.addEventListener('DOMContentLoaded',run);
})();
