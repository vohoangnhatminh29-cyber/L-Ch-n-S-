import React, { useState, useEffect, useRef } from 'react';
import Analyzer from './components/Analyzer';
import ScamLibrary from './components/ScamLibrary';
import Practice from './components/Practice';
import Settings from './components/Settings';
import SafeBuddy from './components/SafeBuddy';
import AdminPanel from './components/AdminPanel';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { SCAM_SCENARIOS } from './constants';
import { ScamScenario } from './types';

// Danh sách email có quyền admin
const ADMIN_EMAILS = ['vohoangnhatminh29@gmail.com', 'nguyen210bru@gmail.com'];

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyzer' | 'library' | 'practice' | 'settings' | 'admin'>('analyzer');
  const [scenarios, setScenarios] = useState<ScamScenario[]>(SCAM_SCENARIOS);
  const [isBuddyOpen, setIsBuddyOpen] = useState(false);
  const [autoStartLive, setAutoStartLive] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [buddyPos, setBuddyPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 160 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  // Kiểm tra xem user hiện tại có phải admin không
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    let subscription: any = null;

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      subscription = data.subscription;
    }

    const savedTheme = localStorage.getItem('lcs-theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const timer = setTimeout(() => {
      setShowIntro(false);
      setShowInquiry(true);
    }, 3000);

    const savedPos = localStorage.getItem('buddy-pos-v2');
    if (savedPos) {
      setBuddyPos(JSON.parse(savedPos));
    } else {
      setBuddyPos({ x: window.innerWidth - 88, y: window.innerHeight - 160 });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearTimeout(timer);
      if (subscription) subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogin = async () => {
    if (!isSupabaseConfigured) {
      alert('Cấu hình Supabase chưa hoàn tất.');
      return;
    }
    const currentOrigin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: currentOrigin,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    window.location.reload();
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragOffset.current = { x: clientX - buddyPos.x, y: clientY - buddyPos.y };
    dragStartPos.current = { x: buddyPos.x, y: buddyPos.y };
    setIsDragging(true);
    hasMovedRef.current = false;
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    let newX = clientX - dragOffset.current.x;
    let newY = clientY - dragOffset.current.y;
    newX = Math.max(8, Math.min(window.innerWidth - 72, newX));
    newY = Math.max(8, Math.min(window.innerHeight - 72, newY));
    if (Math.abs(newX - dragStartPos.current.x) > 5 || Math.abs(newY - dragStartPos.current.y) > 5) {
      hasMovedRef.current = true;
    }
    setBuddyPos({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = window.innerWidth / 2;
    const snappedX = buddyPos.x < threshold ? 16 : window.innerWidth - 80;
    const finalPos = { x: snappedX, y: buddyPos.y };
    setBuddyPos(finalPos);
    localStorage.setItem('buddy-pos-v2', JSON.stringify(finalPos));
  };

  const handleBuddyClick = () => {
    if (!hasMovedRef.current) {
      setIsBuddyOpen(!isBuddyOpen);
      setAutoStartLive(false);
    }
  };

  const isAtLeftSide = buddyPos.x < (window.innerWidth / 2);
  const isAtTopSide = buddyPos.y < (window.innerHeight / 2);

  const containerStyle: React.CSSProperties = {
    left: buddyPos.x,
    top: buddyPos.y,
    width: '64px',
    height: '64px',
    display: 'flex',
    flexDirection: isAtTopSide ? 'column' : 'column-reverse',
    alignItems: isAtLeftSide ? 'flex-start' : 'flex-end',
    pointerEvents: 'none'
  };

  const popupStyle: React.CSSProperties = {
    pointerEvents: 'auto',
    position: 'absolute',
    zIndex: 70,
    ...(isAtTopSide ? { top: '72px' } : { bottom: '72px' }),
    ...(isAtLeftSide ? { left: '0' } : { right: '0' }),
    transformOrigin: `${isAtTopSide ? 'top' : 'bottom'} ${isAtLeftSide ? 'left' : 'right'}`
  };

  const menuItems = [
    { id: 'analyzer', label: 'Trang chủ', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'library', label: 'Thư viện', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'practice', label: 'Luyện tập', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'settings', label: 'Cài đặt', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  // Chỉ thêm mục Admin nếu là admin
  if (isAdmin) {
    menuItems.push({ 
      id: 'admin', 
      label: 'Quản trị', 
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' // Sử dụng icon thư viện tạm cho tab admin
    });
  }

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden p-6 transition-colors duration-500">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-[140px] animate-pulse [animation-delay:1.5s]"></div>
        <div className="relative flex flex-col items-center z-10 w-full max-sm:max-w-xs">
          <div className="w-36 h-36 relative mb-8 animate-[shieldFloat_5s_ease-in-out_infinite]">
             <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full scale-110"></div>
             <div className="relative w-full h-full flex items-center justify-center rounded-[2.5rem] bg-white/20 backdrop-blur-3xl shadow-[0_40px_80px_-15px_rgba(37,99,235,0.2)] overflow-hidden">
                <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7V12C3 17.41 6.84 22.41 12 24C17.16 22.41 21 17.41 21 12V7L12 2Z" fill="#2563EB" />
                  <path d="M12 8C10.34 8 9 9.34 9 11V13H8V18H16V13H15V11C15 9.34 13.66 8 12 8ZM11 11C11 10.45 11.45 10 12 10C12.55 10 13 10.45 13 11V13H11V11Z" fill="white" />
                </svg>
             </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 transition-colors">Lá Chắn Số</h1>
          <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center">Lá chắn tin cậy trước lừa đảo trực tuyến</p>
        </div>
      </div>
    );
  }

  const handleStartBuddy = (live: boolean = false) => {
    setAutoStartLive(live);
    setIsBuddyOpen(true);
    setShowInquiry(false);
  };

  return (
    <div 
      className="min-h-screen bg-[#f0f4f8] dark:bg-[#020617] text-slate-900 dark:text-slate-100 pattern-dots relative overflow-x-hidden transition-colors duration-500"
      onMouseMove={handleDrag}
      onTouchMove={handleDrag}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/50 dark:border-white/5 sticky top-0 z-30 shadow-[0_4px_12px_rgba(0,0,0,0.02)] h-16 flex items-center transition-colors">
        <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-sm">
               <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7V12C3 17.41 6.84 22.41 12 24C17.16 22.41 21 17.41 21 12V7L12 2Z" fill="#2563EB" />
                <path d="M12 8C10.34 8 9 9.34 9 11V13H8V18H16V13H15V11C15 9.34 13.66 8 12 8ZM11 11C11 10.45 11.45 10 12 10C12.55 10 13 10.45 13 11V13H11V11Z" fill="white" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-slate-900 dark:text-white text-[12px] sm:text-[16px] tracking-[-0.04em] font-inter transition-colors">Lá Chắn Số</h1>
              </div>
              <p className="text-[6px] sm:text-[8px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-[0.12em] opacity-90 font-inter mt-1">LÁ CHẮN TIN CẬY TRƯỚC LỪA ĐẢO</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex gap-1 mr-4">
              {menuItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === item.id ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'}`}>{item.label}</button>
              ))}
            </nav>

            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full ring-2 ring-blue-500/30 shadow-lg overflow-hidden transition-all active:scale-90"
                >
                  <img src={user.user_metadata?.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
                </button>
              ) : (
                <button 
                  onClick={handleLogin} 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all active:scale-95"
                >
                  Đăng nhập
                </button>
              )}

              {/* USER POPUP MENU */}
              {showUserMenu && user && (
                <div className="absolute right-0 mt-3 w-72 glass-card rounded-[2.5rem] p-6 border border-slate-100 dark:border-white/5 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50 transition-colors">
                  <div className="flex flex-col items-center mb-5 pb-4 border-b border-slate-100 dark:border-white/5">
                    <img src={user.user_metadata?.avatar_url} className="w-16 h-16 rounded-full mb-3 shadow-md border-2 border-blue-500/20" alt="Avatar" />
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight text-center leading-tight">
                      {user.user_metadata?.full_name}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Công dân số tiêu biểu</p>
                    {isAdmin && (
                      <span className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[8px] font-black uppercase rounded-full">Quản trị viên</span>
                    )}
                  </div>

                  {/* Achievements/Shields Section */}
                  <div className="mb-6">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Huy chương Khiên số</h5>
                    <div className="flex justify-center gap-4">
                      <div className="flex flex-col items-center gap-1 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Cấp độ 1: Khiên Giấy">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📄</div>
                      </div>
                      <div className="flex flex-col items-center gap-1 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Cấp độ 2: Khiên Bạc">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🥈</div>
                      </div>
                      <div className="flex flex-col items-center gap-1 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Cấp độ 3: Khiên Vàng">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🥇</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {isAdmin && (
                      <button 
                        onClick={() => { setActiveTab('admin'); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all text-xs font-bold text-blue-700 dark:text-blue-400"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        Bảng quản trị
                      </button>
                    )}
                    <button 
                      onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-xs font-bold text-slate-600 dark:text-slate-300"
                    >
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Cài đặt tài khoản
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all text-xs font-black uppercase tracking-widest mt-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 pb-24 relative z-10">
        {activeTab === 'analyzer' && <Analyzer />}
        {activeTab === 'library' && <ScamLibrary scenarios={scenarios} onAddScenario={(s) => setScenarios(prev => [s, ...prev])} />}
        {activeTab === 'practice' && <Practice user={user} onLogin={handleLogin} />}
        {activeTab === 'settings' && <Settings user={user} onLogin={handleLogin} onLogout={handleLogout} />}
        {activeTab === 'admin' && isAdmin && <AdminPanel />}
      </main>

      <div className={`fixed z-[60] select-none ${isDragging ? '' : 'transition-all duration-300 ease-out'}`} style={containerStyle}>
        <button onMouseDown={handleDragStart} onTouchStart={handleDragStart} onClick={handleBuddyClick} className={`group relative w-16 h-16 rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(37,99,235,0.3)] transition-all pointer-events-auto ${isBuddyOpen ? 'bg-slate-900 dark:bg-slate-800 rotate-90 scale-90' : 'bg-blue-600 ring-4 ring-white dark:ring-slate-900 hover:scale-110 active:scale-95'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
          {isBuddyOpen ? (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <>
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative z-10 w-11 h-11 flex items-center justify-center text-white">
                 <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
                  <rect x="7" y="11" width="10" height="7" rx="3" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
                  <circle cx="9.5" cy="13.5" r="0.8" fill="white"/>
                  <circle cx="14.5" cy="13.5" r="0.8" fill="white"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
            </>
          )}
        </button>

        {isBuddyOpen && (
          <div style={popupStyle} className="animate-in fade-in zoom-in-95 shadow-2xl transition-all duration-300">
            <SafeBuddy onClose={() => setIsBuddyOpen(false)} initialLiveMode={autoStartLive} />
          </div>
        )}
      </div>

      {showInquiry && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-700">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 max-w-sm w-full shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white dark:border-white/10 text-center animate-in zoom-in-90 slide-in-from-bottom-10 duration-700 delay-100 fill-mode-both">
            <div className="w-24 h-24 bg-blue-50/50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
               <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7V12C3 17.41 6.84 22.41 12 24C17.16 22.41 21 17.41 21 12V7L12 2Z" fill="#2563EB" />
                  <path d="M12 8C10.34 8 9 9.34 9 11V13H8V18H16V13H15V11C15 9.34 13.66 8 12 8ZM11 11C11 10.45 11.45 10 12 10C12.55 10 13 10.45 13 11V13H11V11Z" fill="white" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">Trợ lý Lá Chắn Số đã sẵn sàng!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-10 leading-relaxed px-2">Bạn có muốn bắt đầu nhận sự hỗ trợ bảo vệ từ chuyên gia AI ngay bây giờ không?</p>
            <div className="space-y-3">
              <button onClick={() => handleStartBuddy(true)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:bg-indigo-700 active:scale-[0.97] transition-all flex items-center justify-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z" strokeWidth="2" /></svg>
                Trò chuyện bằng giọng nói
              </button>
              <button onClick={() => handleStartBuddy(false)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] shadow-[0_15px_30px_rgba(37,99,235,0.2)] hover:bg-blue-700 active:scale-[0.97] transition-all">Nhắn tin văn bản</button>
              <button onClick={() => setShowInquiry(false)} className="w-full py-4 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[9px] hover:text-slate-600 dark:hover:text-slate-300 transition-colors pt-2">Để sau</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-4 right-4 glass-card border border-white/40 dark:border-white/5 lg:hidden flex items-center h-16 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.1)] z-40 px-2">
        <div className="flex w-full items-center justify-around">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-white/5 rounded-2xl shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={item.icon} /></svg>
              <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes shieldFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`}</style>
    </div>
  );
};

export default App;