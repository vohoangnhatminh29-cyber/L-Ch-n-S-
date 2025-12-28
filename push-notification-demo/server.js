
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Cấu hình VAPID Keys
const publicVapidKey = 'BEl62vp95WshAs1QZ2qz_K697669586_EXAMPLE_KEY'; 
const privateVapidKey = 'YOUR_PRIVATE_KEY_HERE'; 

webpush.setVapidDetails(
  'mailto:admin@la-chan-so.vn',
  publicVapidKey,
  privateVapidKey
);

// Lưu trữ subscription tạm thời trong bộ nhớ
let subscriptions = [];

// Danh sách kịch bản lừa đảo để gửi tự động
const autoScenarios = [
  { title: '🛡️ Cảnh báo: Tuyển CTV Online', body: 'Bẫy "Việc nhẹ lương cao" nạp tiền làm nhiệm vụ Shopee/Lazada đang bùng phát. Cẩn thận!' },
  { title: '🚨 Giả danh Công an/Viện kiểm sát', body: 'Cơ quan chức năng không làm việc qua điện thoại yêu cầu chuyển tiền. Hãy gác máy ngay!' },
  { title: '⚠️ Cảnh báo Deepfake', body: 'Thấy mặt người thân mượn tiền nhưng video mờ, giật lag? Hãy gọi điện thoại thường để xác minh!' },
  { title: '📱 Lừa đảo Khóa SIM', body: 'Tin nhắn báo khóa SIM sau 2h là giả mạo. Tuyệt đối không làm theo cú pháp chuyển hướng cuộc gọi.' },
  { title: '🎁 Quà tặng từ nước ngoài', body: 'Không có thùng quà trị giá hàng tỷ đồng nào bị kẹt ở hải quan cả. Đừng nộp phí "thông quan"!' }
];

// Khung giờ gửi thông báo tự động
const scheduledTimes = ['06:10', '12:00', '15:55', '20:08'];

/**
 * Hàm gửi thông báo tới toàn bộ danh sách đã đăng ký
 */
function broadcastNotification() {
  if (subscriptions.length === 0) {
    console.log('Chưa có thiết bị nào đăng ký nhận tin.');
    return;
  }

  const randomScam = autoScenarios[Math.floor(Math.random() * autoScenarios.length)];
  const payload = JSON.stringify({
    title: randomScam.title,
    body: randomScam.body,
    url: 'https://la-chan-so.vercel.app/library'
  });

  console.log(`[${new Date().toLocaleTimeString()}] Đang gửi thông báo tự động tới ${subscriptions.length} thiết bị...`);

  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => {
      if (err.statusCode === 410 || err.statusCode === 404) {
        subscriptions = subscriptions.filter(s => s !== sub);
      }
    });
  });
}

// Thiết lập vòng lặp kiểm tra thời gian mỗi phút (60000ms)
setInterval(() => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  if (scheduledTimes.includes(currentTime)) {
    broadcastNotification();
  }
}, 60000);

// API: Nhận subscription từ Client
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  const exists = subscriptions.find(s => JSON.stringify(s) === JSON.stringify(subscription));
  if (!exists) {
    subscriptions.push(subscription);
    console.log('Mới đăng ký thêm 1 thiết bị. Tổng cộng:', subscriptions.length);
  }
  res.status(201).json({ message: 'Đã lưu subscription thành công!' });
});

// API: Gửi thông báo thủ công (Dành cho Admin test)
app.post('/send-alert', (req, res) => {
  const payload = JSON.stringify({
    title: '🚨 CẢNH BÁO LÁ CHẮN SỐ',
    body: req.body.message || 'Phát hiện thủ đoạn lừa đảo mới nhắm vào học sinh THPT!',
    url: 'https://la-chan-so.vercel.app/library'
  });

  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => {
      if (err.statusCode === 410 || err.statusCode === 404) {
        subscriptions = subscriptions.filter(s => s !== sub);
      }
    });
  });
  res.json({ message: 'Đã phát lệnh gửi thông báo!' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server Demo Push đang chạy tại http://localhost:${PORT}`);
    console.log(`Thông báo tự động được lập lịch vào: ${scheduledTimes.join(', ')}`);
});
