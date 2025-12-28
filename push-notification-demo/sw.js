
self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Push Received...');
    
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
        data: {
            url: data.url
        }
    });
});

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        clients.openWindow(e.notification.data.url)
    );
});
