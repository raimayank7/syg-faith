(function(){'use strict';
var d=document,$=function(s){return d.querySelector(s)},R=Math.PI/180,PT=window.PT={};
var M={"mwl": ["Muslim World League", 18.0, ["a", 17.0]], "karachi": ["University of Islamic Sciences, Karachi", 18.0, ["a", 18.0]], "isna": ["Islamic Society of North America", 15.0, ["a", 15.0]], "egypt": ["Egyptian General Authority of Survey", 19.5, ["a", 17.5]], "makkah": ["Umm al-Qura, Makkah", 18.5, ["m", 90]]};
PT.methods=M;
function eq(jc){var L0=(280.46646+jc*(36000.76983+jc*0.0003032))%360,Mm=357.52911+jc*(35999.05029-0.0001537*jc),e=0.016708634-jc*(0.000042037+0.0000001267*jc),mr=Mm*R;
 var C=Math.sin(mr)*(1.914602-jc*(0.004817+0.000014*jc))+Math.sin(2*mr)*(0.019993-0.000101*jc)+Math.sin(3*mr)*0.000289,tr=L0+C,om=125.04-1934.136*jc,ap=tr-0.00569-0.00478*Math.sin(om*R);
 var e0=23+(26+(21.448-jc*(46.815+jc*(0.00059-jc*0.001813)))/60)/60,ep=e0+0.00256*Math.cos(om*R);
 var decl=Math.asin(Math.sin(ep*R)*Math.sin(ap*R))/R,y=Math.pow(Math.tan(ep*R/2),2),L0r=L0*R;
 var et=4*(y*Math.sin(2*L0r)-2*e*Math.sin(mr)+4*e*y*Math.sin(mr)*Math.cos(2*L0r)-0.5*y*y*Math.sin(4*L0r)-1.25*e*e*Math.sin(2*mr))/R;return [et,decl]}
function ha(lat,decl,alt){var c=(Math.sin(alt*R)-Math.sin(lat*R)*Math.sin(decl*R))/(Math.cos(lat*R)*Math.cos(decl*R));if(c>1||c<-1)return null;return Math.acos(c)/R*4}
function ord(y,m,dd){return Date.UTC(y,m-1,dd)/864e5+719163}
function offset(tz,y,m,dd){try{var s=new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'longOffset'}).formatToParts(new Date(Date.UTC(y,m-1,dd,12))).filter(function(p){return p.type==='timeZoneName'})[0].value;
 var q=s.match(/GMT([+−-])(\d\d):?(\d\d)?/);if(!q)return s==='GMT'?0:null;return (q[1]==='+'?1:-1)*(+q[2]*60+(+q[3]||0))}catch(e){return null}}
PT.offset=offset;
PT.calc=function(y,m,dd,lat,lon,tz,method,hanafi){
 var off=tz?offset(tz,y,m,dd):null;if(off===null)off=Math.round(lon/15)*60;
 var jd=ord(y,m,dd)+1721424.5,noon=720-4*lon,r,i;
 for(i=0;i<2;i++){r=eq((jd+noon/1440-2451545)/36525);noon=720-4*lon-r[0]}
 r=eq((jd+noon/1440-2451545)/36525);var decl=r[1],me=M[method],fa=me[1],ik=me[2][0],iv=me[2][1],o={dhuhr:noon+off,hi:[],off:off};
 var hs=ha(lat,decl,-0.833);
 if(hs===null){o.none=true;return o}
 var rise=noon-hs,set=noon+hs;o.sunrise=rise+off;o.maghrib=set+off;
 var sh=(hanafi?2:1)+Math.tan(Math.abs(lat-decl)*R),alt=Math.atan(1/sh)/R,h2=ha(lat,decl,alt);o.asr=h2===null?null:noon+h2+off;
 var night=1440-(set-rise),hf=ha(lat,decl,-fa),fajr=hf===null?null:noon-hf,lim=rise-night*fa/60;
 if(fajr===null||fajr<lim){fajr=lim;o.hi.push('fajr limited')}o.fajr=fajr+off;
 var isha;if(ik==='m')isha=set+iv;else{var hi=ha(lat,decl,-iv);isha=hi===null?null:noon+hi;var lim2=set+night*iv/60;if(isha===null||isha>lim2){isha=lim2;o.hi.push('isha limited')}}
 o.isha=isha+off;return o};
