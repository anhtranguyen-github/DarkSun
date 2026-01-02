import React, { useState } from 'react';
import * as statisticsService from '../services/statisticsService';

const HouseholdStatsPage = () => {
  const [filters, setFilters] = useState({
    area: '',
    apartmentType: '',
    memberCount: '',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await statisticsService.getHouseholdStats(filters);
      setResults(response.data);
    } catch (error) {
      alert('Lỗi truy vấn.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      await statisticsService.exportHouseholdStatsToExcel(filters);
    } catch (error) {
      alert('Lỗi xuất file Excel.');
    }
  };

  const handleExportPdf = async () => {
    try {
      await statisticsService.exportHouseholdStatsToPdf(filters);
    } catch (error) {
      alert('Lỗi xuất file PDF.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-outfit font-black text-white">Chỉ số Hộ khẩu</h1>
        <p className="text-dark-400 font-medium tracking-wide">Phân tích mật độ cư trú và phân loại căn hộ theo tiêu chuẩn vận hành.</p>
      </header>

      <form className="glass-card p-8 rounded-3xl space-y-6 shadow-2xl" onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Khu vực / Tòa</label>
            <input name="area" value={filters.area} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="VD: Tòa S1, S2..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Cấu trúc căn hộ</label>
            <select name="apartmentType" value={filters.apartmentType} onChange={handleFilterChange} className="premium-input bg-dark-950/40">
              <option value="">Tất cả loại hình</option>
              <option value="Studio">Studio</option>
              <option value="1 phòng ngủ">1 Phòng Ngủ</option>
              <option value="2 phòng ngủ">2 Phòng Ngủ</option>
              <option value="3 phòng ngủ">3 Phòng Ngủ</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Số lượng thành viên</label>
            <input type="number" name="memberCount" value={filters.memberCount} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="Số người cư trú..." />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className="premium-button-primary px-10">
            {loading ? 'Đang truy xuất...' : 'Phân tích dữ liệu'}
          </button>
        </div>
      </form>

      {results && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Analytics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="glass-card p-8 rounded-3xl border-l-[6px] border-primary-500">
              <h4 className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-4">Tổng số hộ khẩu</h4>
              <div className="text-4xl font-outfit font-black text-white">{results.summary.householdCount}</div>
              <div className="text-[10px] text-primary-400 font-bold mt-1">Đơn vị: Hộ gia đình</div>
            </div>
            <div className="glass-card p-8 rounded-3xl border-l-[6px] border-emerald-500">
              <h4 className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-4">Tổng nhân khẩu</h4>
              <div className="text-4xl font-outfit font-black text-white">{results.summary.totalMemberCount}</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-1">Hệ số mật độ: {(results.summary.totalMemberCount / (results.summary.householdCount || 1)).toFixed(1)}</div>
            </div>
            <div className="md:col-span-2 glass-card p-8 rounded-3xl flex items-center justify-between bg-gradient-to-br from-primary-600/10 to-transparent">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Công cụ báo cáo</h4>
                <p className="text-xs text-dark-400 max-w-xs">Xuất dữ liệu đã phân tích ra các định dạng chuẩn để phục vụ lưu trữ văn bản.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleExportExcel} className="p-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </button>
                <button onClick={handleExportPdf} className="p-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl transition-all border border-rose-500/20 shadow-lg shadow-rose-500/5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /><path d="M9 9h1m0 4h1m0 4h1" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Data Table */}
          <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-[10px] font-black text-dark-500 uppercase tracking-widest">
                    <th className="px-8 py-5">Định danh Hộ khẩu</th>
                    <th className="px-8 py-5">Đại diện chủ hộ</th>
                    <th className="px-8 py-5">Vị trí địa lý</th>
                    <th className="px-8 py-5">Loại hình</th>
                    <th className="px-8 py-5 text-right">Nhân khẩu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {results.data.map(h => (
                    <tr key={h.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <span className="text-white font-black group-hover:text-primary-400 transition-colors uppercase tracking-widest font-outfit text-sm">{h.householdCode}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-white font-bold">{h.Owner?.fullName || 'N/A'}</div>
                      </td>
                      <td className="px-8 py-6 text-sm text-dark-400">
                        {h.address}
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-2 py-0.5 bg-dark-800 text-dark-400 rounded text-[9px] font-black uppercase tracking-tighter">{h.status === 'occupied' ? 'Đang ở' : 'Trống'}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-lg font-outfit font-black text-white">{h.count || 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdStatsPage;