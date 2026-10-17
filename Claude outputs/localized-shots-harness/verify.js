const puppeteer=require('puppeteer-core');const fs=require('fs');
const OUT='/tmp/lshots/verify';fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-first-run']});
 for(const lang of ['he','en','ru','ar','es']){
  for(const w of [1280,390]){
   const page=await browser.newPage();
   await page.setViewport({width:w,height:w===390?844:860,deviceScaleFactor:1});
   await page.evaluateOnNewDocument(l=>{try{localStorage.setItem('sg-lang',l);}catch(e){}},lang);
   const url='http://127.0.0.1:8791/'+(lang==='he'?'':lang+'/');
   await page.goto(url,{waitUntil:'networkidle2',timeout:30000});
   await new Promise(r=>setTimeout(r,800));
   const info=await page.evaluate(()=>({url:location.pathname,lang:document.documentElement.lang,imgs:[...document.querySelectorAll('.phone img')].map(i=>i.getAttribute('src')+' ok='+(i.complete&&i.naturalWidth>0)+' '+i.naturalWidth+'x'+i.naturalHeight)}));
   console.log(lang,w,JSON.stringify(info));
   await page.screenshot({path:`${OUT}/top-${lang}-${w}.png`});
   // scroll to the screenshot section
   await page.evaluate(()=>{const s=document.querySelectorAll('.shot img');s.forEach(i=>i.loading='eager');const e=document.querySelector('.shot');if(e)e.scrollIntoView({block:'start'});});
   await new Promise(r=>setTimeout(r,900));
   await page.screenshot({path:`${OUT}/shots-${lang}-${w}.png`});
   await page.close();
  }}
 await browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1);});
