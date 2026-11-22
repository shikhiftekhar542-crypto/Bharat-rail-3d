const V='bharat-rail-v1';
const SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js'];
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(V);
    await Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})));
    await Promise.all(CDN.map(u=>fetch(u).then(r=>{if(r.ok)return c.put(u,r);}).catch(()=>{})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith((async()=>{
    const m=await caches.match(e.request,{ignoreSearch:true});
    if(m)return m;
    try{
      const r=await fetch(e.request);
      if(r&&r.ok&&(r.type==='basic'||CDN.includes(e.request.url))){const c=r.clone();caches.open(V).then(ch=>ch.put(e.request,c));}
      return r;
    }catch(err){return (await caches.match('index.html'))||Response.error();}
  })());
});
