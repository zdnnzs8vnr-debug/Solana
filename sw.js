/* GUSTAVOEURO — service worker
   - navigazione: network-first (aggiornamenti immediati, fallback offline)
   - CDN/assets: cache-first
   - se qualcosa va storto, il SW non blocca mai il sito
*/
const V = 'ge-v3';
const CORE = ['./', './index.html', './manifest.webmanifest'];
const CDN = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.25.6/babel.min.js'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(V).then(function(c){
      return Promise.all(
        CORE.concat(CDN).map(function(u){ return c.add(u).catch(function(){ return null; }); })
      );
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==V; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  // navigazione -> network first
  if(req.mode === 'navigate'){
    e.respondWith(
      fetch(req).then(function(res){
        const copy = res.clone();
        caches.open(V).then(function(c){ c.put('./index.html', copy); }).catch(function(){});
        return res;
      }).catch(function(){
        return caches.match('./index.html').then(function(r){ return r || caches.match('./'); });
      })
    );
    return;
  }

  // CDN / assets -> cache first
  if(url.origin !== location.origin || /\.(js|css|woff2?|png|jpg|jpeg|gif|svg|webp)$/i.test(url.pathname)){
    e.respondWith(
      caches.match(req).then(function(hit){
        if(hit) return hit;
        return fetch(req).then(function(res){
          if(res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')){
            const copy = res.clone();
            caches.open(V).then(function(c){ c.put(req, copy); }).catch(function(){});
          }
          return res;
        }).catch(function(){ return hit; });
      })
    );
  }
});
