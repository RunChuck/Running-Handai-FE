const CACHE_NAME = 'running-handai-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/AppImages/ios/180.png',
  '/favicon.ico'
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Caching failed:', error);
      })
  );
  // 새 서비스 워커 즉시 활성화
  self.skipWaiting();
});

// 활성화 이벤트  
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 모든 탭에서 새 SW 제어권 가져오기
      return self.clients.claim();
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  // chrome-extension, moz-extension 등 지원하지 않는 scheme 필터링
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에서 찾았으면 반환
        if (response) {
          return response;
        }
        
        // 네트워크 요청 후 캐시에 저장
        return fetch(event.request).then((response) => {
          // 유효한 응답인지 확인
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 응답 복사 후 캐시에 저장
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
      .catch(() => {
        // 네트워크 실패 시 오프라인 페이지 제공
        return caches.match('/');
      })
  );
});