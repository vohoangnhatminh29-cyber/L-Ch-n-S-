
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ScamNews, ScamVideo } from '../types';

const AdminPanel: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'update'>('update');
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // States for adding content
  const [contentType, setContentType] = useState<'NEWS' | 'VIDEO'>('NEWS');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    if (activeAdminTab === 'users') {
      fetchUsers();
    }
  }, [activeAdminTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, full_name, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách người dùng:', err);
      setUsers([
        { email: 'vohoangnhatminh29@gmail.com', full_name: 'Võ Hoàng Nhật Minh', role: 'Admin', created_at: new Date().toISOString() },
        { email: 'nguyen210bru@gmail.com', full_name: 'Nguyen Admin', role: 'Admin', created_at: new Date().toISOString() }
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !url.trim() || !description.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsPublishing(true);
    setDbError(null);
    
    try {
      if (contentType === 'NEWS') {
        const { error } = await supabase
          .from('news') // Thay đổi tên bảng thành 'news'
          .insert([{
            title: title.trim(),
            url: url.trim(),
            source: source.trim() || 'Hệ thống Lá Chắn Số',
            snippet: description.trim(),
            date: new Date().toLocaleDateString('vi-VN')
          }]);
        
        if (error) throw error;
      } else {
        let embed = url.trim();
        let thumb = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop';
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()?.split('?')[0];
          embed = `https://www.youtube.com/embed/${videoId}`;
          thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }

        const { error } = await supabase
          .from('videos') // Thay đổi tên bảng thành 'videos'
          .insert([{
            title: title.trim(),
            url: url.trim(),
            embedUrl: embed,
            thumbnail: thumb,
            source: source.trim() || 'Hệ thống Lá Chắn Số',
            description: description.trim()
          }]);
        
        if (error) throw error;
      }

      setIsSuccess(true);
      setTitle(''); setUrl(''); setDescription(''); setSource('');
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error: any) {
      console.error("Lỗi đăng bài:", error);
      if (error.message?.includes("not find the table") || error.message?.includes("PGRST116")) {
        setDbError(`Bảng '${contentType === 'NEWS' ? 'news' : 'videos'}' chưa tồn tại trong Database Supabase của bạn. Vui lòng chạy lệnh SQL bên dưới để khởi tạo.`);
      } else {
        alert(`Lỗi: ${error.message}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="flex items-center gap-6 mb-10 relative z-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 dark:shadow-none">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800 dark:text-white leading-none mb-2">Trung tâm quản trị</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đồng bộ tin tức thời gian thực</p>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8 relative z-10">
          <button 
            onClick={() => setActiveAdminTab('update')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeAdminTab === 'update' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Cập nhật tin mới
          </button>
          <button 
            onClick={() => setActiveAdminTab('users')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeAdminTab === 'users' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Quản lý tài khoản
          </button>
        </div>

        {activeAdminTab === 'update' ? (
          <div className="space-y-8 relative z-10 animate-in fade-in duration-300">
             <div className="space-y-6 bg-slate-50/50 dark:bg-slate-800/30 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 transition-colors">
                <div className="flex flex-wrap gap-4 mb-4">
                  <button 
                    onClick={() => setContentType('NEWS')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${contentType === 'NEWS' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 hover:border-blue-300'}`}
                  >
                    Đăng tin mới
                  </button>
                  <button 
                    onClick={() => setContentType('VIDEO')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${contentType === 'VIDEO' ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 hover:border-red-300'}`}
                  >
                    Đăng video
                  </button>
                </div>

                <div className="grid gap-5">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Tiêu đề</label>
                      <input 
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" 
                        placeholder="Tiêu đề hiển thị cho người dùng..." 
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Link liên kết (URL)</label>
                      <input 
                        value={url} onChange={(e) => setUrl(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" 
                        placeholder="https://..." 
                      />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Nguồn</label>
                        <input 
                          value={source} onChange={(e) => setSource(e.target.value)}
                          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" 
                          placeholder="Báo VnExpress, VTV, Hệ thống..." 
                        />
                      </div>
                      <div className="flex items-end">
                        <button 
                          onClick={handleUpdate}
                          disabled={isPublishing}
                          className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isPublishing ? 'Đang gửi...' : 'Gửi & Đồng bộ cho App'}
                        </button>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Mô tả tóm tắt</label>
                      <textarea 
                        value={description} onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-white h-32 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all placeholder:text-slate-400" 
                        placeholder="Mô tả ngắn gọn nội dung tin tức..."
                      />
                   </div>
                </div>
                
                {isSuccess && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-black text-center animate-in zoom-in-95 uppercase tracking-widest">
                    ✅ Đã đồng bộ! Mọi người dùng sẽ thấy tin mới ngay lập tức.
                  </div>
                )}

                {dbError && (
                  <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl space-y-4">
                    <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase">{dbError}</p>
                    <div className="bg-slate-900 p-4 rounded-xl overflow-x-auto">
                      <pre className="text-[10px] text-blue-400 font-mono">
{`CREATE TABLE news (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  source text,
  snippet text,
  date text
);

CREATE TABLE videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  embedUrl text,
  thumbnail text,
  source text,
  description text
);

ALTER PUBLICATION supabase_realtime ADD TABLE news, videos;`}
                      </pre>
                    </div>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div className="space-y-6 relative z-10 animate-in fade-in duration-300 transition-colors">
             <div className="overflow-hidden border border-slate-100 dark:border-white/5 rounded-[2rem] bg-white dark:bg-slate-900/50 shadow-sm transition-colors">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Người dùng</th>
                        <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Vai trò</th>
                        <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Ngày tham gia</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                      {loadingUsers ? (
                        <tr><td colSpan={3} className="p-10 text-center text-xs font-bold text-slate-400">Đang tải...</td></tr>
                      ) : users.length > 0 ? users.map((userItem, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                           <td className="p-5">
                              <div className="flex flex-col">
                                <p className="text-sm font-black text-slate-800 dark:text-white leading-tight mb-1">{userItem.full_name || 'Anonymous'}</p>
                                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{userItem.email}</p>
                              </div>
                           </td>
                           <td className="p-5">
                              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${userItem.role === 'Admin' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'}`}>
                                {userItem.role || 'User'}
                              </span>
                           </td>
                           <td className="p-5 text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(userItem.created_at).toLocaleDateString('vi-VN')}</p>
                           </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={3} className="p-10 text-center text-xs font-bold text-slate-400">Không có dữ liệu.</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
