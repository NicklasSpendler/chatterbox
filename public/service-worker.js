const cacheVersion = 'v3';

const cachePages = [
    '/index.html',
    '/assets/js/script.js',
    '/assets/css/style.css',
    '/assets/images/catter.png',
    '/assets/images/catter.svg',
    '/assets/media/lyd.mp3'
]
;

// Call install event;
// Activation happens when reloading pages
self.addEventListener('install',(e)=>{
    console.log('Service worker is installed')

    e.waitUntil(
        caches.open(cacheVersion)
            .then((cache)=>{
                cache.addAll(cachePages)
            })
            .then(()=> self.skipWaiting())
    );
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
// Fetches happens you are offline
self.addEventListener('fetch',(e)=>{
    console.log('Service worker fetching', );
    e.respondWith(
        fetch(e.request).catch(()=> caches.match(e.request))
    )
});