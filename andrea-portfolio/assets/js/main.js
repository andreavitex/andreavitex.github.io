const base='andrea-portfolio/';
const projects={
camugin:{title:'Camügin',meta:'Product / Campaign · Visual direction',images:['camugin-1.jpg','camugin-2.jpg'],text:'Product communication developed from visual direction to final applications.'},
cellini:{title:'Cellini Caffè',meta:'Editorial / Retail · Visual system',images:['cellini-1.jpg','cellini-2.jpg'],text:'Editorial and product communication for a contemporary Italian roastery.'},
brugal:{title:'Brugal 1888',meta:'Editorial / Brand · Premium communication',images:['brugal-1.jpg','brugal-2.jpg','brugal-3.jpg','brugal-4.jpg'],text:'A premium editorial system built around image, typography and brand expression.'},
garmin:{title:'Garmin',meta:'Digital / Product · Wellness communication',images:['garmin-1-cropped.jpg','garmin-2-cropped.jpg'],text:'Digital product communication within the Garmin wellness ecosystem.'},
macallan:{title:'The Macallan · Spirit',meta:'Event / Editorial · Visual storytelling',images:['macallan-1.jpg','macallan-2.jpg'],text:'Premium event communication combining editorial composition and visual storytelling.'},
ginuensis:{title:'Gin Ginuensis',meta:'Packaging · Brand expression',images:['ginuensis-1.jpg','ginuensis-2-back-label.jpg'],text:'Packaging and local brand expression focused on a distinctive visual presence.'}
};
const otherProjects=[
  {title:'Degré Cosmetica',image:'other-degre.webp'},
  {title:'Riunione FjordiSalmone',image:'other-fjordi-salmone.jpg'},
  {title:'Bubbles Restaurant MSC',image:'other-plaque-bubbles.png'},
  {title:'Les Dunes Restaurant MSC',image:'other-plaque-les-dunes.png'},
  {title:'La Foglia Restaurant MSC',image:'other-plaque-la-foglia.png'},
  {title:'ONU Global Coalition Website',image:'other-web-global-coalition-proposal.jpg'},
  {title:'Politi Odontoiatra Landing Page',image:'other-web-politi-proposal.jpg'},
  {title:'Altec Landing Page',image:'other-web-altec-proposal.jpg'}
];
const mockupProjects={
  camugin:{title:'Camügin — Mockup',meta:'PRODOTTO / CAMPAGNA',images:['camugin-mockup-bar.png','camugin-mockup-liguria.png','camugin-mockup-minimal.png']},
  cellini:{title:'Cellini Caffè — Mockup',meta:'EDITORIALE / RETAIL',images:['cellini-mockup-open.png','cellini-mockup-spread.png','cellini-mockup-closed.png']},
  brugal:{title:'Brugal 1888 — Mockup',meta:'EDITORIALE / BRAND',images:['brugal-mockup-exterior.png','brugal-mockup-interior.png','brugal-mockup-cover.png']},
  garmin:{title:'Garmin — Mockup',meta:'DIGITALE / PRODOTTO',images:['garmin-mockup-interior.png','garmin-mockup-exterior.png']},
  ginuensis:{title:'Gin Ginuensis — Mockup',meta:'PACKAGING',images:['ginuensis-mockup-coast.png','ginuensis-mockup-bar.png','ginuensis-mockup-minimal.png']}
};
const modal=document.querySelector('.modal'),image=document.querySelector('#modal-image'),stage=document.querySelector('#modal-image-stage'),title=document.querySelector('.modal-title'),kicker=document.querySelector('#modal-kicker'),counter=document.querySelector('#modal-counter'),prev=document.querySelector('#modal-prev'),next=document.querySelector('#modal-next');
let currentProject=null,currentImage=0,pointerStartX=null;
function renderImage(){
  if(!currentProject)return;
  const src=currentProject.images[currentImage];
  image.src=base+'assets/images/'+src;
  const imageTitle=currentProject.titles?.[currentImage]||currentProject.title;
  title.textContent=imageTitle;
  image.alt=imageTitle+' — immagine '+(currentImage+1);
  counter.textContent=String(currentImage+1).padStart(2,'0')+' / '+String(currentProject.images.length).padStart(2,'0');
  const multiple=currentProject.images.length>1;
  prev.hidden=!multiple; next.hidden=!multiple;
}
function openProject(key){
  const p=projects[key];
  if(!p)return;
  currentProject=p;currentImage=0;
  kicker.textContent=p.meta;
  renderImage();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function openOtherProject(index){
  if(!otherProjects[index])return;
  currentProject={title:'Altri progetti',meta:'07 · SELEZIONE',titles:otherProjects.map(project=>project.title),images:otherProjects.map(project=>project.image)};
  currentImage=index;
  kicker.textContent=currentProject.meta;
  renderImage();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function openMockupProject(key,index){
  const p=mockupProjects[key];
  if(!p)return;
  currentProject=p;currentImage=index;
  kicker.textContent=p.meta;
  renderImage();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function close(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  image.src='';
  currentProject=null;
}
function moveImage(direction){
  if(!currentProject||currentProject.images.length<2)return;
  currentImage=(currentImage+direction+currentProject.images.length)%currentProject.images.length;
  renderImage();
}
document.querySelectorAll('.card').forEach(card=>card.addEventListener('click',()=>openProject(card.dataset.project)));
document.querySelectorAll('[data-other-project]').forEach(card=>{
  card.addEventListener('click',()=>openOtherProject(Number(card.dataset.otherProject)));
  card.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();openOtherProject(Number(card.dataset.otherProject));}
  });
});
const mockupKeys=['camugin','cellini','brugal','garmin','ginuensis'];
document.querySelectorAll('.project-mockup').forEach((section,sectionIndex)=>{
  const key=mockupKeys[sectionIndex];
  section.querySelectorAll('img').forEach((mockup,index)=>{
    mockup.tabIndex=0;
    mockup.setAttribute('role','button');
    mockup.setAttribute('aria-label','Apri mockup '+(index+1)+' di '+mockupProjects[key].title);
    mockup.addEventListener('click',()=>openMockupProject(key,index));
    mockup.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();openMockupProject(key,index);}
    });
  });
});
document.querySelector('#modal-close').addEventListener('click',close);
prev.addEventListener('click',event=>{event.stopPropagation();moveImage(-1)});
next.addEventListener('click',event=>{event.stopPropagation();moveImage(1)});
stage.addEventListener('click',close);
stage.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();close()}});
modal.addEventListener('click',event=>{if(event.target===modal)close()});
document.addEventListener('keydown',event=>{
  if(!modal.classList.contains('open'))return;
  if(event.key==='Escape')close();
  if(event.key==='ArrowLeft')moveImage(-1);
  if(event.key==='ArrowRight')moveImage(1);
});
stage.addEventListener('pointerdown',event=>{pointerStartX=event.clientX});
stage.addEventListener('pointerup',event=>{
  if(pointerStartX===null)return;
  const distance=event.clientX-pointerStartX;
  if(Math.abs(distance)>35)moveImage(distance>0?-1:1);
  pointerStartX=null;
});
stage.addEventListener('pointercancel',()=>{pointerStartX=null});
document.querySelector('.menu').addEventListener('click',()=>document.querySelector('.nav').classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav').classList.remove('open')));

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
