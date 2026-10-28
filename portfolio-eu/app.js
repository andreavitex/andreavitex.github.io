const $=s=>document.querySelector(s);
const grid=$('#grid'),menu=$('#menu'),detailDialog=$('#project'),lightbox=$('#lightbox');
let filter='All',activeProject=null,activeImages=[],imageIndex=0,originFocus=null;
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=n=>'/portfolio-eu/assets/'+n;
function renderGrid(){let list=projects.filter(p=>filter==='All'||p.category===filter);if($('#sort').value==='az')list.sort((a,b)=>a.title.localeCompare(b.title));grid.innerHTML=list.map(p=>`<a class="card" id="work-${p.id}" href="#project/${p.id}" aria-label="View ${esc(p.title)}"><div class="card-image"><img loading="lazy" src="${asset(p.cover)}" alt="${esc(p.title)} — ${p.mockups.length?'presentation mockup':'selected artwork'}"><span class="card-arrow" aria-hidden="true">↗</span></div><h3>${esc(p.title)}</h3><p class="mono">[ ${esc(p.meta)} ]</p></a>`).join('');const count=innerWidth<=600?(grid.classList.contains('two')?1:2):innerWidth<=900||grid.classList.contains('two')?2:4;const cards=[...grid.children];grid.replaceChildren();const cols=Array.from({length:count},()=>{const c=document.createElement('div');c.className='grid-column';grid.append(c);return c});cards.forEach((card,i)=>{if(i%3===1)card.classList.add('tall');else if(i%4===2)card.classList.add('short');cols[i%count].append(card)});$('#results').textContent=list.length+' projects shown';}
['All','Packaging','Editorial','Prepress','Other'].forEach(label=>{const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-pressed',label===filter);b.onclick=()=>{filter=label;document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderGrid()};$('.filters').append(b)});
$('#sort').onchange=renderGrid;$('#layout').onclick=()=>{const two=grid.classList.toggle('two');$('#layout').setAttribute('aria-label',two?'Switch to four-column grid':'Switch to two-column grid');$('#layout').setAttribute('aria-pressed',two);renderGrid()};
const featured=['camugin','cellini','ginuensis','brugal','garmin','macallan'].map(id=>projects.find(p=>p.id===id));
$('#film').innerHTML=[...featured,...featured].map((p,i)=>`<a href="#project/${p.id}" ${i>=featured.length?'tabindex="-1" aria-hidden="true"':''}><img src="${asset(p.cover)}" alt="${esc(p.title)}"><span class="film-label">${esc(p.title)} <span>↗</span></span></a>`).join('');
function lock(){document.body.classList.toggle('locked',menu.open||detailDialog.open||lightbox.open)}
$('#menu-open').onclick=()=>{menu.showModal();lock()};$('#menu-close').onclick=()=>menu.close();menu.addEventListener('close',lock);menu.querySelectorAll('nav a').forEach(a=>a.onclick=()=>menu.close());
function renderProject(p){activeProject=p;activeImages=[...p.mockups.map(n=>({name:n,label:'Presentation mockup'})),...p.images.map(n=>({name:n,label:p.category==='Other'?'Selected work':'Artwork'}))];$('#detail').innerHTML=`<div class="detail-head"><div><span class="mono">[ ${esc(p.meta)} ]</span><h2 id="project-title">${esc(p.title)}</h2></div>${p.text?`<p>${esc(p.text)}</p>`:''}</div><div class="gallery">${activeImages.map((im,i)=>`<figure><button data-image="${i}" aria-label="Enlarge ${esc(p.title)} ${im.label.toLowerCase()} ${i+1}"><img ${i?'loading="lazy"':''} src="${asset(im.name)}" alt="${esc(p.title)} — ${im.label.toLowerCase()} ${i+1}"></button><figcaption>[ ${String(i+1).padStart(2,'0')} / ${im.label} ]</figcaption></figure>`).join('')}</div>`;$('#detail').querySelectorAll('[data-image]').forEach(b=>b.onclick=()=>{imageIndex=Number(b.dataset.image);renderImage();lightbox.showModal();lock()});detailDialog.scrollTop=0;document.title=p.title+' — Andrea Vitiello';}
function route(){if(location.hash.startsWith('#work/')){filter='All';document.querySelectorAll('.filters button').forEach(b=>b.setAttribute('aria-pressed',b.textContent==='All'));renderGrid();const card=document.getElementById('work-'+location.hash.slice(6));if(card){card.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});card.focus({preventScroll:true})}return}const id=location.hash.startsWith('#project/')?decodeURIComponent(location.hash.slice(9)):null;const p=projects.find(p=>p.id===id);if(p){if(!detailDialog.open){originFocus=document.activeElement;detailDialog.showModal()}renderProject(p);lock()}else{if(lightbox.open)lightbox.close();if(detailDialog.open)detailDialog.close();document.title='Andrea Vitiello — Graphic Designer';lock()}}
function closeProject(){if(lightbox.open)lightbox.close();if(detailDialog.open)detailDialog.close();history.replaceState(null,'','#projects');document.title='Andrea Vitiello — Graphic Designer';lock();if(originFocus&&originFocus!==document.body&&originFocus.isConnected)originFocus.focus({preventScroll:true});else $('#projects').scrollIntoView()}
$('#project-close').onclick=closeProject;$('#back').onclick=e=>{e.preventDefault();closeProject()};detailDialog.addEventListener('cancel',e=>{e.preventDefault();closeProject()});detailDialog.addEventListener('close',lock);
function nextProject(dir){const n=(projects.indexOf(activeProject)+dir+projects.length)%projects.length;location.hash='project/'+projects[n].id}
$('#previous').onclick=()=>nextProject(-1);$('#next').onclick=()=>nextProject(1);
function renderImage(){const im=activeImages[imageIndex];$('#large-image').src=asset(im.name);$('#large-image').alt=activeProject.title+' — '+im.label+' '+(imageIndex+1);$('#image-count').textContent=`${imageIndex+1} / ${activeImages.length}`;$('#image-prev').hidden=$('#image-next').hidden=activeImages.length===1}
function shiftImage(dir){imageIndex=(imageIndex+dir+activeImages.length)%activeImages.length;renderImage()}
$('#image-prev').onclick=()=>shiftImage(-1);$('#image-next').onclick=()=>shiftImage(1);$('#lightbox-close').onclick=()=>lightbox.close();lightbox.addEventListener('close',lock);lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight')shiftImage(1);if(e.key==='ArrowLeft')shiftImage(-1)});let touchX=null;$('#large-image').addEventListener('pointerdown',e=>touchX=e.clientX);$('#large-image').addEventListener('pointerup',e=>{if(touchX!==null&&Math.abs(e.clientX-touchX)>50)shiftImage(e.clientX>touchX?-1:1);touchX=null});
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;function setMotion(){document.body.classList.toggle('paused',paused);$('#motion').textContent=paused?'Resume motion ▷':'Pause motion Ⅱ';$('#motion').setAttribute('aria-pressed',paused)}$('#motion').onclick=()=>{paused=!paused;setMotion()};setMotion();
let frame=false;function animateCards(){frame=false;if(paused)return;const rect=$('#about').getBoundingClientRect();const progress=Math.min(1,Math.max(0,-rect.top/(rect.height-innerHeight)));document.querySelectorAll('.polaroid').forEach((card,i)=>{const y=i===0?0:Math.max(0,1-progress*(i===1?3:1.8))*(i*190);card.style.setProperty('--y',y+'px')})}addEventListener('scroll',()=>{if(!frame){frame=true;requestAnimationFrame(animateCards)}},{passive:true});addEventListener('hashchange',route);renderGrid();route();animateCards();

