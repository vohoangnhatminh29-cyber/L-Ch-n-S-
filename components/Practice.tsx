
import React, { useState, useEffect } from 'react';
import { PRACTICE_QUESTIONS } from '../constants';
import { Question } from '../types';
import Skills from './Skills';

interface PracticeProps {
  user: any;
  onLogin: () => void;
}

const Practice: React.FC<PracticeProps> = ({ user, onLogin }) => {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const startLevel = (level: 1 | 2 | 3) => {
    const pool = PRACTICE_QUESTIONS.filter(q => q.level === level);
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10).map(q => {
      const originalCorrectValue = q.options[q.correct];
      const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());
      const newCorrectIdx = shuffledOptions.indexOf(originalCorrectValue);
      return {
        ...q,
        options: shuffledOptions,
        correct: newCorrectIdx
      };
    });
    setSessionQuestions(shuffled);
    setSelectedLevel(level);
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsFinished(false);
  };

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === sessionQuestions[currentIdx].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < sessionQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const getLevelName = (l: number) => {
    if (l === 1) return "Khiên Giấy";
    if (l === 2) return "Khiên Bạc";
    return "Khiên Vàng";
  };

  const getLevelIcon = (l: number) => {
    if (l === 1) return "📄";
    if (l === 2) return "🥈";
    return "🥇";
  };

  const isPassed = () => {
    if (selectedLevel === 1) return score >= 8;
    return score === 10;
  };

  if (!selectedLevel) {
    return (
      <div className="space-y-8 pb-12 animate-in fade-in duration-500">
        <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <h2 className="text-3xl font-black mb-3">Đấu trường Khiên số</h2>
          <p className="text-sm font-bold opacity-90 max-w-md">Lựa chọn cấp độ để kiểm tra kỹ năng phòng chống tội phạm mạng của bạn. Chỉ những người xuất sắc nhất mới sở hữu Khiên Vàng.</p>
        </div>

        <div className="grid gap-6">
          {[1, 2, 3].map((l) => (
            <button 
              key={l}
              onClick={() => startLevel(l as any)}
              className="group bg-white dark:bg-slate-900 rounded-[2rem] p-6 border-2 border-slate-100 dark:border-white/5 hover:border-blue-500 hover:shadow-xl transition-all text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-inner group-hover:bg-blue-50 dark:group-hover:bg-blue-900 transition-colors">
                  {getLevelIcon(l)}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white">Cấp độ {l}: {getLevelName(l)}</h4>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                    Yêu cầu: Đúng {l === 1 ? '8/10' : '10/10'} câu để đạt
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
             <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Kỹ năng Phòng tránh Thực tế</h3>
          </div>
          <Skills />
        </div>
      </div>
    );
  }

  if (isFinished) {
    const passed = isPassed();
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-white/5 text-center space-y-8 animate-in zoom-in-95">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto shadow-2xl ${passed ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {passed ? '🏆' : '⚠️'}
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
            {passed ? 'Chúc mừng bạn!' : 'Cố gắng thêm chút nữa'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold">
            Bạn đã hoàn thành thử thách <b>{getLevelName(selectedLevel)}</b> với số điểm:
          </p>
          <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mt-4">{score}/10</div>
        </div>

        <div className={`p-6 rounded-[2rem] border-2 font-bold text-sm ${passed ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-100' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-700 dark:text-red-100'}`}>
          {passed 
            ? `Tuyệt vời! Bạn đã chính thức đạt yêu cầu kỹ năng của ${getLevelName(selectedLevel)}.` 
            : `Rất tiếc, yêu cầu để đạt ${getLevelName(selectedLevel)} là ${selectedLevel === 1 ? '8/10' : '10/10'}. Hãy ôn tập lại Thư viện và thử lại nhé!`}
        </div>

        {/* Login to save achievement notification */}
        {passed && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-300 fill-mode-both">
            {!user ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-800 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-200 dark:shadow-none">🎖️</div>
                  <p className="text-xs font-black text-blue-800 dark:text-blue-200 uppercase tracking-tight text-left leading-tight">Đăng nhập để lưu thành tích vào hồ sơ và tích Khiên {getLevelName(selectedLevel)}!</p>
                </div>
                <button 
                  onClick={onLogin}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Đăng nhập để tích Khiên
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Thành tích đã được lưu vào hồ sơ công dân số!</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => setSelectedLevel(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black shadow-sm active:scale-95 transition-all">Quay lại</button>
          <button onClick={() => startLevel(selectedLevel)} className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 active:scale-95 transition-all">Luyện tập lại</button>
        </div>
      </div>
    );
  }

  const q = sessionQuestions[currentIdx];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="bg-blue-600 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setSelectedLevel(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">
            Cấp độ: {getLevelName(selectedLevel)}
          </span>
        </div>
        <div className="flex gap-1.5">
          {sessionQuestions.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-all ${i === currentIdx ? 'bg-white' : i < currentIdx ? 'bg-emerald-400' : 'bg-blue-900/40'}`}></div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-white/5 space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em]">Câu hỏi {currentIdx + 1}/10</span>
          <h3 className="text-xl font-black text-slate-800 dark:text-white leading-relaxed">{q.question}</h3>
        </div>

        <div className="grid gap-4">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showExplanation}
              className={`w-full text-left p-5 rounded-[1.5rem] border-2 transition-all font-bold text-sm flex items-center gap-4 ${
                showExplanation
                  ? i === q.correct
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-100 shadow-md'
                    : i === selectedOption
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-100'
                      : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-white/5 text-slate-300 dark:text-slate-600'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-50 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 shadow-sm'
              }`}
            >
              <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center border-2 font-black text-xs transition-colors ${
                showExplanation && i === q.correct ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 leading-tight">{opt}</span>
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="animate-in slide-in-from-top-4 space-y-6 pt-4 border-t border-slate-50 dark:border-white/5">
            <div className={`p-6 rounded-[2rem] border-2 ${selectedOption === q.correct ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{selectedOption === q.correct ? '✅' : '❌'}</span>
                <p className={`text-[11px] font-black uppercase tracking-widest ${selectedOption === q.correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{selectedOption === q.correct ? 'Chính xác' : 'Cần lưu ý'}</p>
              </div>
              <p className="text-sm font-bold leading-relaxed text-slate-700 dark:text-slate-200 font-sans">{q.explanation}</p>
            </div>
            <button 
              onClick={handleNext} 
              className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black dark:hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {currentIdx === sessionQuestions.length - 1 ? 'Xem kết quả cuối cùng' : 'Câu tiếp theo'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
