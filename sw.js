/* Liberty field-agent PWA service worker */
var V='liberty-v1';
var CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
 'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap'];
self.addEventListener('install',function(e){
 e.waitUntil(caches.open(V).then(function(c){
  return Promise.all(CORE.map(function(u){return c.add(new Request(u,{cache:'reload'})).catch(function(){})}));
 }).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
 e.waitUntil(caches.keys().then(function(ks){
  return Promise.all(ks.map(function(k){if(k!==V)return caches.delete(k)}));
 }).then(function(){return self.clients.claim()}));
});
self.addEventListener('message',function(e){if(e.data==='skipWaiting')self.skipWaiting()});
self.addEventListener('fetch',function(e){
 var req=e.request;
 if(req.method!=='GET')return;
 var url=req.url;
 if(url.indexOf('supabase.co')>-1||url.indexOf('chrome-extension')===0)return;
 if(req.mode==='navigate'){
  e.respondWith(fetch(req).then(function(r){
   if(r&&r.status===200){var cp=r.clone();caches.open(V).then(function(c){c.put('./index.html',cp)})}
   return r;
  }).catch(function(){
   return caches.match('./index.html').then(function(m){return m||caches.match('./')||new Response('אין חיבור',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})});
  }));
  return;
 }
 e.respondWith(caches.match(req).then(function(m){
  var net=fetch(req).then(function(r){
   if(r&&(r.status===200||r.type==='opaque')){var cp=r.clone();caches.open(V).then(function(c){c.put(req,cp)})}
   return r;
  }).catch(function(){return m});
  return m||net;
 }));
});