// Native horizontal scrolling: autoplay and fixed controls on desktop, direct touch scrolling on mobile.
const rail=$('.carousel-scroll'),film=$('#film'),mobile=matchMedia('(max-width:600px)');
let hoverRail=false,manualUntil=0,lastTick=0;
function cycleWidth(){return film.children[6].offsetLeft-film.children[0].offsetLeft}
function shiftRail(dir){manualUntil=performance.now()+5000;const cycle=cycleWidth();if(dir<0&&rail.scrollLeft<2)rail.scrollLeft=cycle;rail.scrollBy({left:dir*(film.children[0].offsetWidth+24)*2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
$('.carousel-prev').onclick=()=>shiftRail(-1);$('.carousel-next').onclick=()=>shiftRail(1);
rail.addEventListener('mouseenter',()=>hoverRail=true);rail.addEventListener('mouseleave',()=>hoverRail=false);
rail.addEventListener('wheel',()=>manualUntil=performance.now()+5000,{passive:true});
rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();shiftRail(e.key==='ArrowRight'?1:-1)}});
function tick(now){const dt=Math.min(now-lastTick,50);lastTick=now;if(!mobile.matches&&!paused&&!hoverRail&&!rail.matches(':focus-within')&&now>manualUntil){const cycle=cycleWidth();rail.scrollLeft+=dt*.035;if(rail.scrollLeft>=cycle)rail.scrollLeft-=cycle}requestAnimationFrame(tick)}requestAnimationFrame(tick);
function railMode(){rail.scrollLeft=0;$('#motion').hidden=mobile.matches}mobile.addEventListener('change',railMode);railMode();

