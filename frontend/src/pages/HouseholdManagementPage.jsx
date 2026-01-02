import React, { useState, useEffect, useCallback } from 'react';
import * as householdService from '../services/householdService';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const HouseholdManagementPage = () => {
  const { user } = useAuth();
  const userRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const canEdit = userRoles.includes('admin') || userRoles.includes('to_truong') || userRoles.includes('to_pho');

  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHousehold, setCurrentHousehold] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    householdCode: '',
    ownerName: '',
    address: ''
  });

  const [formData, setFormData] = useState({
    householdCode: '',
    addressStreet: '',
    addressWard: 'Phường 1',
    addressDistrict: 'Quận 1',
    area: '',
    owner: {
      fullName: '',
      idCardNumber: '',
      dateOfBirth: '',
      gender: 'Nam',
      phoneNumber: ''
    }
  });

  const fetchHouseholds = useCallback(async () => {
    try {
      setLoading(true);
      const response = await householdService.getAllHouseholds(filters);
      setHouseholds(response.data.data);
      setError('');
    } catch (err) {
      setError('Không thể kết nối đến máy chủ để tải dữ liệu hộ khẩu.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHouseholds();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchHouseholds]);

  const handleOpenModal = (household = null) => {
    if (household) {
      setCurrentHousehold(household);
      setFormData({
        householdCode: household.householdCode,
        addressStreet: household.addressStreet || '',
        addressWard: household.addressWard || 'Phường 1',
        addressDistrict: household.addressDistrict || 'Quận 1',
        area: household.area || '',
        owner: {
          fullName: household.Owner?.fullName || '',
          idCardNumber: household.Owner?.idCardNumber || '',
          dateOfBirth: household.Owner?.dateOfBirth?.split('T')[0] || '',
          gender: household.Owner?.gender || 'Nam',
          phoneNumber: household.Owner?.phoneNumber || ''
        }
      });
    } else {
      setCurrentHousehold(null);
      setFormData({
        householdCode: '',
        addressStreet: '',
        addressWard: 'Phường 1',
        addressDistrict: 'Quận 1',
        area: '',
        owner: {
          fullName: '',
          idCardNumber: '',
          dateOfBirth: '',
          gender: 'Nam',
          phoneNumber: ''
        }
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('owner.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        owner: { ...prev.owner, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentHousehold) {
        // Update logic (simplified for address/area)
        await householdService.updateHousehold(currentHousehold.id, formData);
      } else {
        await householdService.createHousehold(formData);
      }
      setIsModalOpen(false);
      fetchHouseholds();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa hộ khẩu và toàn bộ nhân khẩu liên quan?')) {
      try {
        await householdService.deleteHousehold(id);
        fetchHouseholds();
      } catch (err) {
        alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-black text-white">Quản lý Hộ khẩu</h1>
          <p className="text-dark-400 font-medium">Danh sách và thông tin chi tiết các hộ gia đình trong chung cư.</p>
        </div>
        {canEdit && (
          <button
            onClick={() => handleOpenModal()}
            className="premium-button-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            Tạo Hộ Khẩu Mới
          </button>
        )}
      </header>

      {/* Filters */}
      <div className="glass-card p-6 rounded-2xl flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-bold text-dark-500 ml-1">Tìm theo mã hộ</label>
          <input
            className="premium-input bg-dark-950/30 py-2"
            placeholder="VD: HK-101..."
            value={filters.householdCode}
            onChange={(e) => setFilters({ ...filters, householdCode: e.target.value })}
          />
        </div>
        <div className="flex-1 min-w-[200px] space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-bold text-dark-500 ml-1">Họ tên chủ hộ</label>
          <input
            className="premium-input bg-dark-950/30 py-2"
            placeholder="Nhập tên..."
            value={filters.ownerName}
            onChange={(e) => setFilters({ ...filters, ownerName: e.target.value })}
          />
        </div>
        <button
          onClick={() => setFilters({ householdCode: '', ownerName: '', address: '' })}
          className="h-11 px-4 text-dark-400 hover:text-white transition-colors"
        >
          Đặt lại
        </button>
      </div>

      {/* Table Area */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="glass-card rounded-2xl overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5">Mã Hộ</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5">Chủ Hộ</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5">Địa Chỉ</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5">Diện Tích</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5 text-center px-6">Thành viên</th>
                {canEdit && <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5 text-right whitespace-nowrap">Hành động</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="p-4"><div className="h-4 bg-white/5 rounded"></div></td>
                    ))}
                  </tr>
                ))
              ) : households.length > 0 ? (
                households.map(h => (
                  <tr key={h.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4"><span className="px-2 py-1 bg-primary-500/10 text-primary-400 rounded-md font-bold text-xs">{h.householdCode}</span></td>
                    <td className="p-4 font-bold text-dark-100">{h.Owner?.fullName || 'N/A'}</td>
                    <td className="p-4 text-sm text-dark-400">{h.addressStreet}, {h.addressWard}</td>
                    <td className="p-4 text-sm text-dark-100">{h.area ? `${h.area} m²` : '---'}</td>
                    <td className="p-4 text-sm font-bold text-dark-400 text-center">{h.memberCount}</td>
                    {canEdit && (
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(h)}
                            className="p-2 text-dark-500 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          </button>
                          <button
                            onClick={() => handleDelete(h.id)}
                            className="p-2 text-dark-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-dark-500 font-medium">Không tìm thấy hộ khẩu nào phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}></div>

          <div className="relative w-full max-w-2xl glass-card rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-page-transition-enter-active">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-outfit font-bold">{currentHousehold ? 'Sửa thông tin Hộ khẩu' : 'Thêm Hộ khẩu mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-dark-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form className="p-8 space-y-8 overflow-y-auto custom-scrollbar" onSubmit={handleSubmit}>
              {/* Section 1: Household Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest border-l-2 border-primary-500 pl-3">1. Thông tin Hộ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-dark-400 uppercase ml-1">Mã hộ khẩu*</label>
                    <input
                      name="householdCode"
                      value={formData.householdCode}
                      onChange={handleInputChange}
                      placeholder="HK-..."
                      className="premium-input bg-dark-950/40"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-dark-400 uppercase ml-1">Diện tích (m²)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="premium-input bg-dark-950/40"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-dark-400 uppercase ml-1">Số nhà / Đường*</label>
                    <input
                      name="addressStreet"
                      value={formData.addressStreet}
                      onChange={handleInputChange}
                      placeholder="VD: P.402, Chung cư BlueMoon"
                      className="premium-input bg-dark-950/40"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Owner Info */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest border-l-2 border-primary-500 pl-3">2. Thông tin Chủ Hộ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-dark-400 uppercase ml-1">Họ và tên chủ hộ*</label>
                    <input
                      name="owner.fullName"
                      value={formData.owner.fullName}
                      onChange={handleInputChange}
                      placeholder="NHẬP TÊN TRÊN CCCD..."
                      className="premium-input bg-dark-950/40 font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-dark-400 uppercase ml-1">Số CMND / CCCD*</label>
                    <input
                      name="owner.idCardNumber"
                      value={formData.owner.idCardNumber}
                      onChange={handleInputChange}
                      placeholder="12 chữ số"
                      className="premium-input bg-dark-950/40"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-dark-400 uppercase ml-1">Ngày sinh*</label>
                    <input
                      type="date"
                      name="owner.dateOfBirth"
                      value={formData.owner.dateOfBirth}
                      onChange={handleInputChange}
                      className="premium-input bg-dark-950/40"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-dark-400 uppercase ml-1">Giới tính</label>
                    <select
                      name="owner.gender"
                      value={formData.owner.gender}
                      onChange={handleInputChange}
                      className="premium-input bg-dark-950/40"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-dark-400 uppercase ml-1">Số điện thoại</label>
                    <input
                      name="owner.phoneNumber"
                      value={formData.owner.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="0xxxxxxxxx"
                      className="premium-input bg-dark-950/40"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-dark-300 font-bold hover:text-white transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="premium-button-primary py-2.5 px-8"
                >
                  {isSubmitting ? 'Đang lưu...' : currentHousehold ? 'Cập nhật hộ khẩu' : 'Khởi tạo hộ khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdManagementPage;