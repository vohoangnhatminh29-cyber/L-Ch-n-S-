
import React, { useState, useEffect } from 'react';
import { PushService } from '../services/pushService';
import ResearchStats from './ResearchStats';
import { RESEARCH_DATA } from '../constants';

interface SettingsProps {
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onLogin, onLogout }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lcs-theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    account: true,
    notifications: false,
    interface: false,
    chartData: false
  });

  useEffect(() => {
    if ('Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleTogglePush = async () => {
    setPushLoading(true);
    try {
      if (!pushEnabled) {
        await PushService.requestPermission();
        await PushService.subscribeUser();
        setPushEnabled(true);
        alert("🛡️ Đã bật thông báo bảo vệ thành công!");
      } else {
        alert("Để tắt thông báo, vui lòng vào cài đặt trình duyệt của bạn.");
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setPushLoading(false);
    }
  };

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('lcs-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionHeader = ({ id, icon, title, description, bgColor }: any) => (
    <button onClick={() => toggleSection(id)} className={`w-full flex items-center justify-between p-5 transition-all ${openSections[id] ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'bg-white dark:bg-slate-900'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center text-white shadow-sm shrink-0`}>{icon}</div>
        <div className="text-left">
          <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{title}</h2>
          <p className="text-[9px] text-slate-400 font-bold uppercase">{description}</p>
        </div>
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform shrink-0 ${openSections[id] ? 'rotate-180 bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-24 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-white/5 overflow-hidden divide-y divide-slate-100 dark:divide-white/5 transition-colors">
        
        {/* TÀI KHOẢN */}
        <div>
          <SectionHeader 
            id="account" 
            title="Tài khoản" 
            description="Thông tin & Thành tích" 
            bgColor="bg-indigo-600" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
          />
          {openSections.account && (
            <div className="p-8 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
              {user ? (
                <div className="space-y-8 animate-in slide-in-from-top-4">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-110 group-hover:scale-125 transition-transform"></div>
                      <img src={user.user_metadata?.avatar_url} className="w-24 h-24 rounded-full relative z-10 border-4 border-white dark:border-slate-800 shadow-2xl" alt="Avatar" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{user.user_metadata?.full_name}</h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{user.email}</p>
                    </div>
                  </div>

                  {/* Achievements area */}
                  <div className="glass-card rounded-3xl p-6 border border-white/60 dark:border-white/5 shadow-inner">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Hệ thống Huy chương Khiên số</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 dark:border-slate-700">📄</div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight text-center">Khiên Giấy</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 dark:border-slate-700 grayscale opacity-30">🥈</div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight text-center">Khiên Bạc</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 dark:border-slate-700 grayscale opacity-30">🥇</div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight text-center">Khiên Vàng</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={onLogout}
                    className="w-full py-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Đăng xuất tài khoản
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-6">
                  <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] flex items-center justify-center mx-auto text-indigo-500 shadow-inner">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Chưa đăng nhập</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Đăng nhập để theo dõi và lưu huy chương của bạn.</p>
                  </div>
                  <button 
                    onClick={onLogin}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* THÔNG BÁO PUSH */}
        <div>
          <SectionHeader id="notifications" title="Thông báo bảo vệ" description="Radar cảnh báo 24/7" bgColor="bg-red-500" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} />
          {openSections.notifications && (
            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="flex-1 pr-4">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase">Thông báo đẩy (Push)</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Nhận cảnh báo thủ đoạn mới ngay cả khi không mở ứng dụng.</p>
                </div>
                <button 
                  onClick={handleTogglePush}
                  disabled={pushLoading}
                  className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${pushEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${pushEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DỮ LIỆU BIỂU ĐỒ */}
        <div>
          <SectionHeader 
            id="chartData" 
            title="Dữ liệu thống kê" 
            description="Thông số Radar an ninh" 
            bgColor="bg-emerald-600" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
          />
          {openSections.chartData && (
            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50 transition-colors space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/5">
                    <tr>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại hình lừa đảo</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tỷ lệ (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {RESEARCH_DATA.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                        </td>
                        <td className="p-4 text-right text-xs font-black text-blue-600 dark:text-blue-400">{item.value}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tích hợp thành phần biểu đồ vào đây */}
              <div className="pt-4">
                <ResearchStats />
              </div>

              <p className="text-[9px] text-slate-400 font-bold uppercase text-center italic mt-4">* Dữ liệu được cập nhật dựa trên báo cáo thực tế từ Cục An toàn thông tin và hệ thống Lá Chắn Số.</p>
            </div>
          )}
        </div>

        {/* GIAO DIỆN */}
        <div>
          <SectionHeader id="interface" title="Giao diện" description="Sáng & Tối" bgColor="bg-blue-600" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>} />
          {openSections.interface && (
            <div className="p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
               <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => toggleTheme('light')} 
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Sáng
                  </button>
                  <button 
                    onClick={() => toggleTheme('dark')} 
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${theme === 'dark' ? 'bg-slate-700 dark:bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Tối Obsidian
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
