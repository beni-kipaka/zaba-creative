
const $=s=>document.querySelector(s);
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.documentElement.dataset.theme=localStorage.getItem('zt')||'light';
const H='427858df4a9bac92a9bf2e2ff79dee48213f4e0f338ed213b55a12cb9b01d923';
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
let img='',edit=null;
function show(){const on=sessionStorage.getItem('zadm')==='1';$('#login').hidden=on;$('#app').hidden=!on;if(on)render()}
$('#lf').onsubmit=async e=>{e.preventDefault();const L=get('zlock',{n:0,t:0}),o=$('#le');
  if(Date.now()<L.t){o.textContent='Trop de tentatives. Réessayez dans 5 minutes.';return}
  if(await sha('zaba|'+$('#em').value.trim().toLowerCase()+'|'+$('#pw').value)===H){set('zlock',{n:0,t:0});sessionStorage.setItem('zadm','1');show()}
  else{L.n++;if(L.n>=5){L.t=Date.now()+3e5;L.n=0}set('zlock',L);o.textContent='E-mail ou mot de passe incorrect.'}};
$('#out').onclick=()=>{sessionStorage.removeItem('zadm');show()};
$('#im').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas'),w=Math.min(1000,i.width);c.width=w;c.height=i.height*w/i.width;c.getContext('2d').drawImage(i,0,0,c.width,c.height);img=c.toDataURL('image/jpeg',.8)};i.src=r.result};r.readAsDataURL(f)};
function reset(){edit=null;img='';$('#pf').reset();$('#ft').textContent='Nouvel article'}
$('#rs').onclick=reset;
$('#pf').onsubmit=e=>{e.preventDefault();const ps=get('zaba_posts',[]);
  const p={id:edit||Date.now(),title:$('#t').value.trim(),cat:$('#c').value,excerpt:$('#x').value.trim(),body:$('#b').value.trim(),img:img,date:new Date().toISOString().slice(0,10)};
  const i=ps.findIndex(q=>q.id===edit);if(i>=0){p.img=img||ps[i].img;p.date=ps[i].date;ps[i]=p}else ps.push(p);
  set('zaba_posts',ps);reset();$('#ms').textContent='Article publié sur le site.';render()};
function render(){const ps=get('zaba_posts',[]),ss=get('zaba_subs',[]);
  $('#kp').textContent=ps.length;$('#ks').textContent=ss.length;
  $('#list').innerHTML=ps.map(p=>`<div class="row"><span>${esc(p.title)}<br><small>${esc(p.cat)} · ${esc(p.date)}</small></span><div><button class="btn ghost sm" data-e="${p.id}">Modifier</button><button class="btn ghost sm" data-d="${p.id}">Supprimer</button></div></div>`).join('')||'<p>Aucun article. Rédigez le premier à gauche.</p>';
  $('#subs').innerHTML=ss.map(s=>`<div class="row"><span>${esc(s)}</span></div>`).join('')||'<p>Aucun abonné pour le moment.</p>'}
$('#list').onclick=e=>{const d=e.target.dataset;let ps=get('zaba_posts',[]);
  if(d.d&&confirm('Supprimer cet article ?')){set('zaba_posts',ps.filter(p=>p.id!=d.d));render()}
  if(d.e){const p=ps.find(p=>p.id==d.e);edit=p.id;$('#t').value=p.title;$('#c').value=p.cat;$('#x').value=p.excerpt;$('#b').value=p.body;$('#ft').textContent='Modifier l’article';scrollTo({top:0,behavior:'smooth'})}};
$('#csv').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['email\n'+get('zaba_subs',[]).join('\n')],{type:'text/csv'}));a.download='abonnes-zaba.csv';a.click()};
show();
