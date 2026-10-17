// Headless tests for de/it/fr/pt. Every *.supabase.co request is stubbed locally (reads -> demo JSON, writes aborted), realtime disabled.
const puppeteer=require('puppeteer-core');const fs=require('fs');const {build}=require('./data.js');
const BASE='http://127.0.0.1:8790/';
const OUT='/tmp/mlshots/test';fs.mkdirSync(OUT,{recursive:true});
const LANGS=['de','it','fr','pt'];
const FAKE_NOW=Date.parse('2026-10-08T07:30:00Z');
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
function filt(rows,u){if(!Array.isArray(rows))return rows;const skip={select:1,order:1,limit:1,offset:1,on_conflict:1,columns:1};
 for(const [k,v] of u.searchParams){if(skip[k])continue;const m=/^(gte|gt|lte|lt|eq)\.(.*)$/.exec(v);if(!m)continue;
  rows=rows.filter(r=>{if(!(k in r))return true;const x=r[k];if(x==null)return false;const a=String(x),b=m[2];return m[1]==='eq'?a===b:m[1]==='gte'?a>=b:m[1]==='gt'?a>b:m[1]==='lte'?a<=b:a<b;});}
 return rows;}
const net={supabase:0,writes:[],external:new Set()};
async function stub(page,D){
 await page.setRequestInterception(true);
 page.on('request',req=>{const url=req.url();
  if(url.indexOf('supabase.co')>-1){net.supabase++;const m=req.method();
   if(m==='OPTIONS')return req.respond({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'}});
   const isRpc=url.indexOf('/rest/v1/rpc/')>-1;
   if(m!=='GET'&&m!=='HEAD'&&!isRpc){net.writes.push(m+' '+url);return req.abort('blockedbyclient');}
   const u=new URL(url),t=u.pathname.split('/').pop();let d;
   if(!D)d=[];
   else if(u.pathname.indexOf('/auth/v1/user')>-1)d={id:'auth-u1',email:'demo@example.com',aud:'authenticated',role:'authenticated'};
   else if(isRpc)d=(/team_pulse/.test(url))?{today:{},dow_avg:{n:0}}:[];
   else if(t==='liberty_me')d=null;
   else{d=({areas:D.areas,liberty_customers:D.customers,liberty_my_orders:D.orders,liberty_my_visits:D.visits,liberty_my_last_touch:D.last_touch,liberty_reminders:D.reminders})[t];d=d?filt(d.slice(),u):[];}
   if((req.headers()['accept']||'').indexOf('vnd.pgrst.object')>-1)d=Array.isArray(d)?(d[0]||null):d;
   return req.respond({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','content-range':'0-0/*'},body:JSON.stringify(d)});}
  if(!/^http:\/\/127\.0\.0\.1/.test(url)&&!/^data:/.test(url)){net.external.add(new URL(url).host);}
  if(/fonts\.(googleapis|gstatic)\.com|tile|openstreetmap/.test(url))return req.abort();
  req.continue();});}
const HEB=/[֐-׿]/;
function hebLines(t){return [...new Set(t.split('\n').map(s=>s.trim()).filter(s=>HEB.test(s)))];}
(async()=>{
 const browser=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-first-run','--no-default-browser-check','--disable-features=Translate']});
 const res=[];let fail=0;
 // ---------- app, signed in (demo data) ----------
 for(const lang of LANGS){
  const D=build(lang,FAKE_NOW);const errors=[];
  const page=await browser.newPage();
  await page.emulateTimezone('Asia/Jerusalem');
  await page.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await stub(page,D);
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|ERR_BLOCKED|net::/.test(m.text()))errors.push('console: '+m.text());});
  await page.evaluateOnNewDocument((lang,me,origin,FAKE_NOW)=>{
   const off=FAKE_NOW-Date.now(),_D=Date;class FD extends _D{constructor(...a){if(a.length===0)super(_D.now()+off);else super(...a);}static now(){return _D.now()+off;}}
   FD.parse=_D.parse;FD.UTC=_D.UTC;window.Date=FD;
   const _WS=window.WebSocket;window.WebSocket=function(u,p){if(String(u).indexOf('supabase.co')>-1){return {readyState:3,send(){},close(){},addEventListener(){},removeEventListener(){}};}return new _WS(u,p);};
   try{localStorage.setItem('sg-lang',lang);localStorage.setItem('lib_me',JSON.stringify(me));localStorage.setItem('lib_origin',JSON.stringify(origin));
    const sess={access_token:'x.eyJleHAiOjk5OTk5OTk5OTl9.x',token_type:'bearer',expires_in:3600,expires_at:Math.floor(FAKE_NOW/1000)+3600,refresh_token:'r',user:{id:'auth-u1',aud:'authenticated',role:'authenticated',email:'demo@example.com'}};
    localStorage.setItem('sb-ooxdupeihzvbzudibaoi-auth-token',JSON.stringify(sess));}catch(e){}
   try{const fake={register:()=>Promise.reject(new Error('sw disabled')),ready:new Promise(()=>{}),addEventListener(){},controller:null};Object.defineProperty(navigator,'serviceWorker',{get:()=>fake});}catch(e){}
  },lang,D.me,D.origin,FAKE_NOW);
  await page.goto(BASE+'app/',{waitUntil:'networkidle2',timeout:30000}).catch(e=>errors.push('goto '+e.message));
  await new Promise(r=>setTimeout(r,1800));
  const head=await page.evaluate(()=>({lang:document.documentElement.lang,dir:document.documentElement.dir,ver:typeof APP_VERSION!=='undefined'?APP_VERSION:null}));
  const screens=['home','route','customers','catalog','orders','collections','reminders','calendar','reports','wkplan','monthplan','targets','mystats','myorders','visits'];
  const heb={};
  for(const s of screens){
   await page.evaluate(s=>{try{if(s==='reports'){_rpRg=rpRgCalc('d30');}route=s;render();}catch(e){window.__terr=(window.__terr||'')+s+': '+e.message+'\n';}},s);
   await new Promise(r=>setTimeout(r,s==='home'||s==='wkplan'||s==='reports'?1600:700));
   const t=await page.evaluate(()=>document.body.innerText);
   const h=hebLines(t);if(h.length)heb[s]=h;
   if(['home','customers','collections','calendar'].includes(s))await page.screenshot({path:`${OUT}/app-${lang}-${s}.png`});
  }
  // account sheet language picker
  await page.evaluate(()=>{route='home';render();try{openAcct();}catch(e){window.__terr=(window.__terr||'')+'openAcct: '+e.message;}});
  await new Promise(r=>setTimeout(r,700));
  const acct=await page.evaluate(()=>[...document.querySelectorAll('[data-setlang]')].map(b=>b.textContent+(b.classList.contains('on')?'*':'')).join(','));
  const ah=hebLines(await page.evaluate(()=>document.body.innerText));if(ah.length)heb['account']=ah;
  await page.screenshot({path:`${OUT}/app-${lang}-account.png`});
  const terr=await page.evaluate(()=>window.__terr||'');if(terr)errors.push(terr);
  res.push({k:'app '+lang,head,errors,heb,acct});
  if(errors.length||Object.keys(heb).length)fail++;
  await page.close();
 }
 // ---------- app login screen (no session), device language detection ----------
 for(const [loc,want] of [['de-DE','de'],['it-IT','it'],['fr-FR','fr'],['pt-PT','pt'],['pt-BR','pt']]){
  const ctx=await browser.createBrowserContext();const page=await ctx.newPage();const errors=[];
  await page.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true});
  await stub(page,null);page.on('pageerror',e=>errors.push(e.message));
  await page.evaluateOnNewDocument(loc=>{Object.defineProperty(navigator,'languages',{get:()=>[loc]});Object.defineProperty(navigator,'language',{get:()=>loc});
   try{const fake={register:()=>Promise.reject(new Error('sw disabled')),ready:new Promise(()=>{}),addEventListener(){},controller:null};Object.defineProperty(navigator,'serviceWorker',{get:()=>fake});}catch(e){}},loc);
  await page.goto(BASE+'app/',{waitUntil:'networkidle2',timeout:30000});await new Promise(r=>setTimeout(r,1200));
  const r=await page.evaluate(()=>({lang:document.documentElement.lang,dir:document.documentElement.dir,picker:[...document.querySelectorAll('#lnglogin [data-setlang]')].map(b=>b.textContent).join(','),text:document.body.innerText}));
  const h=hebLines(r.text);delete r.text;
  if(loc==='de-DE')await page.screenshot({path:`${OUT}/app-login-de.png`});
  const ok=r.lang===want&&r.dir==='ltr'&&!errors.length&&!h.length;if(!ok)fail++;
  res.push({k:'login '+loc,ok,r,errors,heb:h});
  await ctx.close();
 }
 // ---------- site pages render ----------
 const pages={he:'',en:'en/',ru:'ru/',ar:'ar/',es:'es/',de:'de/',it:'it/',fr:'fr/',pt:'pt/'};
 for(const [l,p] of Object.entries(pages)){
  for(const w of [390,1280]){
   const ctx=await browser.createBrowserContext();const page=await ctx.newPage();const errors=[];
   await page.setViewport({width:w,height:w===390?844:860});
   page.on('pageerror',e=>errors.push(e.message));
   await page.evaluateOnNewDocument(l=>{try{localStorage.setItem('sg-lang',l);}catch(e){}},l);
   await page.goto(BASE+p,{waitUntil:'networkidle2',timeout:30000});await new Promise(r=>setTimeout(r,700));
   const info=await page.evaluate(()=>{const imgs=[...document.querySelectorAll('img')].filter(i=>/webp$/.test(i.getAttribute('src')));imgs.forEach(i=>i.loading='eager');
    return {path:location.pathname,lang:document.documentElement.lang,hreflang:document.querySelectorAll('link[rel=alternate][hreflang]').length,menu:[...document.querySelectorAll('.lng-m a')].map(a=>a.getAttribute('hreflang')).join(','),
     cur:(document.querySelector('.lng-m a[aria-current]')||{}).hreflang,sg:(document.querySelector('a.sgco')||{}).href,sgText:(document.querySelector('a.sgco')||{}).textContent,
     overflowX:document.documentElement.scrollWidth>window.innerWidth,imgs:imgs.map(i=>i.getAttribute('src')).filter((v,i,a)=>a.indexOf(v)===i).join(' ')};});
   await new Promise(r=>setTimeout(r,500));
   const broken=await page.evaluate(()=>[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')));
   let menuFit=null;
   if(w===390){await page.screenshot({path:`${OUT}/site-${l}-${w}-top.png`});
    await page.evaluate(()=>{document.querySelector('details.lng').setAttribute('open','')});await new Promise(r=>setTimeout(r,300));
    menuFit=await page.evaluate(()=>{const r=document.querySelector('.lng-m').getBoundingClientRect();return {l:Math.round(r.left),r:Math.round(r.right),t:Math.round(r.top),b:Math.round(r.bottom),fits:r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight};});
    await page.screenshot({path:`${OUT}/site-${l}-${w}-menu.png`});
    await page.evaluate(()=>{document.querySelector('details.lng').removeAttribute('open');document.querySelector('footer').scrollIntoView({block:'end'})});await new Promise(r=>setTimeout(r,300));
    await page.screenshot({path:`${OUT}/site-${l}-${w}-footer.png`});}
   else await page.screenshot({path:`${OUT}/site-${l}-${w}-top.png`});
   const ok=info.path==='/'+p&&info.lang===l&&info.hreflang===10&&info.menu==='he,en,ru,ar,es,de,it,fr,pt'&&info.cur===l&&!!info.sg&&!info.overflowX&&!broken.length&&!errors.length&&(!menuFit||menuFit.fits);
   if(!ok)fail++;
   res.push({k:'site '+l+' '+w,ok,info,broken,menuFit,errors});
   await ctx.close();
  }}
 // ---------- language redirect (fresh profile, no sg-lang) ----------
 const cases=[['Europe/Berlin','de-DE','/de/'],['Europe/Rome','it-IT','/it/'],['Europe/Paris','fr-FR','/fr/'],['Europe/Lisbon','pt-PT','/pt/'],['America/Sao_Paulo','pt-BR','/pt/'],['Europe/Zurich','de-CH','/de/'],
  ['Europe/London','en-GB','/en/'],['Asia/Jerusalem','en-US','/'],['Asia/Jerusalem','he-IL','/'],['Europe/Madrid','es-ES','/es/'],['Europe/Moscow','ru-RU','/ru/'],['Asia/Tokyo','ja-JP','/en/']];
 for(const [tz,loc,want] of cases){for(const start of ['','en/','fr/']){
  const ctx=await browser.createBrowserContext();const page=await ctx.newPage();
  await page.emulateTimezone(tz);
  await page.evaluateOnNewDocument(loc=>{Object.defineProperty(navigator,'languages',{get:()=>[loc]});Object.defineProperty(navigator,'language',{get:()=>loc});},loc);
  await page.goto(BASE+start,{waitUntil:'networkidle2',timeout:30000});await new Promise(r=>setTimeout(r,500));
  const got=await page.evaluate(()=>location.pathname);const ok=got===want;if(!ok)fail++;
  res.push({k:`redirect ${tz} ${loc} from /${start}`,ok,got,want});
  await ctx.close();}}
 // saved choice wins over device language
 {const ctx=await browser.createBrowserContext();const page=await ctx.newPage();await page.emulateTimezone('Europe/Berlin');
  await page.evaluateOnNewDocument(()=>{Object.defineProperty(navigator,'languages',{get:()=>['de-DE']});try{localStorage.setItem('sg-lang','it')}catch(e){}});
  await page.goto(BASE,{waitUntil:'networkidle2'});await new Promise(r=>setTimeout(r,500));const got=await page.evaluate(()=>location.pathname);const ok=got==='/it/';if(!ok)fail++;res.push({k:'redirect saved sg-lang=it on de device',ok,got});await ctx.close();}
 await browser.close();
 for(const r of res)console.log(JSON.stringify(r));
 console.log('SUPABASE requests stubbed:',net.supabase,'| writes attempted (aborted):',net.writes.length,'| external hosts contacted:',[...net.external].join(' ')||'none');
 console.log('FAILURES:',fail);
})().catch(e=>{console.error('FATAL',e);process.exit(1);});
