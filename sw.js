// importScripts('/workbox');
const staticAssets = [
    '/',
    'stylesheet/main.css',
    'datatables_css/css/jquery.dataTables.css',
    '/bootstrap/bootstrap.min.css',
    'https://fonts.googleapis.com/css?family=Varela+Round',
    'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300',
    'script/index.js',
    'jquery/jquery.min.js',
    'jquery-mobile/jquery-mobile.min.js',
    'datatables/jquery.dataTables.js',
    '/socket.io/socket.io.js',
    'script/index.js',
    'script/scripts.js',
    'script/signIn.js',
    'images/profile_male.jpg'
];

// const wb = new WorkboxSW();
// wb.precache(staticAssets);


self.addEventListener('install', async event => {    //install service worker if there are updates
    const cache = await caches.open('ladang-curhat');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {    //download contents that need to be cached if there are updates
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin === location.origin){
        event.respondWith(cacheFirst(req));
    } else{
        event.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req){          //returns shell
    const cachedresponse = await caches.match(req);
    return cachedresponse || fetch(req);
}

async function networkFirst(req) {       //returns content, and returns a fallback if the content is not located in cache
    const cache = await caches.open('chat-dynamic');
    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedresponse = await cache.match(req);
        return cachedresponse || await caches.match('./fallback.json')
    }
}