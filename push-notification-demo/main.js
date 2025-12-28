
const publicVapidKey = 'BEl62vp95WshAs1QZ2qz_K697669586_EXAMPLE_KEY';
const statusEl = document.getElementById('status');
const adminPanel = document.getElementById('adminPanel');

function updateStatus(msg, type = 'info') {
    statusEl.textContent = msg;
    statusEl.className = `mb-6 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest block ${
        type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
    }`;
}

// Kiểm tra hỗ trợ Service Worker
if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
}

document.getElementById('subscribeBtn').addEventListener('click', async () => {
    try {
        updateStatus('Đang yêu cầu quyền...');
        
        // 1. Đăng ký Service Worker
        const register = await navigator.serviceWorker.register('sw.js', {
            scope: '/push-notification-demo/'
        });
        
        // 2. Xin quyền thông báo
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Bạn đã từ chối quyền thông báo.');
        }

        // 3. Tạo Subscription
        updateStatus('Đang tạo định danh Radar...');
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        // 4. Gửi subscription lên Server (Localhost)
        updateStatus('Đang kết nối với trung tâm...');
        await fetch('http://localhost:3001/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        });

        updateStatus('🛡️ Radar đã kích hoạt thành công!');
        adminPanel.classList.remove('hidden');
        
    } catch (error) {
        console.error(error);
        updateStatus(error.message, 'error');
    }
});

// Nút gửi thử thông báo
document.getElementById('sendBtn').addEventListener('click', async () => {
    const msg = document.getElementById('msgInput').value;
    await fetch('http://localhost:3001/send-alert', {
        method: 'POST',
        body: JSON.stringify({ message: msg }),
        headers: { 'content-type': 'application/json' }
    });
});

// Helper convert key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
