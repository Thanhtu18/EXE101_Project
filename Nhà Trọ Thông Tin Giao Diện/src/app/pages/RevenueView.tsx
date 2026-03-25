import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, PieChart, Clock } from 'lucide-react';

export function RevenueView() {
  const [activeTimeFilter, setActiveTimeFilter] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/admin/revenue-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch revenue stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [API_BASE]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  const monthlyTrends = stats?.monthlyTrends || [];
  const revenueData = monthlyTrends.length > 0 
    ? monthlyTrends.map((t: any) => t.revenue) 
    : [0, 0, 0, 0, 0, 0];
  const months = monthlyTrends.length > 0
    ? monthlyTrends.map((t: any) => `T${t._id.month}`)
    : ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  
  // Since costData isn't in backend yet, we'll hide it or keep it at 0
  const costData = revenueData.map(() => 0); 

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#94a3b8]">Theo dõi doanh thu và chi phí vận hành</p>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl px-[18px] py-3 flex items-center gap-2.5">
        {/* Time Filter Tabs */}
        <button
          onClick={() => setActiveTimeFilter('today')}
          className={`px-3.5 py-[6px] rounded-[7px] text-xs font-semibold border transition-all ${
            activeTimeFilter === 'today'
              ? 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569]'
              : 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:bg-gray-50'
          }`}
        >
          Hôm nay
        </button>
        <button
          onClick={() => setActiveTimeFilter('week')}
          className={`px-3.5 py-[6px] rounded-[7px] text-xs font-semibold border transition-all ${
            activeTimeFilter === 'week'
              ? 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569]'
              : 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:bg-gray-50'
          }`}
        >
          Tuần này
        </button>
        <button
          onClick={() => setActiveTimeFilter('month')}
          className={`px-3.5 py-[6px] rounded-[7px] text-xs font-semibold border transition-all ${
            activeTimeFilter === 'month'
              ? 'bg-[#dcfce7] border-[#bbf7d0] text-[#16a34a]'
              : 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:bg-gray-50'
          }`}
        >
          Tháng này
        </button>
        <button
          onClick={() => setActiveTimeFilter('quarter')}
          className={`px-3.5 py-[6px] rounded-[7px] text-xs font-semibold border transition-all ${
            activeTimeFilter === 'quarter'
              ? 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569]'
              : 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:bg-gray-50'
          }`}
        >
          Quý
        </button>
        <button
          onClick={() => setActiveTimeFilter('year')}
          className={`px-3.5 py-[6px] rounded-[7px] text-xs font-semibold border transition-all ${
            activeTimeFilter === 'year'
              ? 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569]'
              : 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:bg-gray-50'
          }`}
        >
          Năm
        </button>

        {/* Right Side - Date Range */}
        <div className="ml-auto flex items-center gap-2.5">
          <input
            type="text"
            placeholder="Từ ngày"
            defaultValue={new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString('vi-VN')}
            className="w-[130px] px-3 py-[7px] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs focus:border-[#16a34a] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Đến ngày"
            defaultValue={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('vi-VN')}
            className="w-[130px] px-3 py-[7px] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs focus:border-[#16a34a] focus:outline-none"
          />
          <button className="px-3.5 py-[7px] bg-white border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#475569] hover:border-[#16a34a] hover:text-[#16a34a] transition-colors flex items-center gap-1.5">
            📤 Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3.5">
        {/* Card 1 - Total Revenue */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className="h-[3px] bg-gradient-to-r from-[#16a34a] to-[#22c55e]" />
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-[38px] h-[38px] rounded-full bg-[#dcfce7] flex items-center justify-center text-lg">
                💰
              </div>
            </div>
            <div className="text-[11px] text-[#94a3b8] mb-1">Tổng doanh thu hệ thống</div>
            <div className="text-[22px] font-[800] text-[#0f172a] mb-1">
              {(stats?.totalRevenue || 0).toLocaleString()}đ
            </div>
            <div className="text-[11px] flex items-center gap-1 text-[#475569] font-semibold mb-1">
              Dữ liệu thời gian thực
            </div>
            <div className="text-[10px] text-[#94a3b8]">Duyệt từ Tích Xanh & Ghim tin</div>
          </div>
        </div>

        {/* Card 2 - Net Profit */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className="h-[3px] bg-gradient-to-r from-[#2563eb] to-[#0ea5e9]" />
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-[38px] h-[38px] rounded-full bg-[#dbeafe] flex items-center justify-center text-lg">
                📈
              </div>
            </div>
            <div className="text-[11px] text-[#94a3b8] mb-1">Lợi nhuận ròng</div>
            <div className="text-[22px] font-[800] text-[#0f172a] mb-1">
              {(stats?.totalRevenue || 0).toLocaleString()}đ
            </div>
            <div className="text-[11px] flex items-center gap-1 text-[#2563eb] font-semibold mb-1">
              Dữ liệu thời gian thực
            </div>
            <div className="text-[10px] text-[#94a3b8]">Tỉ suất: 100% (Chưa tính chi phí)</div>
          </div>
        </div>

        {/* Card 3 - API Cost */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className="h-[3px] bg-gradient-to-r from-[#d97706] to-[#f59e0b]" />
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-[38px] h-[38px] rounded-full bg-[#fef3c7] flex items-center justify-center text-lg">
                🗺️
              </div>
            </div>
            <div className="text-[11px] text-[#94a3b8] mb-1">Chi phí Maps API</div>
            <div className="text-[22px] font-[800] text-[#0f172a] mb-1">0đ</div>
            <div className="text-[11px] flex items-center gap-1 text-[#d97706] font-semibold mb-1">
              ---
            </div>
            <div className="text-[10px] text-[#94a3b8]">0% / doanh thu</div>
          </div>
        </div>

        {/* Card 4 - Pending */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className="h-[3px] bg-gradient-to-r from-[#dc2626] to-[#ef4444]" />
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-[38px] h-[38px] rounded-full bg-[#fee2e2] flex items-center justify-center text-lg">
                ⏳
              </div>
            </div>
            <div className="text-[11px] text-[#94a3b8] mb-1">Chờ xử lý / Hoàn tiền</div>
            <div className="text-[22px] font-[800] text-[#0f172a] mb-1">0 giao dịch</div>
            <div className="text-[11px] flex items-center gap-1 text-[#dc2626] font-semibold mb-1">
              Tổng: 0đ
            </div>
            <div className="text-[10px] text-[#94a3b8]">Tỉ lệ hoàn tiền: 0%</div>
          </div>
        </div>
      </div>

      {/* Two Column - Chart + Revenue Source */}
      <div className="grid grid-cols-[1.5fr_1fr] gap-3.5">
        {/* Left - Revenue vs Cost Chart */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-[18px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase text-[#475569]">Doanh thu vs Chi phí</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                <span className="text-[11px] text-[#475569]">Doanh thu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#d97706]" />
                <span className="text-[11px] text-[#475569]">Chi phí API</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-[120px] mb-3">
            <svg className="w-full h-full">
              {/* Grid Lines */}
              <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#f1f5f9" strokeWidth="1" />

              {/* Revenue Line */}
              <polyline
                points={revenueData.map((val, idx) => `${(idx / 5) * 100}%,${100 - val}%`).join(' ')}
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
              />
              {revenueData.map((val, idx) => (
                <circle key={idx} cx={`${(idx / 5) * 100}%`} cy={`${100 - val}%`} r="4" fill="#16a34a" />
              ))}

              {/* Cost Line hidden as per "Remove mock data" rule if not in backend */}
            </svg>

            {/* X-axis Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
              {months.map((month, idx) => (
                <span key={idx} className="text-[11px] text-[#94a3b8]">{month}</span>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="pt-3 border-t border-[#e2e8f0] flex items-center gap-4 text-[11px]">
            <span className="text-[#16a34a] font-bold">Tổng doanh thu: {(stats?.totalRevenue || 0).toLocaleString()}đ</span>
            <span className="text-[#2563eb] font-medium">Giao dịch: {stats?.latestTransactions?.length || 0}</span>
          </div>
        </div>

        {/* Right - Revenue by Source */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-[18px] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-[#475569] mb-4">Nguồn doanh thu</h3>

          <div className="space-y-2">
            {Object.entries(stats?.revenueByPackage || {}).map(([key, value]: [string, any], idx) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#16a34a]' : idx === 1 ? 'bg-[#2563eb]' : 'bg-[#0ea5e9]'}`} />
                <span className="flex-1 text-[12.5px] font-medium text-[#0f172a] capitalize">{key}</span>
                <span className="text-[11px] text-[#94a3b8]">{value.count} gói</span>
                <span className="text-[13px] font-bold text-[#16a34a]">{value.amount.toLocaleString()}đ</span>
                <div className="w-[60px] h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${idx === 0 ? 'bg-[#16a34a]' : idx === 1 ? 'bg-[#2563eb]' : 'bg-[#0ea5e9]'}`} 
                    style={{ width: `${(value.amount / (stats.totalRevenue || 1)) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e2e8f0] my-3" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#0f172a]">Tổng cộng</span>
            <span className="text-[13px] font-bold text-[#16a34a]">{(stats?.totalRevenue || 0).toLocaleString()}đ</span>
            <span className="text-[11px] font-bold text-[#16a34a]">100%</span>
          </div>
        </div>
      </div>

      {/* Two Column Equal - Transactions + Revenue by Region */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Left - Transactions Table */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-[#e2e8f0] flex items-center gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm mã GD..."
                className="w-full h-9 pl-8 pr-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs focus:border-[#16a34a] focus:outline-none"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8]" />
            </div>
            <select className="h-9 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs">
              <option>Tất cả loại</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                  <th className="px-3 py-2.5 text-left text-[9px] font-bold uppercase text-[#94a3b8]">MÃ GD</th>
                  <th className="px-3 py-2.5 text-left text-[9px] font-bold uppercase text-[#94a3b8]">CHỦ TRỌ</th>
                  <th className="px-3 py-2.5 text-left text-[9px] font-bold uppercase text-[#94a3b8]">GÓI DỊCH VỤ</th>
                  <th className="px-3 py-2.5 text-left text-[9px] font-bold uppercase text-[#94a3b8]">SỐ TIỀN</th>
                  <th className="px-3 py-2.5 text-left text-[9px] font-bold uppercase text-[#94a3b8]">NGÀY</th>
                  <th className="px-3 py-2.5 text-left text-[9px] font-bold uppercase text-[#94a3b8]">TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.latestTransactions || []).map((tx: any) => (
                  <tr key={tx._id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]">
                    <td className="px-3 py-2.5 text-[11px] font-mono text-[#475569]">#{tx._id.substring(tx._id.length - 8).toUpperCase()}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#dcfce7] text-[#16a34a] text-[9px] font-bold flex items-center justify-center">
                          {tx.landlordId?.name?.substring(0, 2).toUpperCase() || "LL"}
                        </div>
                        <span className="text-[11px] text-[#0f172a]">{tx.landlordId?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 bg-[#dbeafe] text-[#2563eb] rounded text-[10px] font-medium">
                        {tx.packageType || "Tích Xanh"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[12px] font-bold text-[#16a34a]">{(tx.amount || 0).toLocaleString()}đ</td>
                    <td className="px-3 py-2.5 text-[11px] text-[#475569]">
                      {tx.completedAt ? new Date(tx.completedAt).toLocaleDateString() : "---"}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] rounded-full text-[10px] font-medium">
                        <span className="w-1 h-1 rounded-full bg-current" />
                        Thành công
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right - Revenue by Region */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-[18px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase text-[#475569]">Doanh thu theo khu vực</h3>
            <span className="text-[10px] text-[#94a3b8]">Tháng 2/2026</span>
          </div>

          <div className="flex flex-col items-center justify-center h-[200px] text-[#94a3b8]">
            <Search className="size-8 mb-2 opacity-20" />
            <p className="text-xs">Chưa có dữ liệu phân vùng</p>
          </div>
        </div>
      </div>

      {/* Business Metrics Row */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-3.5 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-[#475569] mb-3">Chỉ số kinh doanh tháng 2</h3>
        <div className="flex items-center justify-center p-8 text-[#94a3b8] text-xs">
          Đang tổng hợp dữ liệu từ hệ thống...
        </div>
      </div>
    </div>
  );
}
