
import React, { useState, useEffect } from 'react';
import { ScamAlert, ScamScenario, CommunityReport } from '../types';
import { fetchLatestScamScenario } from '../services/geminiService';

interface NotificationCenterProps {
  onNewDiscovery?: (scenario: ScamScenario) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNewDiscovery }) => {
  const [alerts, setAlerts] = useState<ScamAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Tải thông báo cố định + báo cáo cộng đồng từ LocalStorage
    const localReports = JSON.parse(localStorage.getItem('lcs_reports') || '[]');
    const mappedReports: ScamAlert[] = localReports.map((r: any) => ({
      id: r.id.toString(),
      type: 'COMMUNITY',
      timestamp: r.timestamp,
      content: `👥 Cảnh báo cộng đồng: Đối tượng ${r.target} bị báo cáo: ${r.description.substring(0, 50)}...`
    }));

    setAlerts([
      { id: '1', type: 'URGENT', timestamp: '10:30', content: '🚨 Cảnh báo: Xuất hiện link giả mạo cổng thông tin Bộ Giáo dục.' },
      ...mappedReports
    ]);
  }, []);

  const updateAlertFromAI = async () => {
    setIsLoading(true);
    try {
      const newScenario = await fetchLatestScamScenario();
      const newAlert: ScamAlert = {
        id: newScenario.id,
        content: `🔍 Radar AI phát hiện: ${newScenario.title}. Hãy kiểm tra trong Thư viện!`,
        type: 'HOT',
        timestamp: 'Vừa xong'
      };
      setAlerts(prev => [newAlert, ...prev]);
      if (onNewDiscovery) onNewDiscovery({ ...newScenario, title: `[MỚI] ${newScenario.title}` });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button 
          onClick={updateAlertFromAI} 
          disabled={isLoading} 
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
             <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : '🤖 Quét Radar AI Thủ đoạn mới'}
        </button>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 && <p className="text-center text-xs text-slate-400 py-10">Chưa có thông báo mới.</p>}
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex gap-4 animate-in fade-in slide-in-from-right-4">
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-[8px] ${alert.type === 'COMMUNITY' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>{alert.type}</div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 mb-1">{alert.timestamp}</p>
              <p className="text-sm text-slate-700 font-medium leading-snug">{alert.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
