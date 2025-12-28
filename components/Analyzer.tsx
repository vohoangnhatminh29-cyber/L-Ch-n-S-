
import React, { useState, useRef, useEffect } from 'react';
import { analyzeContent } from '../services/geminiService';
import { AnalysisResult, RiskLevel } from '../types';

const Analyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [audio, setAudio] = useState<{data: string, name: string, mime: string} | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // States for reporting
  const [reportType, setReportType] = useState<'CALL' | 'SMS' | 'EMAIL' | 'COMMUNITY' | ''>('');
  const [reportTarget, setReportTarget] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleAction = async () => {
    if (!input.trim() && !image && !audio) return;
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeContent(
        input, 
        image || undefined, 
        audio?.data || undefined, 
        audio?.mime
      );
      setResult(analysis);
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi kết nối với AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setAudio({
          data: base64,
          name: file.name,
          mime: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const reportToCommunity = () => {
    // Truy cập trực tiếp vào nhóm Facebook theo yêu cầu
    window.open("https://www.facebook.com/share/g/1AVJhj6Hr7/", "_blank");
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('antispam@vncert.vn');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendReport = () => {
    if (reportType === 'COMMUNITY') {
      reportToCommunity();
      return;
    }

    if (!reportTarget.trim()) return alert("Vui lòng nhập số điện thoại hoặc email đối tượng!");
    
    if (reportType === 'CALL') {
      const smsContent = `LD ${reportTarget} ${reportDesc}`;
      window.location.href = `sms:156?body=${encodeURIComponent(smsContent)}`;
    } else if (reportType === 'SMS') {
      const smsContent = `S ${reportTarget} ${reportDesc}`;
      window.location.href = `sms:5656?body=${encodeURIComponent(smsContent)}`;
    } else if (reportType === 'EMAIL') {
      const emailSubject = `Báo cáo lừa đảo từ Lá Chắn Số: ${reportTarget}`;
      const emailBody = `Đối tượng phản ánh: ${reportTarget}\nNội dung lừa đảo: ${reportDesc}\n\n(Báo cáo được khởi tạo từ ứng dụng Lá Chắn Số)`;
      const mailtoLink = `mailto:antispam@vncert.vn?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      const tempLink = document.createElement('a');
      tempLink.href = mailtoLink;
      tempLink.click();
    }
  };

  const handleContactAdmin = () => {
    // Địa chỉ email admin mới: adlcsahn@gmail.com
    const adminEmail = 'adlcsahn@gmail.com';
    window.location.href = `mailto:${adminEmail}?subject=${encodeURIComponent("Thắc mắc về ứng dụng Lá Chắn Số")}`;
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="glass-card pattern-dots rounded-[3rem] shadow-[10px_10px_25px_#cbd5e1,-10px_-10px_25px_#ffffff] p-8 border border-white/50 relative overflow-hidden dark:shadow-none">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="mb-8 relative z-10">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Kiểm tra an toàn</h2>
        </div>
        
        <div className="relative z-10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nội dung nghi vấn"
            className="w-full h-40 p-6 neumorph-inset bg-white/40 dark:bg-slate-800/40 border-none rounded-[2rem] mb-6 text-base font-medium text-slate-700 dark:text-slate-100 backdrop-blur-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600 font-sans"
          />
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className={`flex flex-col items-center justify-center p-4 rounded-[2rem] border transition-all duration-300 group ${image ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-200' : 'neumorph-btn bg-white/60 dark:bg-slate-800/60 border-white/80 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-700'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 ${image ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-blue-500 shadow-sm'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <span className={`text-[11px] font-black uppercase tracking-widest ${image ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>Gửi hình ảnh</span>
            </button>

            <button 
              type="button" 
              onClick={() => audioInputRef.current?.click()} 
              className={`flex flex-col items-center justify-center p-4 rounded-[2rem] border transition-all duration-300 group ${audio ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-200' : 'neumorph-btn bg-white/60 dark:bg-slate-800/60 border-white/80 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-700'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 ${audio ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-blue-500 shadow-sm'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z"/></svg>
              </div>
              <span className={`text-[11px] font-black uppercase tracking-widest ${audio ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>Gửi ghi âm</span>
            </button>
          </div>
        </div>

        <input type="file" ref={fileInputRef} onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
          }
        }} accept="image/*" className="hidden" />
        
        <input type="file" ref={audioInputRef} onChange={handleAudioUpload} accept="audio/*" className="hidden" />
        
        <div className="flex flex-wrap gap-4 mb-6">
          {image && (
            <div className="relative animate-in zoom-in-95 group">
              <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-2xl -z-10"></div>
              <img src={image} alt="Bằng chứng" className="h-28 w-28 object-cover rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl" />
              <button onClick={() => setImage(null)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-all active:scale-90">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
          
          {audio && (
            <div className="relative animate-in zoom-in-95 bg-white/80 dark:bg-slate-800/80 border border-blue-100 dark:border-blue-900 rounded-2xl p-4 flex items-center gap-4 shadow-xl pr-12">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-blue-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Tệp ghi âm</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate max-w-[120px]">{audio.name}</p>
              </div>
              <button onClick={() => setAudio(null)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={handleAction}
          disabled={loading || (!input.trim() && !image && !audio)}
          className="w-full py-5 bg-blue-600 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {loading ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="relative z-10">Đang tiến hành phân tích...</span>
            </>
          ) : <span className="relative z-10">Kiểm tra an toàn ngay</span>}
        </button>
      </div>

      {result && (
        <div className={`p-8 rounded-[3rem] border-2 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 backdrop-blur-xl ${result.riskLevel === RiskLevel.HIGH ? 'bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-950 dark:text-red-50 shadow-red-100' : 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-50 shadow-emerald-100'}`}>
          <div className="flex items-center justify-between mb-6">
            <span className={`px-6 py-2 rounded-full text-xs font-black tracking-widest text-white shadow-lg ${result.riskLevel === RiskLevel.HIGH ? 'bg-red-600 shadow-red-200' : 'bg-emerald-600 shadow-emerald-200'}`}>
              RỦI RO: {result.riskLevel} {result.riskLevel === RiskLevel.HIGH ? '🚨' : '✅'}
            </span>
          </div>
          <div className="mb-6">
            <p className="text-base font-bold leading-relaxed font-sans">{result.explanation}</p>
          </div>
          
          {result.patternsFound.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {result.patternsFound.map((p, i) => (
                <span key={i} className={`text-[10px] font-black uppercase bg-white/70 dark:bg-black/20 border border-current/10 px-4 py-1.5 rounded-xl shadow-sm ${result.riskLevel === RiskLevel.HIGH ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                  🔍 {p}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <p className={`text-[10px] font-black uppercase mb-4 tracking-[0.2em] px-1 ${result.riskLevel === RiskLevel.HIGH ? 'text-red-800 dark:text-red-200' : 'text-emerald-800 dark:text-emerald-200'}`}>Lược đồ xử lý từ Lá Chắn Số:</p>
            {result.recommendations.map((r, i) => (
              <div key={i} className="text-sm bg-white/80 dark:bg-white/10 p-4 rounded-2xl border border-white/50 dark:border-white/5 font-bold flex gap-4 shadow-sm font-sans hover:translate-x-1 transition-transform dark:text-white">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] shrink-0 shadow-md">🛡️</span> {r}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trung tâm Báo cáo */}
      <div className="bg-[#0f172a] rounded-[2.5rem] p-6 text-white shadow-2xl relative border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-red-500 shadow-inner border border-white/5">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M14.4 6L13.6 4H5V21H7V14H12.6L13.4 16H21V6H14.4Z"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">TRUNG TÂM BÁO CÁO</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gửi phản ánh đến cơ quan chức năng VNCERT/CC</p>
            </div>
          </div>
          <a href="tel:0593505999" className="flex items-center gap-3 bg-[#311b22] border border-red-900/30 px-5 py-2.5 rounded-2xl text-[#f87171] hover:bg-red-900/20 transition-all shadow-lg active:scale-95">
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.405 5.405l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
             <span className="text-xs font-black uppercase tracking-wider">Hotline: 0593 505 999</span>
          </a>
        </div>
        
        {/* Type selection grid */}
        <div className="space-y-4 mb-8 relative z-10">
          <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">LOẠI HÌNH PHẢN ÁNH</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'CALL', label: 'Cuộc gọi lừa đảo', icon: (
                <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.82 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              ) },
              { id: 'SMS', label: 'Tin nhắn lừa đảo', icon: (
                <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
              ) },
              { id: 'EMAIL', label: 'Email lừa đảo', icon: (
                <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              ) },
              { id: 'COMMUNITY', label: 'Báo cộng đồng', icon: (
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
              ) }
            ].map(type => (
              <button 
                key={type.id}
                onClick={() => setReportType(prev => prev === type.id ? '' : (type.id as any))}
                className={`p-5 h-32 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 ${reportType === type.id ? 'bg-red-600 border-white shadow-xl' : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                <div className="mb-1">{type.icon}</div>
                <span className="text-[11px] font-bold text-center leading-tight">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Community Report Detail */}
        {reportType === 'COMMUNITY' && (
          <div className="mt-8 space-y-4 animate-in slide-in-from-top-6 duration-500 relative z-10 bg-black/20 p-6 rounded-3xl border border-white/5 text-center">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/20">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
            </div>
            <h4 className="text-white font-black text-base mb-1 uppercase tracking-tight">Cộng đồng Lá Chắn Số</h4>
            <p className="text-slate-400 text-xs font-medium mb-6 px-4 leading-relaxed">Tham gia cùng hàng nghìn thành viên để cùng nhau tố giác và cảnh báo lừa đảo.</p>
            
            <button 
              onClick={reportToCommunity} 
              className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-xl transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] bg-blue-600 hover:bg-blue-700 shadow-blue-900/40"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
              Đăng bài trên Cộng đồng Lá Chắn Số
            </button>
            <p className="text-[10px] text-red-400 font-bold mt-4 italic leading-relaxed bg-red-950/20 p-4 rounded-2xl border border-red-900/30">
              * Nhấn nút trên để tham gia và đăng cảnh báo tại Group Facebook chính thức của dự án.
            </p>
          </div>
        )}

        {/* Detail report inputs */}
        {reportType && reportType !== 'COMMUNITY' && (
          <div className="mt-8 space-y-6 animate-in slide-in-from-top-6 duration-500 relative z-10 bg-black/20 p-6 rounded-3xl border border-white/5">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                {reportType === 'EMAIL' ? 'Email đối tượng' : 'Số điện thoại đối tượng'}
              </label>
              <input 
                type="text" 
                value={reportTarget} 
                onChange={(e) => setReportTarget(e.target.value)}
                className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/30 text-white backdrop-blur-md transition-all font-sans placeholder:text-slate-600 shadow-inner" 
                placeholder={reportType === 'EMAIL' ? "Ví dụ: scam@domain.com" : "Ví dụ: 09xx..., +22x..."}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Mô tả nội dung lừa đảo</label>
              <textarea 
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-sm font-medium h-32 outline-none focus:ring-2 focus:ring-red-500/30 resize-none text-white backdrop-blur-md transition-all font-sans placeholder:text-slate-600 shadow-inner"
                placeholder="Mô tả tóm tắt hành vi..."
              />
            </div>

            <button 
              onClick={handleSendReport} 
              className="w-full py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] bg-red-600 hover:bg-red-700 shadow-red-900/40"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
              Xác nhận & Gửi báo cáo ngay
            </button>
          </div>
        )}

        {/* Action area */}
        <div className="grid md:grid-cols-2 gap-4 relative z-10 pt-8 border-t border-white/5 mt-8">
          <button 
            onClick={() => window.open("https://nospam.vncert.vn/", "_blank")}
            className="group flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all text-left"
          >
            <div>
              <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1">TRANG CHỦ VNCERT</h4>
              <p className="text-[10px] text-slate-400 font-bold">Báo cáo qua Website (Khuyên dùng)</p>
            </div>
            <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>

          <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl relative">
            <div className="flex-1">
              <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1">ĐỊA CHỈ EMAIL CỦA VNCERT</h4>
              <p className="text-xs font-bold text-white tracking-wide">antispam@vncert.vn</p>
            </div>
            <div className="flex gap-2">
              <button onClick={copyEmailToClipboard} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all text-slate-400 hover:text-white border border-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              </button>
              <a href="mailto:antispam@vncert.vn" className="w-10 h-10 bg-[#064e3b] rounded-xl flex items-center justify-center hover:bg-[#065f46] transition-all text-emerald-400 border border-emerald-900/30">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
            {copiedEmail && <div className="absolute -top-10 right-0 bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-bottom-2">Đã chép!</div>}
          </div>
        </div>
      </div>

      {/* Admin Contact Section */}
      <div className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/60 dark:border-white/5 shadow-xl inline-block w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl -ml-10 -mb-10"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-100 dark:border-slate-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2v10a2 2 0 00-2 2z"/>
              </svg>
            </div>
            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight">Gặp thắc mắc?</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-8 max-w-md mx-auto leading-relaxed">Nếu bạn cần hỗ trợ kỹ thuật hoặc có bất kỳ câu hỏi nào về ứng dụng Lá Chắn Số, hãy liên hệ ngay với quản trị viên.</p>
            <button 
              onClick={handleContactAdmin} 
              className="group inline-flex items-center gap-4 px-10 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-blue-700 transition-all shadow-2xl active:scale-95 border border-white/10"
            >
              Gửi Email cho Admin
              <svg className="w-4 h-4 text-blue-400 dark:text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
