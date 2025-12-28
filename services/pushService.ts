
import { supabase } from './supabaseClient';

// VAPID Public Key (Bạn tạo bằng lệnh web-push generate-vapid-keys)
const VAPID_PUBLIC_KEY = 'BEl62vp95WshAs1QZ2qz_K697669586_EXAMPLE_KEY'; 

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const PushService = {
  async requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Quyền thông báo bị từ chối');
    }
    return permission;
  },

  async subscribeUser() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Trình duyệt không hỗ trợ Push Notification');
    }

    const registration = await navigator.serviceWorker.ready;
    
    // Đăng ký Push với VAPID Key
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // Tạo ID ẩn danh nếu chưa có
    let anonymousId = localStorage.getItem('lcs_anonymous_id');
    if (!anonymousId) {
      anonymousId = crypto.randomUUID();
      localStorage.setItem('lcs_anonymous_id', anonymousId);
    }

    // Gửi subscription lên Supabase
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({ 
        anonymous_id: anonymousId, 
        subscription_json: JSON.stringify(subscription),
        updated_at: new Date().toISOString()
      }, { onConflict: 'anonymous_id' });

    if (error) throw error;
    
    return subscription;
  }
};
