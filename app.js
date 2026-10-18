const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const WA='243824775595',MAIL='benikipaka243@gmail.com';
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Thème clair / sombre
const root=document.documentElement;
root.dataset.theme=localStorage.getItem('zt')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
$('#theme').onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;localStorage.setItem('zt',t)};

// Navigation
const nav=$('#nav');
const onScroll=()=>nav.classList.toggle('on',scrollY>40);onScroll();addEventListener('scroll',onScroll,{passive:true});
$('#burger').onclick=()=>$('#menu').classList.toggle('open');
$$('#menu a').forEach(a=>a.onclick=()=>$('#menu').classList.remove('open'));
$('#yr').textContent=new Date().getFullYear();

// Apparitions et compteurs
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target)}),{threshold:.15});
const revealAll=()=>$$('.rv:not(.in)').forEach(el=>io.observe(el));revealAll();
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);
  const n=+e.target.dataset.n,t0=performance.now();
  const f=t=>{const p=Math.min((t-t0)/1400,1);e.target.textContent=Math.round(n*(1-Math.pow(1-p,3)));p<1&&requestAnimationFrame(f)};requestAnimationFrame(f)}));
$$('[data-n]').forEach(el=>cio.observe(el));

// Articles (publiés depuis le dashboard)
const seed=[
 {id:1,cat:'Brand design',title:'Pourquoi un logo ne suffit pas à faire une marque',excerpt:'Une identité visuelle cohérente se construit sur un système, pas sur un seul symbole.',body:'Couleurs, typographies, ton de voix et supports : c’est l’ensemble qui rend votre marque reconnaissable partout.',img:'',date:'2026-10-01'},
 {id:2,cat:'Marketing digital',title:'5 visuels qui font vraiment vendre sur les réseaux',excerpt:'Les formats qui captent l’attention dans les trois premières secondes.',body:'Contraste fort, message unique, appel à l’action clair : testez, mesurez, puis répétez ce qui marche.',img:'',date:'2026-10-08'}];
const posts=get('zaba_posts',null)||(set('zaba_posts',seed),seed);
$('#posts').innerHTML=[...posts].sort((a,b)=>b.date.localeCompare(a.date)).map(p=>`<article class="post rv">${p.img?`<img src="${esc(p.img)}" alt="" loading="lazy">`:'<div class="ph" style="padding:0"></div>'}<div><small>${esc(p.cat)} · ${esc(p.date)}</small><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><span class="body">${esc(p.body)}</span><button type="button" data-id="${p.id}">Lire l’article</button></div></article>`).join('')||'<p>Les premiers articles arrivent bientôt.</p>';
const md=$('#modal'),close=()=>{md.classList.remove('on');document.body.classList.remove('lock')};
$$('.post button').forEach(b=>b.onclick=()=>{const p=posts.find(q=>q.id==b.dataset.id);if(!p)return;
  $('#mbox').innerHTML=`<button class="mx" aria-label="Fermer">×</button>${p.img?`<img src="${esc(p.img)}" alt="">`:'<div class="ph"></div>'}<article><small>${esc(p.cat)} · ${esc(p.date)}</small><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></article>`;
  $('.mx').onclick=close;md.classList.add('on');document.body.classList.add('lock');$('.mx').focus()});
md.onclick=e=>{if(e.target===md)close()};addEventListener('keydown',e=>{if(e.key==='Escape')close()});
revealAll();

// Commande
let via='wa';$$('#order [data-via]').forEach(b=>b.onclick=()=>via=b.dataset.via);
$$('[data-service]').forEach(a=>a.addEventListener('click',()=>$('#order [name=service]').value=a.dataset.service));
$('#order').onsubmit=e=>{e.preventDefault();const f=e.target,n=f.nom.value.trim(),m=f.msg.value.trim();
  if(!n||!m){$('#oerr').textContent='Renseignez votre nom et décrivez votre projet.';return}
  $('#oerr').textContent='';
  const txt=`Bonjour Zaba Créative, je suis ${n}.\nService : ${f.service.value}\nProjet : ${m}`;
  via==='wa'?open(`https://wa.me/${WA}?text=${encodeURIComponent(txt)}`,'_blank'):location.href=`mailto:${MAIL}?subject=${encodeURIComponent('Commande : '+f.service.value)}&body=${encodeURIComponent(txt)}`;
  $('#oerr').style.color='var(--tx)';$('#oerr').textContent='Demande prête à être envoyée. Merci !'};

// Newsletter
$('#news').onsubmit=e=>{e.preventDefault();const em=e.target.email.value.trim().toLowerCase(),o=$('#nerr');
  if(!/^\S+@\S+\.\S+$/.test(em)){o.textContent='Saisissez une adresse e-mail valide.';return}
  const s=get('zaba_subs',[]);if(!s.includes(em)){s.push(em);set('zaba_subs',s)}
  o.textContent='Inscription confirmée. À bientôt !';e.target.reset()};

// Partage
const u=encodeURIComponent(location.href),t=encodeURIComponent(document.title);
const links={fb:`https://www.facebook.com/sharer/sharer.php?u=${u}`,x:`https://twitter.com/intent/tweet?url=${u}&text=${t}`,in:`https://www.linkedin.com/sharing/share-offsite/?url=${u}`,wa:`https://wa.me/?text=${t}%20${u}`};
$$('.share [data-s]').forEach(el=>{const k=el.dataset.s;
  if(k==='cp')el.onclick=async()=>{try{await navigator.clipboard.writeText(location.href);el.textContent='Lien copié'}catch{prompt('Copiez le lien',location.href)}};
  else{el.href=links[k];el.target='_blank';el.rel='noopener'}});

// Effets : progression, projecteur sur cartes, parallaxe du hero
const pg=$('#pg');addEventListener('scroll',()=>{pg.style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%'},{passive:true});
$$('.card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}));
