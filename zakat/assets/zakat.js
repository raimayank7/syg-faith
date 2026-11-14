(function(){var d=document,$=function(i){return d.getElementById(i)};if(!$('z-form'))return;
 function n(i){var v=parseFloat($(i).value);return isNaN(v)||v<0?0:v}
 function f(x){return x.toLocaleString(undefined,{maximumFractionDigits:2})}
 function calc(){var gp=n('z-gp'),sp=n('z-sp'),cur=($('z-cur').value||'').trim();
  var assets=n('z-cash')+n('z-gold')*gp+n('z-silver')*sp+n('z-inv')+n('z-stock')+n('z-recv')+n('z-other'),debts=n('z-debt'),net=Math.max(0,assets-debts);
  var basis=$('z-basis').value,nis=basis==='silver'?612.36*sp:87.48*gp,out=$('z-out'),missing=nis<=0;
  var due=(!missing&&net>=nis)?net*0.025:0;
  out.innerHTML='<div class="zres"><p>Total zakatable assets: <b>'+f(assets)+' '+cur+'</b><br>Less debts due now: <b>'+f(debts)+'</b><br>Net: <b>'+f(net)+'</b></p>'+
   (missing?'<p>Enter the price per gram of '+(basis==='silver'?'silver':'gold')+' to find the nisab.</p>':'<p>Nisab ('+(basis==='silver'?'612.36 g of silver':'87.48 g of gold')+'): <b>'+f(nis)+' '+cur+'</b></p>'+
   (net>=nis?'<p>Your net wealth is at or above the nisab. Zakat at 2.5%: </p><p class="big">'+f(due)+' '+cur+'</p>':'<p>Your net wealth is below the nisab, so by this calculation no zakat is due.</p>'))+'<p class="hint">Only assets you have held for a full lunar year (hawl) count in the usual rule. This is a calculator, not a fatwa.</p></div>'}
 d.querySelectorAll('#z-form input,#z-form select').forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc)});calc()})();