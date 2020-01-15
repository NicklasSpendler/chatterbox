const cacheVersion = 'cachedPage';


// Call install event;
// Activation happens when reloading pages
self.addEventListener('install',(e)=>{
});

// Happens when installed
self.addEventListener('activate',(e)=>{
    console.log('Service worker activated', )
    // remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheVersion){
                        console.log('Service worker: Cleaing old cache', );
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

// Call Fetch Event
self.addEventListener('fetch',(e)=>{
    console.log('Service worker fetching', );
    e.respondWith(
        fetch(e.request)
        .then(res => {
            // Copy clone of repsonse
            const resClone = res.clone();
            caches
                .open(cacheVersion)
                .then(cache => {
                    // Add repsonse to cache
                    cache.put(e.request, resClone)
                })
            return res;
        }).catch(err => caches.match(e.request).then(res => res))
    )
});