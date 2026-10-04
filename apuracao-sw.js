const CACHE="apuracao-2026-shell-v1";
const SHELL=["./apuracao-2026.html","./apuracao-2026.webmanifest","./apuracao-icon.svg","./apuracao-icon-180.png","./apuracao-icon-192.png","./apuracao-icon-512.png"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET") return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;
  if(request.mode==="navigate"){
    event.respondWith(fetch(request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put("./apuracao-2026.html",copy));
      return response;
    }).catch(()=>caches.match("./apuracao-2026.html")));
    return;
  }
  if(SHELL.some(path=>url.pathname.endsWith(path.slice(1)))){
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
  }
});
