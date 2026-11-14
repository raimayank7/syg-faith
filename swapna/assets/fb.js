(function(){var q=document.getElementById('fq'),o=document.getElementById('fres');if(!q)return;var idx=null;
 function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 q.addEventListener('input',function(){var v=q.value.trim().toLowerCase();if(v.length<2){o.innerHTML='';return}
  function go(){var r=idx.filter(function(x){return x[0].toLowerCase().indexOf(v)>-1||x[1].toLowerCase().indexOf(v)>-1}).slice(0,25);
   o.innerHTML=r.length?r.map(function(x){return '<div class="fb"><b><a href="'+x[3]+'">'+esc(x[0])+'</a></b>'+esc(x[1])+'</div>'}).join(''):'<p class="w3-empty">Nothing found. Try another word.</p>'}
  if(idx)go();else fetch('/swapna/data/items.json').then(function(r){return r.json()}).then(function(j){idx=j;go()})})})();