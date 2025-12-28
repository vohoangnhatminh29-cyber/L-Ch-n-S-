
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { RESEARCH_DATA } from '../constants';

const ResearchStats: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Báo cáo Thực trạng Tin tặc
        </h2>
        <p className="text-slate-500 text-sm">Dựa trên khảo sát 1,000 công dân số (Gồm học sinh, người đi làm và người cao tuổi) về các hình thức lừa đảo 2024-2025.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="h-[300px]">
          <h3 className="text-sm font-semibold text-slate-600 mb-4 text-center">Tỉ lệ các loại hình lừa đảo phổ biến (%)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RESEARCH_DATA} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fontWeight: 600 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {RESEARCH_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[300px]">
          <h3 className="text-sm font-semibold text-slate-600 mb-4 text-center">Biểu đồ rủi ro không gian mạng</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={RESEARCH_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {RESEARCH_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h4 className="font-bold text-blue-800 mb-2">Đánh giá thực trạng</h4>
        <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li><strong>Đầu tư tài chính ảo</strong> đang bùng nổ mạnh mẽ nhắm vào người đi làm có dòng tiền rỗi.</li>
          <li><strong>Mạo danh cơ quan công vụ</strong> nhắm vào tâm lý sợ hãi, phổ biến ở người cao tuổi.</li>
          <li><strong>Lừa nạp thẻ game</strong> vẫn chiếm tỉ trọng cao đối với lứa tuổi học sinh, sinh viên.</li>
          <li>Việc áp dụng <strong>AI Lá Chắn Số</strong> giúp giảm 85% thời gian cần thiết để xác minh một tin nhắn lừa đảo.</li>
        </ul>
      </div>
    </div>
  );
};

export default ResearchStats;
