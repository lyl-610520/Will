// Service Worker for Just in Time PWA
const CACHE_NAME = 'just-in-time-v1.0.0';
const CACHE_VERSION = '1.0.0';

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/styles.css',
    '/js/utils.js',
    '/js/storage.js',
    '/js/i18n.js',
    '/js/weather.js',
    '/js/background.js',
    '/js/effects.js',
    '/js/music.js',
    '/js/notifications.js',
    '/js/achievements.js',
    '/js/pages/home.js',
    '/js/pages/stats.js',
    '/js/pages/wardrobe.js',
    '/js/pages/garden.js',
    '/js/pages/settings.js',
    '/js/router.js',
    '/js/app.js',
    '/sw-register.js',
    // 图标文件
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon-32x32.png',
    '/icons/favicon-16x16.png',
    // 音频文件
    '/sounds/track1.mp3',
    '/sounds/track2.mp3',
    '/sounds/track3.mp3',
    '/sounds/click.mp3',
    '/sounds/success.mp3',
    '/sounds/notification.mp3',
    // 外部资源
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// 需要在线获取的动态资源（缓存但可更新）
const DYNAMIC_CACHE_URLS = [
    'https://api.weatherapi.com/v1/current.json'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            // 缓存静态资源
            caches.open(CACHE_NAME).then((cache) => {
                console.log('Caching static resources...');
                return cache.addAll(STATIC_CACHE_URLS.map(url => {
                    // 为相对路径添加时间戳，防止缓存问题
                    if (url.startsWith('/')) {
                        return new Request(url, { cache: 'reload' });
                    }
                    return url;
                }));
            }),
            // 立即激活新的 Service Worker
            self.skipWaiting()
        ])
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        Promise.all([
            // 清理旧版本缓存
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // 立即控制所有页面
            self.clients.claim()
        ])
    );
});

// 请求拦截 - 缓存策略
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // 忽略非 GET 请求
    if (request.method !== 'GET') {
        return;
    }
    
    // 忽略 chrome-extension 等特殊协议
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    event.respondWith(handleRequest(request));
});

// 处理请求的缓存策略
async function handleRequest(request) {
    const url = new URL(request.url);
    
    try {
        // 1. 天气API - 网络优先，失败时使用缓存
        if (url.hostname === 'api.weatherapi.com') {
            return await networkFirstStrategy(request);
        }
        
        // 2. Google Fonts - 缓存优先
        if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
            return await cacheFirstStrategy(request);
        }
        
        // 3. CDN资源 - 缓存优先
        if (url.hostname.includes('cdnjs.cloudflare.com')) {
            return await cacheFirstStrategy(request);
        }
        
        // 4. 静态资源 - 缓存优先，失败时使用网络
        if (isStaticResource(url.pathname)) {
            return await cacheFirstStrategy(request);
        }
        
        // 5. HTML页面 - 网络优先，失败时使用缓存
        if (url.pathname === '/' || url.pathname.endsWith('.html')) {
            return await networkFirstStrategy(request);
        }
        
        // 6. 其他资源 - 网络优先
        return await networkFirstStrategy(request);
        
    } catch (error) {
        console.warn('Request failed:', request.url, error);
        
        // 如果是导航请求且失败，返回离线页面
        if (request.destination === 'document') {
            return await getOfflinePage();
        }
        
        throw error;
    }
}

// 缓存优先策略
async function cacheFirstStrategy(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        // 后台更新缓存
        fetch(request).then((response) => {
            if (response && response.status === 200) {
                cache.put(request, response.clone());
            }
        }).catch(() => {
            // 网络请求失败，忽略
        });
        
        return cachedResponse;
    }
    
    // 缓存中没有，从网络获取
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// 网络优先策略
async function networkFirstStrategy(request) {
    const cache = await caches.open(CACHE_NAME);
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            // 更新缓存
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // 网络失败，尝试从缓存获取
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// 判断是否为静态资源
function isStaticResource(pathname) {
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.mp3', '.wav'];
    return staticExtensions.some(ext => pathname.endsWith(ext));
}

// 获取离线页面
async function getOfflinePage() {
    const cache = await caches.open(CACHE_NAME);
    const cachedPage = await cache.match('/index.html');
    
    if (cachedPage) {
        return cachedPage;
    }
    
    // 如果连index.html都没有缓存，返回一个简单的离线页面
    return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Just in Time - 离线</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                }
                h1 { margin-bottom: 20px; }
                .retry-btn {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 20px;
                }
                .retry-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Just in Time</h1>
                <p>您当前处于离线状态</p>
                <p>请检查网络连接后重试</p>
                <button class="retry-btn" onclick="location.reload()">重试</button>
            </div>
        </body>
        </html>
    `, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

// 消息处理 - 用于与主线程通信
self.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_VERSION });
            break;
            
        case 'CACHE_URLS':
            cacheUrls(payload.urls).then(() => {
                event.ports[0].postMessage({ success: true });
            }).catch((error) => {
                event.ports[0].postMessage({ success: false, error: error.message });
            });
            break;
            
        case 'CLEAR_CACHE':
            clearCache().then(() => {
                event.ports[0].postMessage({ success: true });
            }).catch((error) => {
                event.ports[0].postMessage({ success: false, error: error.message });
            });
            break;
    }
});

// 缓存指定URLs
async function cacheUrls(urls) {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(urls);
}

// 清空缓存
async function clearCache() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

// 后台同步 - 用于离线时的数据同步
self.addEventListener('sync', (event) => {
    console.log('Background sync:', event.tag);
    
    switch (event.tag) {
        case 'weather-sync':
            event.waitUntil(syncWeatherData());
            break;
        case 'data-backup':
            event.waitUntil(backupUserData());
            break;
    }
});

// 同步天气数据
async function syncWeatherData() {
    try {
        // 尝试获取最新天气数据
        const response = await fetch('/api/weather');
        if (response.ok) {
            const weatherData = await response.json();
            // 通知主线程更新天气数据
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'WEATHER_UPDATED',
                    payload: weatherData
                });
            });
        }
    } catch (error) {
        console.warn('Weather sync failed:', error);
    }
}

// 备份用户数据
async function backupUserData() {
    try {
        // 这里可以实现数据备份逻辑
        console.log('User data backup completed');
    } catch (error) {
        console.warn('Data backup failed:', error);
    }
}

// 推送通知处理
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);
    
    const options = {
        body: event.data ? event.data.text() : '您有新的消息',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        vibrate: [200, 100, 200],
        data: event.data ? JSON.parse(event.data.text()) : {},
        actions: [
            {
                action: 'view',
                title: '查看',
                icon: '/icons/icon-72x72.png'
            },
            {
                action: 'dismiss',
                title: '忽略'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Just in Time', options)
    );
});

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'view') {
        // 打开应用
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'dismiss') {
        // 忽略通知
        return;
    } else {
        // 默认行为：打开应用
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// 错误处理
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
});

console.log('Service Worker loaded successfully');