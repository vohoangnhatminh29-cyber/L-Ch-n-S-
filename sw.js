
// Lắng nghe sự kiện Push từ Server
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  
  let data = { 
    title: 'Cảnh báo Lá Chắn Số', 
    body: 'Có thủ đoạn lừa đảo mới vừa được phát hiện. Hãy kiểm tra ngay!',
    url: '/' 
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', // Icon cái khiên
    badge: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'Xem chi tiết 🔍' },
      { action: 'close', title: 'Đóng' }
    ],
    tag: 'lcs-alert', // Ghi đè các thông báo cũ cùng loại
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Xử lý khi người dùng nhấn vào thông báo
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Nếu app đang mở thì focus, nếu không thì mở tab mới
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
