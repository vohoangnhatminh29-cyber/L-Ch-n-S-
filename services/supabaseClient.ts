
import { createClient } from '@supabase/supabase-js';

// Thông tin Supabase chính thức của dự án
const supabaseUrl = 'https://nhjsgprjodqkctwwkgxh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oanNncHJqb2Rxa2N0d3drZ3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MzQ4MTQsImV4cCI6MjA4MjMxMDgxNH0.2id5PDGz9_-mpNa3eQZMfLOL1Y2hi9eTEn-JT2BWvoE';

// Kiểm tra xem URL có hợp lệ không
const isValidUrl = (url: string) => {
  try {
    return url && url.startsWith('http') && new URL(url);
  } catch {
    return false;
  }
};

// Xác định trạng thái cấu hình
export const isSupabaseConfigured = !!(isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey.length > 20);

// Khởi tạo client với giá trị dự phòng nếu chưa cấu hình để tránh crash ứng dụng
const finalUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey);
