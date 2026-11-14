(function(){
 var d=document,q=d.getElementById('gq');
 function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 if(q){var out=d.getElementById('gres'),idx=null;
  q.addEventListener('input',function(){var v=q.value.trim().toLowerCase();if(v.length<2){out.innerHTML='';return}
   function go(){var r=[];idx.forEach(function(x){if(x[2].toLowerCase().indexOf(v)>-1||x[3].toLowerCase().indexOf(v)>-1||x[0].replace('.',' ')===v||x[0]===v)r.push(x)});
    out.innerHTML=r.length?'<ul class="grid">'+r.slice(0,30).map(function(x){return '<li><a href="/gita/chapter/'+x[0].split('.')[0]+'/#v'+x[0].split('.')[1]+'">'+x[0]+' <small>'+esc(x[3].split(' | ')[0])+'</small></a></li>'}).join('')+'</ul>':'<p class="w3-empty">No verse found. Try a Sanskrit word in Roman letters, such as dharma, karma or yoga, or a number like 2.47.</p>'}
   if(idx)go();else fetch('/gita/data/verses.json').then(function(r){return r.json()}).then(function(j){idx=j;go()})})}
 var t=d.getElementById('gday');if(t){fetch('/gita/data/verses.json').then(function(r){return r.json()}).then(function(j){var n=new Date(),k=Math.floor(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())/864e5)%j.length,x=j[k],c=x[0].split('.');
  t.innerHTML='<div class="vs"><div class="ref"><a href="/gita/chapter/'+c[0]+'/#v'+c[1]+'">Chapter '+c[0]+', verse '+c[1]+'</a></div><p class="sa" lang="sa">'+esc(x[2].split(' | ').join('\n')).replace(/\n/g,'<br>')+'</p><p class="rm">'+esc(x[3].split(' | ').join(' / '))+'</p></div>'})}
 if(location.hash&&/^#v\d+$/.test(location.hash)){var e=d.querySelector(location.hash);if(e)e.classList.add('hit')}
})();