function hm(m){if(m===null||m===undefined||isNaN(m))return '—';var x=Math.round(m)%1440;if(x<0)x+=1440;return ('0'+Math.floor(x/60)).slice(-2)+':'+('0'+x%60).slice(-2)}
function hm12(m){if(m===null||isNaN(m))return '—';var x=Math.round(m)%1440;if(x<0)x+=1440;var h=Math.floor(x/60),mi=x%60;return (h%12||12)+':'+('0'+mi).slice(-2)+(h<12?' am':' pm')}
PT.hm=hm;
var NAMES=[['fajr','Fajr'],['sunrise','Sunrise'],['dhuhr','Dhuhr'],['asr','Asr'],['maghrib','Maghrib'],['isha','Isha']];
function nowIn(tz,y,m,dd){try{var p=new Intl.DateTimeFormat('en-GB',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()),g={};p.forEach(function(q){g[q.type]=+q.value});if(g.year===y&&g.month===m&&g.day===dd)return g.hour*60+g.minute}catch(e){}return null}
PT.render=function(o,name,y,m,dd,tz,mkey,hanafi){
 if(o.none)return '<p class="w3-empty">The sun does not rise or set normally at this place on this date, so prayer times cannot be worked out here. Follow the timetable of your local mosque.</p>';
 var now=tz?nowIn(tz,y,m,dd):null,next=null,i;
 if(now!==null){for(i=0;i<NAMES.length;i++){if(NAMES[i][0]!=='sunrise'&&o[NAMES[i][0]]!==null&&o[NAMES[i][0]]>now){next=NAMES[i][0];break}}}
 var rows=NAMES.map(function(n){var on=n[0]===next;return '<tr'+(on?' class="now"':'')+'><td>'+n[1]+(on?' <b>(next)</b>':'')+'</td><td class="w3-n">'+hm(o[n[0]])+'</td><td class="w3-n">'+hm12(o[n[0]])+'</td></tr>'}).join('');
 var txt=name+' '+dd+'/'+m+'/'+y+' ('+M[mkey][0]+'): Fajr '+hm(o.fajr)+', Dhuhr '+hm(o.dhuhr)+', Asr '+hm(o.asr)+', Maghrib '+hm(o.maghrib)+', Isha '+hm(o.isha)+'. (shareyourgroup.com)';
 var h='<h2>'+name+', '+dd+'/'+m+'/'+y+'</h2><div class="tbl"><table class="w3"><thead><tr><th>Prayer<th class="w3-n">24 hour<th class="w3-n">12 hour</thead><tbody>'+rows+'</tbody></table></div>';
 h+='<p class="hint">Method: '+M[mkey][0]+'; Asr by '+(hanafi?'the Hanafi rule (shadow twice the object)':'the standard rule (shadow equal to the object)')+'. Local time.'+(o.hi.length?' At this latitude the sky never gets dark enough in this season, so Fajr and Isha use the share-of-the-night rule: '+o.hi.join(', ')+'.':'')+' Times are calculated; for fixed times follow your local mosque.</p>';
 h+='<p class="acts noprint"><button class="btn sm" type="button" data-copy="'+txt.replace(/"/g,'&quot;')+'">Copy</button> <button class="btn ghost sm" type="button" data-wa="'+txt.replace(/"/g,'&quot;')+'">Share on WhatsApp</button> <button class="btn ghost sm" type="button" id="pt-month">Show the whole month</button></p><div id="pt-mt"></div>';
 return h};
PT.month=function(y,m,lat,lon,tz,mkey,hanafi,name){
 var n=new Date(Date.UTC(y,m,0)).getUTCDate(),rows='',dd;
 for(dd=1;dd<=n;dd++){var o=PT.calc(y,m,dd,lat,lon,tz,mkey,hanafi),wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(Date.UTC(y,m-1,dd)).getUTCDay()];
  rows+=o.none?'<tr><td>'+dd+' '+wd+'<td colspan="6">no normal sunrise</tr>':'<tr'+(wd==='Fri'?' class="fri"':'')+'><td>'+dd+' '+wd+'<td class="w3-n">'+hm(o.fajr)+'<td class="w3-n">'+hm(o.sunrise)+'<td class="w3-n">'+hm(o.dhuhr)+'<td class="w3-n">'+hm(o.asr)+'<td class="w3-n">'+hm(o.maghrib)+'<td class="w3-n">'+hm(o.isha)+'</tr>'}
 return '<h2>'+name+': '+['','January','February','March','April','May','June','July','August','September','October','November','December'][m]+' '+y+'</h2><div class="tbl"><table class="w3"><thead><tr><th>Day<th class="w3-n">Fajr<th class="w3-n">Sunrise<th class="w3-n">Dhuhr<th class="w3-n">Asr<th class="w3-n">Maghrib<th class="w3-n">Isha</thead><tbody>'+rows+'</tbody></table></div><p class="acts noprint"><button class="btn ghost sm" type="button" onclick="window.print()">Print this month</button></p>'};
