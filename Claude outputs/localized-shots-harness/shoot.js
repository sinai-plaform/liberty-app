// Marketing screenshots of the JaSale app with LOCAL DEMO DATA.
// Every *.supabase.co request is intercepted: reads get fake JSON, writes are aborted. Realtime websockets are stubbed out.
const puppeteer=require('puppeteer-core');const fs=require('fs');const {build}=require('./data.js');
const BASE=process.env.BASE||'http://127.0.0.1:8790/app/';
const OUT=process.env.OUT||'/tmp/lshots/raw';fs.mkdirSync(OUT,{recursive:true});
const LANGS=(process.env.LANGS||'en,ru,ar,es').split(',');
const FAKE_NOW=Date.parse('2026-10-08T07:30:00Z'); // Thursday 08/10/2026 10:30 Israel time (same day as the Hebrew originals)
function filt(rows,u){
 if(!Array.isArray(rows))return rows;
 const skip={select:1,order:1,limit:1,offset:1,on_conflict:1,columns:1};
 for(const [k,v] of u.searchParams){if(skip[k])continue;const m=/^(gte|gt|lte|lt|eq)\.(.*)$/.exec(v);if(!m)continue;
  rows=rows.filter(r=>{if(!(k in r))return true;const x=r[k];if(x==null)return false;const a=String(x),b=m[2];
   return m[1]==='eq'?a===b:m[1]==='gte'?a>=b:m[1]==='gt'?a>b:m[1]==='lte'?a<=b:a<b;});}
 return rows;}
function tableData(D,t){
 return ({areas:D.areas,liberty_customers:D.customers,liberty_my_orders:D.orders,liberty_my_visits:D.visits,liberty_my_last_touch:D.last_touch,liberty_reminders:D.reminders})[t];}
(async()=>{
 const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-first-run','--no-default-browser-check','--disable-features=Translate']});
 const writes=[],errors=[];
 for(const lang of LANGS){
  const D=build(lang,FAKE_NOW);
  for(const scr of (process.env.SCREENS||'home,report,week').split(',')){
   const page=await browser.newPage();
   await page.emulateTimezone('Asia/Jerusalem');
   await page.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});
   await page.setRequestInterception(true);
   page.on('request',req=>{const url=req.url();
    if(url.indexOf('supabase.co')>-1){const m=req.method();
     if(m==='OPTIONS')return req.respond({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'}});
     const isRpc=url.indexOf('/rest/v1/rpc/')>-1;
     if(m!=='GET'&&m!=='HEAD'&&!isRpc){writes.push(m+' '+url);return req.abort('blockedbyclient');}
     const u=new URL(url),t=u.pathname.split('/').pop();let d;
     if(u.pathname.indexOf('/auth/v1/user')>-1)d={id:'auth-u1',email:'demo@example.com',aud:'authenticated',role:'authenticated'};
     else if(isRpc)d=(/team_pulse/.test(url))?{today:{},dow_avg:{n:0}}:[];
     else if(t==='liberty_me')d=null;
     else{d=tableData(D,t);d=d?filt(d.slice(),u):[];}
     if((req.headers()['accept']||'').indexOf('vnd.pgrst.object')>-1)d=Array.isArray(d)?(d[0]||null):d;
     return req.respond({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','content-range':'0-0/*'},body:JSON.stringify(d)});}
    if(/fonts\.(googleapis|gstatic)\.com|tile|openstreetmap/.test(url))return req.abort();
    req.continue();});
   page.on('pageerror',e=>errors.push(lang+' pageerror: '+e.message));
   await page.evaluateOnNewDocument((lang,me,origin,FAKE_NOW)=>{
    const off=FAKE_NOW-Date.now(),_D=Date;
    class FD extends _D{constructor(...a){if(a.length===0)super(_D.now()+off);else super(...a);}static now(){return _D.now()+off;}}
    FD.parse=_D.parse;FD.UTC=_D.UTC;window.Date=FD;
    const _WS=window.WebSocket;window.WebSocket=function(u,p){if(String(u).indexOf('supabase.co')>-1){return {readyState:3,send(){},close(){},addEventListener(){},removeEventListener(){}};}return new _WS(u,p);};
    try{localStorage.setItem('sg-lang',lang);localStorage.setItem('lib_me',JSON.stringify(me));localStorage.setItem('lib_origin',JSON.stringify(origin));
     const sess={access_token:'x.eyJleHAiOjk5OTk5OTk5OTl9.x',token_type:'bearer',expires_in:3600,expires_at:Math.floor(FAKE_NOW/1000)+3600,refresh_token:'r',user:{id:'auth-u1',aud:'authenticated',role:'authenticated',email:'demo@example.com'}};
     localStorage.setItem('sb-ooxdupeihzvbzudibaoi-auth-token',JSON.stringify(sess));}catch(e){}
    try{const fake={register:()=>Promise.reject(new Error('sw disabled')),ready:new Promise(()=>{}),addEventListener(){},controller:null};Object.defineProperty(navigator,'serviceWorker',{get:()=>fake});}catch(e){}
   },lang,D.me,D.origin,FAKE_NOW);
   await page.goto(BASE,{waitUntil:'networkidle2',timeout:30000}).catch(e=>errors.push(lang+' goto '+e.message));
   await new Promise(r=>setTimeout(r,1800));
   await page.evaluate(()=>{try{_fuMap=null;_areaCov=null;loadFollowups(function(){});}catch(e){}});await new Promise(r=>setTimeout(r,800));
   if(scr==='report')await page.evaluate(()=>{_rpRg=rpRgCalc('d30');route='reports';render();});
   if(scr==='week')await page.evaluate(()=>{route='wkplan';render();});
   if(scr==='home')await page.evaluate(()=>{route='home';render();});
   await new Promise(r=>setTimeout(r,2500));
   await page.evaluate(()=>{window.scrollTo(0,0);document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0;});const t=document.querySelector('.toast,#toast');if(t)t.style.display='none';});
   await new Promise(r=>setTimeout(r,400));
   await page.screenshot({path:`${OUT}/${scr}-${lang}.png`});
   await page.close();
  }}
 await browser.close();
 console.log('WRITES attempted (aborted):',writes.length);writes.forEach(w=>console.log('  ',w));
 console.log('ERRORS:',errors.length);[...new Set(errors)].forEach(e=>console.log('  ',e));
})().catch(e=>{console.error('FATAL',e);process.exit(1);});
