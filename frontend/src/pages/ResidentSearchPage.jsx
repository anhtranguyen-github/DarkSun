import React, { useState } from 'react';
import * as residentService from '../services/residentService';

const RELATIONSHIP_OPTIONS = ['Chủ hộ', 'Vợ', 'Chồng', 'Con', 'Bố', 'Mẹ', 'Anh', 'Chị', 'Em', 'Ông', 'Bà', 'Cháu', 'Khác'];

const ResidentSearchPage = () => {
  const [filters, setFilters] = useState({
    fullName: '',
    householdCode: '',
    idCardNumber: '',
    relationship: '',
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    const hasFilter = Object.values(filters).some(val => val !== '');
    if (!hasFilter) {
      alert('Vui lòng nhập ít nhất một tiêu chí tìm kiếm.');
      return;
    }
    setLoading(true);
    try {
      const response = await residentService.getAllResidents(filters);
      setResults(response.data.data);
    } catch (error) {
      alert('Lỗi khi truy vấn dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (resident) => {
    setSelectedResident(resident);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-outfit font-black text-white">Tra cứu Nhân khẩu</h1>
        <p className="text-dark-400 font-medium tracking-wide">Tìm kiếm cư dân theo họ tên, số định danh hoặc mối quan hệ gia đình.</p>
      </header>

      {/* Filter Section */}
      <form className="glass-card p-8 rounded-3xl space-y-6 shadow-2xl" onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] ml-1">Họ và tên</label>
            <input name="fullName" value={filters.fullName} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="VD: Nguyễn Văn A" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] ml-1">Mã hộ khẩu</label>
            <input name="householdCode" value={filters.householdCode} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="HK-..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] ml-1">Số CCCD / CMND</label>
            <input name="idCardNumber" value={filters.idCardNumber} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="12 chữ số" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] ml-1">Quan hệ với chủ hộ</label>
            <select name="relationship" value={filters.relationship} onChange={handleFilterChange} className="premium-input bg-dark-950/40">
              <option value="">Tất cả quan hệ</option>
              {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-dark-900">{opt}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => setFilters({ fullName: '', householdCode: '', idCardNumber: '', relationship: '' })} className="px-6 py-3 text-dark-400 font-bold hover:text-white transition-colors uppercase tracking-widest text-xs">Đặt lại</button>
          <button type="submit" disabled={loading} className="premium-button-primary px-10">
            {loading ? 'Đang truy vấn...' : 'Tìm kiếm cư dân'}
          </button>
        </div>
      </form>

      {/* Results */}
      {results !== null && (
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <h3 className="text-dark-400 text-xs font-black uppercase tracking-[0.3em]">Kết quả: {results.length} nhân khẩu</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black text-dark-500 uppercase tracking-widest">
                  <th className="px-8 py-5">Họ và tên</th>
                  <th className="px-8 py-5">Hộ khẩu</th>
                  <th className="px-8 py-5">Ngày sinh</th>
                  <th className="px-8 py-5">Giới tính</th>
                  <th className="px-8 py-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.length > 0 ? results.map(res => (
                  <tr key={res.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-white font-bold group-hover:text-primary-400 transition-colors uppercase tracking-tight">{res.fullName}</span>
                        <span className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">{res.relationship}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-black uppercase">{res.Household?.householdCode || 'N/A'}</span>
                    </td>
                    <td className="px-8 py-6 text-sm text-dark-300">
                      {res.dateOfBirth ? new Date(res.dateOfBirth).toLocaleDateString('vi-VN') : '---'}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${res.gender === 'Nam' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'}`}>
                        {res.gender}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleViewDetails(res)}
                        className="text-primary-400 hover:text-white text-xs font-black uppercase tracking-widest border border-primary-500/30 hover:bg-primary-600 px-4 py-2 rounded-lg transition-all"
                      >
                        Hồ sơ chi tiết →
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-dark-500 font-bold uppercase tracking-widest">Không có dữ liệu phù hợp</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedResident && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl glass-card rounded-[2.5rem] overflow-hidden shadow-2xl animate-page-transition-enter-active">
            <div className="p-10 border-b border-white/5 bg-white/[0.03] flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.25rem] bg-primary-600 flex items-center justify-center shadow-2xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-outfit font-black text-white">{selectedResident.fullName}</h2>
                  <p className="text-primary-400 text-xs font-bold uppercase tracking-[0.3em]">Mã số: RES-{selectedResident.id.toString().padStart(5, '0')}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-dark-500 hover:text-white transition-colors bg-white/5 rounded-2xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-10 grid grid-cols-2 gap-8 bg-dark-900/50">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Hộ khẩu liên kết</span>
                <div className="text-white font-bold">{selectedResident.Household?.householdCode || 'Tự do'}</div>
                <div className="text-xs text-dark-400">{selectedResident.Household?.address || '---'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Mối quan hệ</span>
                <div className="text-white font-bold">{selectedResident.relationship}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Số CCCD / CMND</span>
                <div className="text-white font-mono font-bold tracking-widest">{selectedResident.idCardNumber || 'Chưa cập nhật'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Nghề nghiệp</span>
                <div className="text-white font-bold">{selectedResident.occupation || 'Tự do'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Ngày sinh</span>
                <div className="text-white font-bold">{new Date(selectedResident.dateOfBirth).toLocaleDateString('vi-VN')}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Giới tính</span>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${selectedResident.gender === 'Nam' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'}`}>
                  {selectedResident.gender}
                </span>
              </div>
            </div>
            <div className="p-8 border-t border-white/5 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Đóng hồ sơ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentSearchPage;