import { useState } from 'react';
import { Search } from 'lucide-react';

export function RevenueView() {
  const [activeTimeFilter] = useState('month');
  
  const revenueData = [45, 52, 60, 55, 65, 78];
  const costData = [30, 33, 35, 32, 38, 45];
  const months = ['T9', 'T10', 'T11', 'T12', 'T1', 'T2'];

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
            defaultValue="01/02/2026"
            className="w-[130px] px-3 py-[7px] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs focus:border-[#16a34a] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Đến ngày"
            defaultValue="28/02/2026"
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
            <div className="text-[11px] text-[#94a3b8] mb-1">Tổng doanh thu tháng 2</div>
            <div className="text-[22px] font-[800] text-[#0f172a] mb-1">42,900,000đ</div>
            <div className="text-[11px] flex items-center gap-1 text-[#16a34a] font-semibold mb-1">
              ↑ +18% so tháng 1
            </div>
            <div className="text-[10px] text-[#94a3b8]">Mục tiêu: 40M ✅</div>
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
            <div className="text-[22px] font-[800] text-[#0f172a] mb-1">31,000,000đ</div>
            <div className="text-[11px] flex items-center gap-1 text-[#2563eb] font-semibold mb-1">
              ↑ +12% so tháng trước
            </div>
            <div className="text-[10px] text-[#94a3b8]">Tỉ suất: 72.3%</div>
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
            <div className="text-[22px] font-[800] text-[#0f172a] mb-1">8,200,000đ</div>
            <div className="text-[11px] flex items-center gap-1 text-[#d97706] font-semibold mb-1">
              ↑ +34% ⚠️ Cần chú ý
            </div>
            <div className="text-[10px] text-[#94a3b8]">19.1% / doanh thu</div>
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
            <div className="text-[22px] font-[800] text-[#0f172a] mb-1">3 giao dịch</div>
            <div className="text-[11px] flex items-center gap-1 text-[#dc2626] font-semibold mb-1">
              Tổng: 347,000đ
            </div>
            <div className="text-[10px] text-[#94a3b8]">Tỉ lệ hoàn tiền: 2.1%</div>
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

              {/* Cost Line (Dashed) */}
              <polyline
                points={costData.map((val, idx) => `${(idx / 5) * 100}%,${100 - val}%`).join(' ')}
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {costData.map((val, idx) => (
                <circle key={idx} cx={`${(idx / 5) * 100}%`} cy={`${100 - val}%`} r="4" fill="#d97706" />
              ))}
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
            <span className="text-[#16a34a] font-bold">Cao nhất: Tháng 2 · 42.9M</span>
            <span className="text-[#2563eb] font-medium">Tăng trưởng TB: +10.8%/tháng</span>
            <span className="text-[#d97706] font-medium">API ratio: 19.1%</span>
          </div>
        </div>

        {/* Right - Revenue by Source */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-[18px] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-[#475569] mb-4">Nguồn doanh thu</h3>

          <div className="space-y-2">
            {/* Row 1 */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
              <span className="flex-1 text-[12.5px] font-medium text-[#0f172a]">Tích Xanh Cơ Bản</span>
              <span className="text-[11px] text-[#94a3b8]">142 gói</span>
              <span className="text-[13px] font-bold text-[#16a34a]">14,058,000đ</span>
              <div className="w-[60px] h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div className="h-full bg-[#16a34a] rounded-full" style={{ width: '33%' }} />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
              <span className="flex-1 text-[12.5px] font-medium text-[#0f172a]">Tích Xanh Premium</span>
              <span className="text-[11px] text-[#94a3b8]">58 gói</span>
              <span className="text-[13px] font-bold text-[#16a34a]">17,342,000đ</span>
              <div className="w-[60px] h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div className="h-full bg-[#2563eb] rounded-full" style={{ width: '40%' }} />
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
              <span className="flex-1 text-[12.5px] font-medium text-[#0f172a]">Ghim tin 30 ngày</span>
              <span className="text-[11px] text-[#94a3b8]">34 tin</span>
              <span className="text-[13px] font-bold text-[#16a34a]">5,066,000đ</span>
              <div className="w-[60px] h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div className="h-full bg-[#0ea5e9] rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            {/* Row 4 */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d97706]" />
              <span className="flex-1 text-[12.5px] font-medium text-[#0f172a]">Ghim tin 7 ngày</span>
              <span className="text-[11px] text-[#94a3b8]">89 tin</span>
              <span className="text-[13px] font-bold text-[#16a34a]">4,361,000đ</span>
              <div className="w-[60px] h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div className="h-full bg-[#d97706] rounded-full" style={{ width: '10%' }} />
              </div>
            </div>

            {/* Row 5 */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#7c3aed]" />
              <span className="flex-1 text-[12.5px] font-medium text-[#0f172a]">Boost tin đăng</span>
              <span className="text-[11px] text-[#94a3b8]">27 tin</span>
              <span className="text-[13px] font-bold text-[#16a34a]">2,133,000đ</span>
              <div className="w-[60px] h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: '5%' }} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e2e8f0] my-3" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#0f172a]">Tổng cộng</span>
            <span className="text-[13px] font-bold text-[#16a34a]">42,960,000đ</span>
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
                {/* Row 1 */}
                <tr className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]">
                  <td className="px-3 py-2.5 text-[11px] font-mono text-[#475569]">#TXG-0291</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#dcfce7] text-[#16a34a] text-[9px] font-bold flex items-center justify-center">
                        NV
                      </div>
                      <span className="text-[11px] text-[#0f172a]">Nguyễn Văn A</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 bg-[#dbeafe] text-[#2563eb] rounded text-[10px] font-medium">
                      TX Premium
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-bold text-[#16a34a]">299,000đ</td>
                  <td className="px-3 py-2.5 text-[11px] text-[#475569]">22/02/2026</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] rounded-full text-[10px] font-medium">
                      <span className="w-1 h-1 rounded-full bg-current" />
                      Thành công
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]">
                  <td className="px-3 py-2.5 text-[11px] font-mono text-[#475569]">#GHM-0188</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#dbeafe] text-[#2563eb] text-[9px] font-bold flex items-center justify-center">
                        TT
                      </div>
                      <span className="text-[11px] text-[#0f172a]">Trần Thị Bảo</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 bg-[#ccfbf1] text-[#0ea5e9] rounded text-[10px] font-medium">
                      Ghim 30 ngày
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-bold text-[#16a34a]">149,000đ</td>
                  <td className="px-3 py-2.5 text-[11px] text-[#475569]">21/02/2026</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] rounded-full text-[10px] font-medium">
                      <span className="w-1 h-1 rounded-full bg-current" />
                      Thành công
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]">
                  <td className="px-3 py-2.5 text-[11px] font-mono text-[#475569]">#TXG-0290</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#fef3c7] text-[#d97706] text-[9px] font-bold flex items-center justify-center">
                        LM
                      </div>
                      <span className="text-[11px] text-[#0f172a]">Lê Minh Tuấn</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] rounded text-[10px] font-medium">
                      TX Cơ Bản
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-bold text-[#16a34a]">99,000đ</td>
                  <td className="px-3 py-2.5 text-[11px] text-[#475569]">20/02/2026</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fef3c7] text-[#d97706] rounded-full text-[10px] font-medium">
                      <span className="w-1 h-1 rounded-full bg-current" />
                      Chờ xử lý
                    </span>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]">
                  <td className="px-3 py-2.5 text-[11px] font-mono text-[#475569]">#GHM-0187</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#fee2e2] text-[#dc2626] text-[9px] font-bold flex items-center justify-center">
                        PH
                      </div>
                      <span className="text-[11px] text-[#0f172a]">Phạm Hải Đăng</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 bg-[#fef3c7] text-[#d97706] rounded text-[10px] font-medium">
                      Ghim 7 ngày
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-bold text-[#16a34a]">49,000đ</td>
                  <td className="px-3 py-2.5 text-[11px] text-[#475569]">19/02/2026</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fee2e2] text-[#dc2626] rounded-full text-[10px] font-medium">
                      <span className="w-1 h-1 rounded-full bg-current" />
                      Hoàn tiền
                    </span>
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-[#f8fafc]">
                  <td className="px-3 py-2.5 text-[11px] font-mono text-[#475569]">#TXG-0289</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#dcfce7] text-[#16a34a] text-[9px] font-bold flex items-center justify-center">
                        VQ
                      </div>
                      <span className="text-[11px] text-[#0f172a]">Võ Quang Minh</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 bg-[#dbeafe] text-[#2563eb] rounded text-[10px] font-medium">
                      TX Premium
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-bold text-[#16a34a]">299,000đ</td>
                  <td className="px-3 py-2.5 text-[11px] text-[#475569]">18/02/2026</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] rounded-full text-[10px] font-medium">
                      <span className="w-1 h-1 rounded-full bg-current" />
                      Thành công
                    </span>
                  </td>
                </tr>
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

          <div className="space-y-3">
            {/* Row 1 */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#94a3b8]">#1</span>
              <div className="flex-1">
                <div className="text-[12.5px] font-semibold text-[#0f172a]">Quận 9 / Thủ Đức</div>
                <div className="text-[10px] text-[#94a3b8]">312 chủ trọ</div>
              </div>
              <span className="text-[13px] font-bold text-[#16a34a]">18,400,000đ</span>
              <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#16a34a] rounded-full text-[10px] font-bold">43%</span>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#94a3b8]">#2</span>
              <div className="flex-1">
                <div className="text-[12.5px] font-semibold text-[#0f172a]">Bình Thạnh</div>
                <div className="text-[10px] text-[#94a3b8]">128 chủ trọ</div>
              </div>
              <span className="text-[13px] font-bold text-[#16a34a]">8,200,000đ</span>
              <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#16a34a] rounded-full text-[10px] font-bold">19%</span>
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#94a3b8]">#3</span>
              <div className="flex-1">
                <div className="text-[12.5px] font-semibold text-[#0f172a]">Tân Bình</div>
                <div className="text-[10px] text-[#94a3b8]">94 chủ trọ</div>
              </div>
              <span className="text-[13px] font-bold text-[#16a34a]">5,100,000đ</span>
              <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#16a34a] rounded-full text-[10px] font-bold">12%</span>
            </div>

            {/* Row 4 */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#94a3b8]">#4</span>
              <div className="flex-1">
                <div className="text-[12.5px] font-semibold text-[#0f172a]">Quận 4</div>
                <div className="text-[10px] text-[#94a3b8]">76 chủ trọ</div>
              </div>
              <span className="text-[13px] font-bold text-[#16a34a]">4,300,000đ</span>
              <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#16a34a] rounded-full text-[10px] font-bold">10%</span>
            </div>

            {/* Row 5 */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#94a3b8]">#5</span>
              <div className="flex-1">
                <div className="text-[12.5px] font-semibold text-[#0f172a]">Các quận khác</div>
                <div className="text-[10px] text-[#94a3b8]">132 chủ trọ</div>
              </div>
              <span className="text-[13px] font-bold text-[#16a34a]">6,960,000đ</span>
              <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#16a34a] rounded-full text-[10px] font-bold">16%</span>
            </div>
          </div>

          {/* Stacked Bar */}
          <div className="mt-4">
            <div className="h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#16a34a]" style={{ width: '43%' }} />
              <div className="bg-[#2563eb]" style={{ width: '19%' }} />
              <div className="bg-[#0ea5e9]" style={{ width: '12%' }} />
              <div className="bg-[#d97706]" style={{ width: '10%' }} />
              <div className="bg-[#94a3b8]" style={{ width: '16%' }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[9px] text-[#94a3b8]">Q9/TD</span>
              <span className="text-[9px] text-[#94a3b8]">Bình Thạnh</span>
              <span className="text-[9px] text-[#94a3b8]">Tân Bình</span>
              <span className="text-[9px] text-[#94a3b8]">Q4</span>
              <span className="text-[9px] text-[#94a3b8]">Khác</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Metrics Row */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-3.5 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-[#475569] mb-3">Chỉ số kinh doanh tháng 2</h3>
        <div className="grid grid-cols-6 divide-x divide-[#e2e8f0]">
          {/* Metric 1 */}
          <div className="text-center px-2">
            <div className="text-lg font-[800] text-[#16a34a] flex items-center justify-center gap-1">
              72.3% <span className="text-xs">✅</span>
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-1">Tỉ suất lợi nhuận</div>
          </div>

          {/* Metric 2 */}
          <div className="text-center px-2">
            <div className="text-lg font-[800] text-[#d97706] flex items-center justify-center gap-1">
              19.1% <span className="text-xs">✅</span>
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-1">Chi phí API / DT</div>
          </div>

          {/* Metric 3 */}
          <div className="text-center px-2">
            <div className="text-lg font-[800] text-[#2563eb] flex items-center justify-center gap-1">
              68% <span className="text-xs">✅</span>
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-1">Tỉ lệ gia hạn TX</div>
          </div>

          {/* Metric 4 */}
          <div className="text-center px-2">
            <div className="text-lg font-[800] text-[#16a34a]">
              51,000đ
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-1">Doanh thu TB/chủ trọ</div>
          </div>

          {/* Metric 5 */}
          <div className="text-center px-2">
            <div className="text-lg font-[800] text-[#16a34a] flex items-center justify-center gap-1">
              2.1% <span className="text-xs">✅</span>
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-1">Tỉ lệ hoàn tiền</div>
          </div>

          {/* Metric 6 */}
          <div className="text-center px-2">
            <div className="text-lg font-[800] text-[#16a34a] flex items-center justify-center gap-1">
              +18% <span className="text-xs">✅</span>
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-1">Tăng trưởng tháng</div>
          </div>
        </div>
      </div>
    </div>
  );
}
