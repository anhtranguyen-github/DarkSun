import React, { useState } from 'react';
import * as householdService from '../services/householdService';
import * as residentService from '../services/residentService';

const HouseholdSearchPage = () => {
  const [filters, setFilters] = useState({
    householdCode: '',
    ownerName: '',
    address: '',
    apartmentType: '',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isByHouseholdVisible, setIsByHouseholdVisible] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [residentsInHousehold, setResidentsInHousehold] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await householdService.getAllHouseholds(filters);
      setResults(response.data.data);
    } catch (error) {
      alert('Lỗi khi truy vấn dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (household) => {
    setSelectedHousehold(household);
    setIsByHouseholdVisible(true);
    setModalLoading(true);
    try {
      const response = await residentService.getResidentsByHousehold(household.id);
      setResidentsInHousehold(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-outfit font-black text-white">Tra cứu Hộ khẩu</h1>
        <p className="text-dark-400 font-medium tracking-wide">Tìm kiếm thông tin định danh và lịch sử biến động cư dân theo căn hộ.</p>
      </header>

      {/* Filter Section */}
      <form className="glass-card p-8 rounded-3xl space-y-6 shadow-2xl" onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] ml-1">Mã hộ khẩu</label>
            <input name="householdCode" value={filters.householdCode} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="VD: HK-001" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] ml-1">Tên chủ hộ</label>
            <input name="ownerName" value={filters.ownerName} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="Nguyễn Văn A" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] ml-1">Địa chỉ / Tòa</label>
            <input name="address" value={filters.address} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="Tòa S1, S2..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] ml-1">Loại căn hộ</label>
            <select name="apartmentType" value={filters.apartmentType} onChange={handleFilterChange} className="premium-input bg-dark-950/40">
              <option value="">Tất cả các loại</option>
              <option value="Studio">Studio</option>
              <option value="1 phòng ngủ">1 PN</option>
              <option value="2 phòng ngủ">2 PN</option>
              <option value="3 phòng ngủ">3 PN</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => setFilters({ householdCode: '', ownerName: '', address: '', apartmentType: '' })} className="px-6 py-3 text-dark-400 font-bold hover:text-white transition-colors uppercase tracking-widest text-xs">Đặt lại bộ lọc</button>
          <button type="submit" disabled={loading} className="premium-button-primary px-10">
            {loading ? 'Đang truy vấn...' : 'Thực hiện tìm kiếm'}
          </button>
        </div>
      </form>

      {/* Results Table */}
      {results !== null && (
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-dark-400 text-xs font-black uppercase tracking-[0.3em]">Kết quả: {results.length} hộ khẩu</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black text-dark-500 uppercase tracking-widest">
                  <th className="px-8 py-5">Mã hộ / Chủ hộ</th>
                  <th className="px-8 py-5">Vị trí</th>
                  <th className="px-8 py-5">Loại hình</th>
                  <th className="px-8 py-5">Quy mô</th>
                  <th className="px-8 py-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.length > 0 ? results.map(h => (
                  <tr key={h.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-white font-bold group-hover:text-primary-400 transition-colors uppercase tracking-tight">{h.householdCode}</span>
                        <span className="text-xs text-dark-400 font-medium">Chủ hộ: {h.Owner?.fullName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-dark-300">
                      {h.address}
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-2 py-0.5 bg-dark-800 text-dark-300 rounded text-[10px] font-bold uppercase">{h.apartmentType}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-white font-mono font-bold">{h.Residents?.length || 0}</span>
                        <span className="text-[10px] text-dark-500 font-bold uppercase">Người</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleViewDetails(h)}
                        className="text-primary-400 hover:text-white text-xs font-black uppercase tracking-widest border border-primary-500/30 hover:bg-primary-600 px-4 py-2 rounded-lg transition-all"
                      >
                        Xem hồ sơ →
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

      {/* Detail Modal */}
      {isByHouseholdVisible && selectedHousehold && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/90 backdrop-blur-md" onClick={() => setIsByHouseholdVisible(false)}></div>
          <div className="relative w-full max-w-4xl glass-card rounded-[2.5rem] overflow-hidden shadow-2xl animate-page-transition-enter-active flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-white/5 bg-white/[0.03] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center shadow-2xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                <div className="space-y-1">
                  <h2 className="text-4xl font-outfit font-black text-white">{selectedHousehold.householdCode}</h2>
                  <p className="text-primary-400 text-xs font-black uppercase tracking-[0.3em]">Hồ sơ lưu trữ BlueMoon</p>
                </div>
              </div>
              <button onClick={() => setIsByHouseholdVisible(false)} className="p-3 text-dark-500 hover:text-white transition-colors bg-white/5 rounded-2xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
              {/* Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <section>
                  <h4 className="text-[10px] font-black text-dark-600 uppercase tracking-widest mb-3">Thông tin cốt lõi</h4>
                  <div className="space-y-1">
                    <div className="text-sm font-black text-white">{selectedHousehold.Owner?.fullName || 'N/A'}</div>
                    <div className="text-xs text-dark-400 font-medium">Chủ sở hữu pháp lý</div>
                  </div>
                </section>
                <section>
                  <h4 className="text-[10px] font-black text-dark-600 uppercase tracking-widest mb-3">Vị trí BĐS</h4>
                  <div className="space-y-1">
                    <div className="text-sm font-black text-white">{selectedHousehold.address}</div>
                    <div className="text-xs text-dark-400 font-medium">{selectedHousehold.apartmentType}</div>
                  </div>
                </section>
                <section>
                  <h4 className="text-[10px] font-black text-dark-600 uppercase tracking-widest mb-3">Thông số kỹ thuật</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-outfit font-black text-white">{selectedHousehold.area}</span>
                    <span className="text-xs text-dark-500 font-bold">m²</span>
                  </div>
                </section>
              </div>

              {/* Residents Management */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/5"></div>
                  <span className="text-[10px] font-black text-dark-500 uppercase tracking-[0.4em]">Quản trị nhân danh</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden border-white/5">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-[9px] font-black text-dark-600 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Tên thành viên</th>
                        <th className="px-6 py-4">Mối quan hệ</th>
                        <th className="px-6 py-4">Định danh CCCD</th>
                        <th className="px-6 py-4 text-center">Giới tính</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {modalLoading ? (
                        <tr><td colSpan="4" className="p-12 text-center animate-pulse text-dark-500 font-bold uppercase tracking-widest">Đang kết nối cơ sở dữ liệu...</td></tr>
                      ) : residentsInHousehold.map(res => (
                        <tr key={res.id} className="text-xs">
                          <td className="px-6 py-5 font-bold text-white">{res.fullName}</td>
                          <td className="px-6 py-5">
                            <span className="px-2 py-0.5 bg-primary-500/10 text-primary-400 rounded-md font-bold text-[10px]">{res.relationship}</span>
                          </td>
                          <td className="px-6 py-5 font-mono text-dark-400 tracking-wider">
                            {res.idCardNumber || 'Chưa định danh'}
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={res.gender === 'Nam' ? 'text-blue-400' : 'text-pink-400'}>{res.gender}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdSearchPage;