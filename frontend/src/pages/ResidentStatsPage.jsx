import React, { useState } from 'react';
import * as statisticsService from '../services/statisticsService';

const ResidentStatsPage = () => {
  const [filters, setFilters] = useState({
    area: '',
    gender: '',
    ageGroup: '',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleExportExcel = async () => {
    try {
      await statisticsService.exportResidentStatsToExcel(filters);
    } catch (error) {
      alert('Lỗi khi xuất file Excel.');
    }
  };

  const handleExportPdf = async () => {
    try {
      await statisticsService.exportResidentStatsToPdf(filters);
    } catch (error) {
      alert('Lỗi khi xuất file PDF.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await statisticsService.getResidentStats(filters);
      setResults(response.data);
    } catch (error) {
      alert('Lỗi truy vấn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-black text-white">Báo cáo Nhân khẩu</h1>
          <p className="text-dark-400 font-medium">Phân tích cơ cấu dân số, độ tuổi và giới tính của toàn cư xá.</p>
        </div>
      </header>

      <form className="glass-card p-8 rounded-3xl space-y-6 shadow-2xl" onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Vùng phân tích</label>
            <input name="area" value={filters.area} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="VD: Block A, Tầng..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Giới tính</label>
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="premium-input bg-dark-950/40">
              <option value="">Tất cả giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Nhóm độ tuổi</label>
            <select name="ageGroup" value={filters.ageGroup} onChange={handleFilterChange} className="premium-input bg-dark-950/40">
              <option value="">Tất cả độ tuổi</option>
              <option value="<18">Dưới 18 tuổi</option>
              <option value="18-35">18 - 35 tuổi</option>
              <option value="36-60">36 - 60 tuổi</option>
              <option value=">60">Trên 60 tuổi</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="submit" disabled={loading} className="premium-button-primary px-10">
            {loading ? 'Đang phân tích...' : 'Lập báo cáo thống kê'}
          </button>
        </div>
      </form>

      {results && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Summary Info */}
            <div className="xl:col-span-2 glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-primary-600/10 to-transparent">
              <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-primary-500/20">
                {results.count}
              </div>
              <div className="flex-1 space-y-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Quy mô nhân số tìm thấy</h3>
                <p className="text-dark-400 text-sm">Dựa trên các tiêu chí lọc hiện tại, hệ thống đã xác định được <span className="text-primary-400 font-bold">{results.count}</span> nhân khẩu đang cư trú hợp pháp.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleExportExcel} className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-all border border-emerald-500/20" title="Xuất Excel">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </button>
                <button onClick={handleExportPdf} className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/20" title="Xuất PDF">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /><path d="M9 9h1m0 4h1m0 4h1" /></svg>
                </button>
              </div>
            </div>

            {/* Additional Quick Stats Card */}
            <div className="glass-card p-8 rounded-3xl flex items-center justify-center bg-dark-900/50">
              <div className="text-center">
                <div className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-2">Tỷ lệ tăng trưởng</div>
                <div className="text-3xl font-outfit font-black text-white">+2.4%</div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase mt-1">Sát với dự báo</div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-[10px] font-black text-dark-500 uppercase tracking-widest">
                    <th className="px-8 py-5">Nhân khẩu</th>
                    <th className="px-8 py-5">Đặc điểm</th>
                    <th className="px-8 py-5">Ngày sinh</th>
                    <th className="px-8 py-5">Hộ khẩu trực thuộc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {results.data.map(res => (
                    <tr key={res.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <div className="text-white font-bold group-hover:text-primary-400 transition-colors">{res.fullName}</div>
                        <div className="text-[10px] text-dark-500 font-bold uppercase tracking-widest leading-none mt-1">{res.relationship || 'Cư dân'}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${res.gender === 'Nam' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'}`}>
                          {res.gender}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-dark-300">
                        {new Date(res.dateOfBirth).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-white font-bold tracking-tight">{res.Household?.householdCode || 'N/A'}</span>
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

export default ResidentStatsPage;