let gridBreakpoint=innerWidth<=600?0:innerWidth<=900?1:2;addEventListener("resize",()=>{const b=innerWidth<=600?0:innerWidth<=900?1:2;if(b!==gridBreakpoint){gridBreakpoint=b;renderGrid()}});

const toolsTrack=document.querySelector('#tools-track');
const toolsViewport=document.querySelector('#tools-viewport');
const toolSlides=[...document.querySelectorAll('.tool-slide')];
const toolsPrev=document.querySelector('.tools-prev');
const toolsNext=document.querySelector('.tools-next');
const toolsCurrent=document.querySelector('#tools-current');
const toolsName=document.querySelector('#tools-name');
let toolIndex=3;
let toolPointerStartX=null;
function updateToolsSlider(){
  if(!toolsTrack||!toolSlides.length)return;
  const spacing=window.innerWidth<=800?112:190;
  toolSlides.forEach((item,index)=>{
    const relative=((index-toolIndex+toolSlides.length+Math.floor(toolSlides.length/2))%toolSlides.length)-Math.floor(toolSlides.length/2);
    const distance=Math.abs(relative);
    item.classList.toggle('active',index===toolIndex);
    item.dataset.position=distance===0?'active':distance===1?'near':distance===2?'mid':'far';
    item.style.setProperty('--tool-offset',relative*spacing+'px');
    item.setAttribute('aria-current',index===toolIndex?'true':'false');
  });
  const active=toolSlides[toolIndex];
  toolsCurrent.textContent=String(toolIndex+1).padStart(2,'0')+' / '+String(toolSlides.length).padStart(2,'0');
  toolsName.textContent=active.dataset.tool;
}
function moveTool(direction){toolIndex=(toolIndex+direction+toolSlides.length)%toolSlides.length;updateToolsSlider()}
if(toolsTrack){
  toolsPrev.addEventListener('click',()=>moveTool(-1));
  toolsNext.addEventListener('click',()=>moveTool(1));
  toolSlides.forEach((slide,index)=>{
    slide.addEventListener('click',()=>{toolIndex=index;updateToolsSlider()});
    slide.addEventListener('focus',()=>{toolIndex=index;updateToolsSlider()});
    slide.addEventListener('keydown',event=>{
      if(event.key==='ArrowLeft'){event.preventDefault();moveTool(-1);toolSlides[toolIndex].focus()}
      if(event.key==='ArrowRight'){event.preventDefault();moveTool(1);toolSlides[toolIndex].focus()}
    });
  });
  toolsViewport.addEventListener('pointerdown',event=>{toolPointerStartX=event.clientX});
  toolsViewport.addEventListener('pointerup',event=>{
    if(toolPointerStartX===null)return;
    const distance=event.clientX-toolPointerStartX;
    if(Math.abs(distance)>28)moveTool(distance>0?-1:1);
    toolPointerStartX=null;
  });
  toolsViewport.addEventListener('pointercancel',()=>{toolPointerStartX=null});
  window.addEventListener('resize',updateToolsSlider);
  updateToolsSlider();
}
