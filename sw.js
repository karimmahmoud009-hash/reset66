const CACHE='reset66-v8';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./art/hero.webp','./art/bg-city.webp','./art/bg-levelup.webp','./art/bg-dungeon.webp','./art/bg-light-city.webp','./art/bg-light-levelup.webp','./art/bg-light-dungeon.webp','./art/rank-E.webp','./art/rank-D.webp','./art/rank-C.webp','./art/rank-B.webp','./art/rank-A.webp','./art/rank-S.webp'];
/* 'reload' / 'no-store' skip the browser's HTTP cache, so an update is never served from a stale copy */
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const url=new URL(r.url);
  if(url.pathname.endsWith('/inbox.json')) return; /* coach commands always come from the network */
  if(r.mode==='navigate'){
    e.respondWith(fetch(r.url,{cache:'no-store',credentials:'same-origin'}).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return res;}).catch(()=>caches.match('./index.html')));
    return;
  }
  if(url.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;})));
  }
});
