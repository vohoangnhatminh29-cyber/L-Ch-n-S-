
import React from 'react';
import { GOLDEN_RULES, RULES_6_NO } from '../constants';

const Skills: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* 3 Nguyên tắc vàng */}
      <div className="grid md:grid-cols-3 gap-4">
        {GOLDEN_RULES.map(rule => (
          <div key={rule.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="text-3xl mb-4">{rule.icon}</div>
            <h4 className="font-black text-slate-800 text-sm mb-2">{rule.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{rule.content}</p>
          </div>
        ))}
      </div>

      {/* Quy tắc 6 KHÔNG */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
          Quy tắc "6 KHÔNG" bảo vệ bản thân
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {RULES_6_NO.map((text, i) => (
            <div key={i} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-black text-sm shrink-0">!</div>
              <p className="text-xs font-bold text-slate-200">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cách phát hiện nhanh (Checklist) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 mb-6">Kỹ năng phát hiện Website giả mạo</h3>
        <div className="space-y-4">
          {[
            { q: "Kiểm tra URL", a: "Địa chỉ có sai chính tả không? (VD: g00gle thay vì google). Có ký tự lạ không?" },
            { q: "Chứng chỉ SSL", a: "Có biểu tượng ổ khóa và bắt đầu bằng https:// không?" },
            { q: "Độ tin cậy Domain", a: "Các đuôi .gov (chính phủ), .edu (giáo dục) có độ tin cậy cao hơn .xyz, .tk, .info." },
            { q: "Tín nhiệm mạng", a: "Website cơ quan nhà nước thường có nhãn Tín nhiệm mạng của Cục ATTT." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
              <div>
                <h5 className="text-sm font-black text-slate-800 mb-1">{item.q}</h5>
                <p className="text-xs text-slate-500 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
