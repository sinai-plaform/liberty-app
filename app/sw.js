/* JaSale field-agent PWA service worker */
var V='jasale-v8';
var SB_URL='https://ooxdupeihzvbzudibaoi.supabase.co',SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9veGR1cGVpaHp2Ynp1ZGliYW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTk2ODUsImV4cCI6MjA5MjUzNTY4NX0.-phHZwltk41dIJM6tal9B7t2WZVLrAXLV6is4djN9_A';
var CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon-32.png','./jasale-icon.svg',
 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700&family=Heebo:wght@400;500;600;700;800&family=Outfit:wght@400;700&display=swap'];
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
 var urgent=d.kind==='collection'||d.kind==='meeting_start'||d.kind==='meeting';
 var opts={body:d.body,tag:d.tag,renotify:true,dir:'rtl',lang:'he',icon:'./icon-192.png',badge:'./icon-192.png',
  data:{url:d.url||'./index.html',kind:d.kind,id:d.id,tok:d.tok,cid:d.cid,cname:d.cname,lat:d.lat,lng:d.lng,phone:d.phone},
  vibrate:urgent?[200,100,200,100,200]:[120,60,120],requireInteraction:urgent,actions:(d.actions||[]).slice(0,4)};
 e.waitUntil(self.registration.showNotification(d.title||'🔔 תזכורת',opts));
});
/* v86: quick actions — done/snooze run in place (signed per reminder); others open the right screen */
function rpcAction(id,tok,act,mins){
 return fetch(SB_URL+'/rest/v1/rpc/push_reminder_action',{method:'POST',headers:{'Content-Type':'application/json',apikey:SB_KEY,Authorization:'Bearer '+SB_KEY},
  body:JSON.stringify({p_id:id,p_tok:tok,p_act:act,p_mins:mins||10})}).then(function(r){return r.ok;}).catch(function(){return false;});
}
function openApp(target){
 return self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(cl){
  for(var i=0;i<cl.length;i++){if('focus'in cl[i]){try{cl[i].postMessage({type:'nav',url:target});}catch(err){}return cl[i].focus();}}
  if(self.clients.openWindow)return self.clients.openWindow(target);
 });
}
self.addEventListener('notificationclick',function(e){
 var n=e.notification,D=n.data||{},act=e.action||'';
 n.close();
 var q=function(a){return './index.html#act='+a+(D.cid?'&cid='+encodeURIComponent(D.cid):'')+(D.id?'&rid='+encodeURIComponent(D.id):'')+(D.kind?'&k='+encodeURIComponent(D.kind):'')+(D.lat!=null&&D.lng!=null?'&lat='+D.lat+'&lng='+D.lng:'');};
 if(act==='done'&&D.id&&D.tok){e.waitUntil(rpcAction(D.id,D.tok,'done').then(function(ok){if(!ok)return openApp(q('done'));}));return;}
 if(act==='snooze'&&D.id&&D.tok){var mins=D.kind==='collection'?60:10;
  e.waitUntil(rpcAction(D.id,D.tok,'snooze',mins).then(function(ok){if(!ok)return openApp(q('snooze'));
   return self.registration.showNotification('⏰ נדחה ב-'+mins+' דק׳',{body:(D.cname?D.cname+' — ':'')+'התזכורת תחזור בעוד '+mins+' דקות',tag:'snz-'+D.id,dir:'rtl',lang:'he',icon:'./icon-192.png',badge:'./icon-192.png',silent:true});}));return;}
 if(act==='nav'&&D.lat!=null&&D.lng!=null){e.waitUntil(self.clients.openWindow('https://waze.com/ul?ll='+D.lat+','+D.lng+'&navigate=yes'));return;}
 if(act==='call'&&D.phone){e.waitUntil(openApp(q('call')));return;}
 if(act==='visit'||act==='pay'||act==='cust'){e.waitUntil(openApp(q(act)));return;}
 // body tap: reports keep their url; customer-linked alerts open the matching screen
 var target=D.url||'./index.html';
 /* v87: tapping the alert (the only option on iPhone) opens a quick-actions sheet */
 if(target.indexOf('#')<0&&D.id)target=q('sheet');
 e.waitUntil(openApp(target));
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