function run(){var box=$('#pt-form');if(!box)return;
 var q=$('#pt-q'),list=$('#pt-list'),dt=$('#pt-date'),out=$('#pt-out'),ms=$('#pt-method'),as=$('#pt-asr'),cur=null,C=[],fx=box.getAttribute('data-city');if(fx){try{cur=JSON.parse(fx)}catch(e){}}
 function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
 function defaults(cc){var r={IN:['karachi',1],PK:['karachi',1],BD:['karachi',1],NP:['karachi',1],LK:['karachi',0],US:['isna',0],CA:['isna',0],SA:['makkah',0],AE:['makkah',0],QA:['makkah',0],KW:['makkah',0],BH:['makkah',0],OM:['makkah',0],EG:['egypt',0]}[cc];return r||['mwl',0]}
 function setDef(){if(!cur)return;var r=defaults(cur.cc);ms.value=r[0];as.value=r[1]}
 var drawn=false;
 function calc(){if(!cur){out.innerHTML='<p class="w3-empty">Choose a city or use your location.</p>';return}
  var p=(dt.value||'').split('-').map(Number);if(p.length<3||!p[0]){var n=new Date();p=[n.getFullYear(),n.getMonth()+1,n.getDate()]}
  out.innerHTML=PT.render(PT.calc(p[0],p[1],p[2],cur.lat,cur.lon,cur.tz,ms.value,as.value==='1'),cur.name,p[0],p[1],p[2],cur.tz,ms.value,as.value==='1');
  var b=$('#pt-month');if(b)b.addEventListener('click',function(){$('#pt-mt').innerHTML=PT.month(p[0],p[1],cur.lat,cur.lon,cur.tz,ms.value,as.value==='1',cur.name);b.hidden=true})}
 var n0=new Date();dt.value=n0.getFullYear()+'-'+('0'+(n0.getMonth()+1)).slice(-2)+'-'+('0'+n0.getDate()).slice(-2);
 [dt,ms,as].forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc)});
 function pick(c){cur=c;q.value=c.name;list.innerHTML='';setDef();try{history.replaceState(null,'','#c='+c.slug)}catch(e){}calc()}
 if(fx){setDef();calc();return}
 fetch('/ramadan/data/cities.json').then(function(r){return r.json()}).then(function(j){C=j.c.map(function(a){return {name:a[0],slug:a[1],lat:a[2],lon:a[3],tz:j.z[a[4]],cc:a[5],k:norm(a[0]+' '+a[5])}});
  var m=location.hash.match(/c=([a-z0-9-]+)/);if(m)C.forEach(function(c){if(c.slug===m[1])pick(c)});
  if(!cur){var tzn;try{tzn=Intl.DateTimeFormat().resolvedOptions().timeZone}catch(e){}if(tzn==='Asia/Calcutta'||tzn==='Asia/Kolkata'){C.forEach(function(c){if(c.slug==='delhi')cur=c});if(cur){q.value=cur.name;setDef();calc()}}else calc()}});
 q.addEventListener('input',function(){var v=norm(q.value.trim());list.innerHTML='';if(v.length<2)return;var n=0;C.forEach(function(c){if(n<8&&c.k.indexOf(v)>-1){n++;var b=d.createElement('button');b.type='button';b.className='sug';b.textContent=c.name+(c.cc!=='IN'?', '+c.cc:'');b.addEventListener('click',function(){pick(c)});list.appendChild(b)}})});
 $('#pt-loc').addEventListener('click',function(){if(!navigator.geolocation){out.innerHTML='<p class="w3-empty">Your browser cannot share its location.</p>';return}
  navigator.geolocation.getCurrentPosition(function(p){var tz;try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone}catch(e){}cur={name:'Your location',slug:'',cc:'',lat:p.coords.latitude,lon:p.coords.longitude,tz:tz};q.value='Your location';list.innerHTML='';calc()},function(){out.innerHTML='<p class="w3-empty">Location was not shared. Search for your city instead.</p>'})});
 calc()}
if(d.readyState!=='loading')run();else d.addEventListener('DOMContentLoaded',run);
})();
