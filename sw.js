/* Liberty field-agent PWA service worker */
var V='liberty-v3';
var CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700&family=Heebo:wght@400;500;600;700;800&display=swap'];
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
/* ---- push notifications (reminders when app is closed) ---- */
self.addEventListener('push',function(e){
 var d={title:'🔔 תזכורת',body:'',tag:undefined,url:'./index.html',kind:'general'};
 try{if(e.data)d=Object.assign(d,e.data.json());}catch(err){try{d.body=e.data.text();}catch(e2){}}
 var opts={body:d.body,tag:d.tag,renotify:true,dir:'rtl',lang:'he',icon:'./icon-192.png',badge:'./icon-192.png',data:{url:d.url||'./index.html'},vibrate:d.kind==='collection'?[200,100,200,100,200]:[120,60,120],requireInteraction:d.kind==='collection'};
 e.waitUntil(self.registration.showNotification(d.title||'🔔 תזכורת',opts));
});
self.addEventListener('notificationclick',function(e){
 e.notification.close();
 var target=(e.notification.data&&e.notification.data.url)||'./index.html';
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(cl){
  for(var i=0;i<cl.length;i++){if('focus'in cl[i])return cl[i].focus();}
  if(self.clients.openWindow)return self.clients.openWindow(target);
 }));
});
self.addEventListener('fetch',function(e){
 var req=e.request;
 if(req.method!=='GET')return;
 var url=req.url;
 if(url.indexOf('supabase.co')>-1||url.indexOf('chrome-extension')===0)return;
 if(url.indexOf('vc=')>-1)return; /* auto-update version probe: always hit network */
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
