
import React, { useState, useEffect, useRef } from 'react';
import { ScamScenario, ScamNews, ScamVideo } from '../types';
import { fetchLatestScamNews } from '../services/geminiService';
import { SCAM_VIDEOS } from '../constants';
import { supabase } from '../services/supabaseClient';

interface ScamLibraryProps {
  scenarios: ScamScenario[];
  onAddScenario: (s: ScamScenario) => void;
}

const ScamLibrary: React.FC<ScamLibraryProps> = ({ scenarios, onAddScenario }) => {
  const [news, setNews] = useState<ScamNews[]>([]);
  const [videos, setVideos] = useState<ScamVideo[]>(SCAM_VIDEOS);
  const [isFetchingNews, setIsFetchingNews] = useState(false);
  const [filter, setFilter] = useState('Tất cả');
  const [selectedScenario, setSelectedScenario] = useState<ScamScenario | null>(null);
  
  const scenarioScrollRef = useRef<HTMLDivElement>(null);
  const newsScrollRef = useRef<HTMLDivElement>(null);
  const videoScrollRef = useRef<HTMLDivElement>(null);

  const categories = ['Tất cả', ...new Set(scenarios.map(s => s.category))];
  const filteredScenarios = filter === 'Tất cả' ? scenarios : scenarios.filter(s => s.category === filter);

  /**
   * Tải dữ liệu ban đầu từ Supabase (public.news) và gộp với tin tức từ AI
   * Giới hạn nghiêm ngặt tối đa 15 bài báo
   */
  const loadMergedData = async (isBackground = false) => {
    if (!isBackground) setIsFetchingNews(true);
    
    try {
      // 1. Tải song song tin từ DB và AI
      // Lưu ý: AI News giờ đã nhanh hơn nhờ sử dụng model flash-preview
      const [dbNewsResult, dbVideosResult, aiNews] = await Promise.all([
        supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(15),
        supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false }),
        fetchLatestScamNews().catch(() => [])
      ]);

      // 2. Xử lý gộp tin tức: DB News (Mới nhất từ Admin) + AI News
      if (!dbNewsResult.error && dbNewsResult.data && dbNewsResult.data.length > 0) {
        const mergedNews = [...dbNewsResult.data, ...aiNews].slice(0, 15);
        setNews(mergedNews);
      } else {
        if (dbNewsResult.error) {
          console.warn("Lưu ý: Không thể tải tin từ Supabase (có thể bảng chưa tồn tại). Đang sử dụng dữ liệu từ AI.");
          console.debug("Chi tiết lỗi Supabase:", dbNewsResult.error.message || dbNewsResult.error);
        }
        setNews(aiNews.slice(0, 15));
      }

      // 3. Xử lý video
      if (!dbVideosResult.error && dbVideosResult.data) {
        setVideos([...dbVideosResult.data, ...SCAM_VIDEOS]);
      } else {
        setVideos(SCAM_VIDEOS);
      }

    } catch (e) {
      console.warn("Sự cố đồng bộ dữ liệu, đang sử dụng chế độ dự phòng.");
    } finally {
      if (!isBackground) setIsFetchingNews(false);
    }
  };

  useEffect(() => {
    loadMergedData();

    /**
     * THIẾT LẬP KÊNH ĐỒNG BỘ REAL-TIME TRỰC TIẾP VỚI PUBLIC.NEWS
     */
    const newsSubscription = supabase
      .channel('public_news_realtime')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'news' 
        },
        (payload) => {
          const newArticle = payload.new as ScamNews;
          console.log("Phát hiện tin mới từ Admin:", newArticle.title);
          
          setNews(currentNews => {
            const updatedNews = [newArticle, ...currentNews];
            return updatedNews.slice(0, 15);
          });
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'videos' 
        },
        (payload) => {
          const newVid = payload.new as ScamVideo;
          setVideos(current => [newVid, ...current]);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log("Đã kết nối luồng đồng bộ tin tức từ public.news");
        }
      });

    return () => {
      supabase.removeChannel(newsSubscription);
    };
  }, []);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { current } = ref;
      const scrollAmount = window.innerWidth < 640 ? 280 : 400;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop';
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* KỊCH BẢN LỪA ĐẢO */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
            Kịch bản lừa đảo phổ biến
          </h2>
          <div className="hidden sm:flex gap-3">
            <button onClick={() => scroll(scenarioScrollRef, 'left')} className="w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={() => scroll(scenarioScrollRef, 'right')} className="w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`whitespace-nowrap px-6 py-2.5 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-wider ${filter === cat ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white/60 dark:bg-slate-800/60 border-white/80 dark:border-white/5 text-slate-500 hover:text-blue-600 shadow-sm'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="relative group px-2">
          <div ref={scenarioScrollRef} className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth">
            {filteredScenarios.map(scenario => (
              <div key={scenario.id} className="flex-shrink-0 w-[85vw] sm:w-[320px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 dark:border-white/5 p-7 shadow-sm hover:shadow-xl transition-all duration-500 snap-start flex flex-col group/card">
                <div className="mb-5 relative z-10">
                  <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 px-3 py-1.5 rounded-xl mb-4 inline-block">{scenario.category}</span>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight mb-3 line-clamp-2 min-h-[3rem] group-hover/card:text-blue-700 transition-colors">{scenario.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-[12px] font-medium leading-relaxed mb-4 line-clamp-3">{scenario.description}</p>
                </div>
                <div className="mt-auto pt-5 border-t border-slate-100/50 dark:border-white/5">
                  <button onClick={() => setSelectedScenario(scenario)} className="w-full py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95">Tìm hiểu thêm</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIN TỨC - NEWS FEED */}
      <div className="space-y-8 pt-12 border-t border-slate-100/50 dark:border-white/5">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3 uppercase">
              <span className="w-12 h-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/60 dark:border-white/5 text-blue-600 dark:text-blue-400 rounded-[1.2rem] flex items-center justify-center shadow-sm">📰</span>
              Tin tức mới nhất
            </h2>
            <p className="text-[10px] text-blue-500 dark:text-blue-400 font-black uppercase tracking-[0.2em] mt-2">Dữ liệu từ Báo Nhân Dân, VnExpress & AI Radar</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => scroll(newsScrollRef, 'left')} className="w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all active:scale-90">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={() => scroll(newsScrollRef, 'right')} className="w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all active:scale-90">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button onClick={() => loadMergedData()} disabled={isFetchingNews} className={`w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl shadow-lg transition-all ${isFetchingNews ? 'opacity-50' : 'hover:bg-blue-700'}`} title="Làm mới tin tức">
              <svg className={`w-5 h-5 ${isFetchingNews ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
              </svg>
            </button>
          </div>
        </div>

        {isFetchingNews && news.length === 0 ? (
          <div className="flex gap-6 overflow-hidden px-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0 w-[280px] h-[260px] bg-white/40 dark:bg-slate-800/40 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div ref={newsScrollRef} className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory no-scrollbar px-2 scroll-smooth">
            {news.map((item, idx) => (
              <a key={item.id || `news-${idx}`} href={item.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-[260px] sm:w-[300px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/80 dark:border-white/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 snap-start flex flex-col justify-between group/news">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800 uppercase tracking-tighter">{item.source}</span>
                    <span className="text-[8px] font-bold text-slate-400">{item.date || 'Gần đây'}</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2 line-clamp-3 min-h-[3rem] leading-tight group-hover/news:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{item.snippet}</p>
                </div>
                <div className="mt-4 flex items-center text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase gap-1">
                  Xem chi tiết bài viết <svg className="w-3 h-3 transition-transform group-hover/news:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* VIDEO CẢNH BÁO */}
      <div className="space-y-8 pt-12 border-t border-slate-100/50 dark:border-white/5">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3 uppercase">
              <span className="w-12 h-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/60 dark:border-white/5 text-red-600 dark:text-red-400 rounded-[1.2rem] flex items-center justify-center shadow-sm">🎬</span>
              Video Cảnh báo
            </h2>
            <p className="text-[10px] text-red-500 dark:text-red-400 font-black uppercase tracking-[0.2em] mt-2">Nội dung truyền thông: public.videos</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => scroll(videoScrollRef, 'left')} className="w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-red-600 hover:text-white transition-all active:scale-90">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={() => scroll(videoScrollRef, 'right')} className="w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-red-600 hover:text-white transition-all active:scale-90">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div ref={videoScrollRef} className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar px-2 scroll-smooth">
          {videos.map((video) => (
            <div key={video.id} className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white/70 dark:bg-slate-900/70 rounded-[2.5rem] border border-white/60 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 snap-start flex flex-col">
              <div className="relative h-44 cursor-pointer group bg-slate-200 dark:bg-slate-800 overflow-hidden" onClick={() => window.open(video.url, '_blank')}>
                <img src={video.thumbnail} alt={video.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-red-600 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.516 7.548c0-.923.651-1.623 1.393-2.235C7.392 4.09 9.513 3 12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9c-2.487 0-4.608-1.09-6.091-2.313-.742-.612-1.393-1.312-1.393-2.235V7.548zM6.516 7.548v8.904c0 .307.249.556.556.556.126 0 .248-.043.346-.121l7.123-4.452c.261-.163.34-.509.177-.77-.044-.07-.103-.129-.177-.177L7.418 7.13c-.261-.163-.607-.084-.77.177a.56.56 0 00-.132.241z" /></svg>
                  </div>
                </div>
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">{video.source}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white line-clamp-2 mb-2">{video.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed h-[2.75rem]">{video.description}</p>
                </div>
                <button onClick={() => window.open(video.url, '_blank')} className="mt-4 py-3 bg-red-600/10 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-inner">Xem ngay</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CHI TIẾT KỊCH BẢN */}
      {selectedScenario && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-in zoom-in-95 relative border border-white dark:border-white/5">
              <button onClick={() => setSelectedScenario(null)} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <div className="mb-8">
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-xl mb-4 inline-block">{selectedScenario.category}</span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{selectedScenario.title}</h3>
              </div>
              <div className="space-y-6">
                <div>
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Mô tả chi tiết</h4>
                   <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{selectedScenario.description}</p>
                </div>
                <div className="space-y-4">
                   <h4 className="text-[11px] font-black text-red-500 uppercase tracking-widest">Dấu hiệu nhận diện</h4>
                   <ul className="space-y-3">
                     {selectedScenario.signs.map((sign, i) => (
                       <li key={i} className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100/50 dark:border-red-900/30 flex gap-4">
                          <span className="w-5 h-5 bg-red-500 text-white rounded-lg flex items-center justify-center text-[10px] shrink-0">!</span>
                          <span className="text-sm font-bold text-red-900 dark:text-red-200 font-sans">{sign}</span>
                       </li>
                     ))}
                   </ul>
                </div>
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] border border-emerald-100 dark:border-emerald-800/50">
                   <h4 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                     Cách phòng tránh
                   </h4>
                   <p className="text-sm font-black text-emerald-900 dark:text-emerald-100 leading-relaxed font-sans">{selectedScenario.prevention}</p>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ScamLibrary;
