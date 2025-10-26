const CACHE_NAME = 'running-handai-v1761490281991';
const STATIC_CACHE_NAME = 'static-v1761490281991';


// 정적 리소스만 캐시 (이미지, 아이콘 등)
const urlsToCache = ['/manifest.json', '/AppImages/ios/180.png', '/favicon.ico'];

// 캐시하지 않을 URL 패턴
const NEVER_CACHE_PATTERNS = [/\/api\//, /\.html$/, /sockjs/, /hot-update/];

// 설치 이벤트
self.addEventListener('install', event => {
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    console.log('Service Worker installing...');
  }
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(cache => {
        if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
          console.log('Caching static files');
        }
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
          console.error('Caching failed:', error);
        }
      })
  );
  // 새 서비스 워커 즉시 활성화
  self.skipWaiting();
});

// 활성화 이벤트
self.addEventListener('activate', event => {
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    console.log('Service Worker activating...');
  }
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== CACHE_NAME) {
              if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
                console.log('Deleting old cache:', cacheName);
              }
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // 모든 탭에서 새 SW 제어권 가져오기
        return self.clients.claim();
      })
  );
});

// 캐시하지 않을 URL인지 확인
function shouldNeverCache(url) {
  return NEVER_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

// 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
  // chrome-extension, moz-extension 등 지원하지 않는 scheme 필터링
  if (!event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // 캐시하지 않을 URL들은 직접 네트워크 요청
  if (shouldNeverCache(url.pathname + url.search)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network First 전략: 네트워크 우선, 실패 시 캐시
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 유효한 응답인지 확인
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // 정적 리소스만 캐시에 저장 (이미지, 아이콘, manifest 등)
        if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf)$/) || url.pathname === '/manifest.json') {
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 찾기
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // 오프라인 시 기본 페이지 제공
          return caches.match('/manifest.json');
        });
      })
  );
});
