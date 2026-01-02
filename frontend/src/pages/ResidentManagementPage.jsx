import React, { useState, useEffect, useCallback } from 'react';
import * as residentService from '../services/residentService';
import * as householdService from '../services/householdService';
import { useAuth } from '../context/AuthContext';

const RELATIONSHIP_OPTIONS = ['Chủ hộ', 'Vợ', 'Chồng', 'Con', 'Bố', 'Mẹ', 'Anh', 'Chị', 'Em', 'Ông', 'Bà', 'Cháu', 'Khác'];

const ResidentManagementPage = () => {
  const { user } = useAuth();
  const userRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const canEdit = userRoles.includes('admin') || userRoles.includes('to_truong') || userRoles.includes('to_pho');

  const [residents, setResidents] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResident, setCurrentResident] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    householdId: '',
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam',
    idCardNumber: '',
    relationship: 'Con',
    occupation: '',
    phoneNumber: '',
    email: ''
  });

  const [filters, setFilters] = useState({
    fullName: '',
    householdCode: ''
  });

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [residentsRes, householdsRes] = await Promise.all([
        residentService.getAllResidents(filters),
        householdService.getAllHouseholds()
      ]);
      setResidents(residentsRes.data.data);
      setHouseholds(householdsRes.data.data);
      setError('');
    } catch (err) {
      setError('Không thể tải dữ liệu nhân khẩu.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAllData();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchAllData]);

  const handleOpenModal = (resident = null) => {
    if (resident) {
      setCurrentResident(resident);
      setFormData({
        householdId: resident.householdId,
        fullName: resident.fullName,
        dateOfBirth: resident.dateOfBirth ? resident.dateOfBirth.split('T')[0] : '',
        gender: resident.gender,
        idCardNumber: resident.idCardNumber || '',
        relationship: resident.relationship || 'Khác',
        occupation: resident.occupation || '',
        phoneNumber: resident.phoneNumber || '',
        email: resident.email || ''
      });
    } else {
      setCurrentResident(null);
      setFormData({
        householdId: '', fullName: '', dateOfBirth: '', gender: 'Nam',
        idCardNumber: '', relationship: 'Con', occupation: '', phoneNumber: '', email: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentResident) {
        await residentService.updateResident(currentResident.id, formData);
      } else {
        await residentService.createResident(formData);
      }
      setIsModalOpen(false);
      fetchAllData();
    } catch (err) {
      alert('Thao tác thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân khẩu này?')) {
      try {
        await residentService.deleteResident(id);
        fetchAllData();
      } catch (err) {
        alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-black text-white">Quản lý Nhân khẩu</h1>
          <p className="text-dark-400 font-medium tracking-wide">Cơ sở dữ liệu cư dân toàn diện của chung cư <span className="text-primary-400">BlueMoon</span>.</p>
        </div>
        {canEdit && (
          <button
            onClick={() => handleOpenModal()}
            className="premium-button-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" /></svg>
            Khai báo Nhân khẩu
          </button>
        )}
      </header>

      {/* Selection/Filters */}
      <div className="glass-card p-6 rounded-2xl flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[240px] space-y-1.5">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-dark-500 ml-1">Tìm theo họ tên</label>
          <div className="relative">
            <input
              className="premium-input bg-dark-950/30 py-2 pl-10"
              placeholder="Nhập tên cư dân..."
              value={filters.fullName}
              onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </div>
        </div>
        <div className="flex-1 min-w-[240px] space-y-1.5">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-dark-500 ml-1">Lọc theo mã hộ</label>
          <input
            className="premium-input bg-dark-950/30 py-2"
            placeholder="VD: HK-..."
            value={filters.householdCode}
            onChange={(e) => setFilters({ ...filters, householdCode: e.target.value })}
          />
        </div>
        <button
          onClick={() => setFilters({ fullName: '', householdCode: '' })}
          className="h-11 px-4 text-dark-400 hover:text-white transition-colors font-bold text-xs uppercase"
        >
          Đặt lại
        </button>
      </div>

      {/* Table Area */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400">Họ và tên</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400">Hộ khẩu</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400">Ngày sinh</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400 text-center">Giới tính</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400">CCCD/CMND</th>
                {canEdit && <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400 text-right">Hành động</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(6).fill(0).map((_, j) => (j === 3 ? <td key={j} className="p-4"><div className="mx-auto h-4 w-12 bg-white/5 rounded"></div></td> : <td key={j} className="p-4"><div className="h-4 bg-white/5 rounded"></div></td>))}
                  </tr>
                ))
              ) : residents.length > 0 ? (
                residents.map(res => (
                  <tr key={res.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-primary-400 transition-colors">{res.fullName}</span>
                        <span className="text-[10px] text-dark-500 font-bold uppercase tracking-tight">{res.occupation || 'Nghề nghiệp: Tự do'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-black uppercase">{res.Household?.householdCode || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-dark-300 font-medium">
                      {res.dateOfBirth ? new Date(res.dateOfBirth).toLocaleDateString('vi-VN') : '---'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${res.gender === 'Nam' ? 'bg-blue-500/10 text-blue-400' : res.gender === 'Nữ' ? 'bg-pink-500/10 text-pink-400' : 'bg-dark-700 text-dark-400'}`}>
                        {res.gender}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-mono text-dark-400 tracking-wider">
                      {res.idCardNumber || 'Chưa cập nhật'}
                    </td>
                    {canEdit && (
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenModal(res)}
                            className="p-2 text-dark-400 hover:text-white transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button
                            onClick={() => handleDelete(res.id)}
                            className="p-2 text-dark-500 hover:text-rose-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center space-y-3">
                    <div className="flex justify-center">
                      <svg className="w-12 h-12 text-dark-700" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M17 11l2 2 4-4" /></svg>
                    </div>
                    <p className="text-dark-500 font-medium">Không tìm thấy dữ liệu cư dân tương ứng.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl glass-card rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-page-transition-enter-active">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="space-y-1">
                <h2 className="text-2xl font-outfit font-black text-white">{currentResident ? 'Chỉnh sửa cư dân' : 'Khai báo nhân khẩu mới'}</h2>
                <p className="text-dark-500 text-xs font-bold uppercase tracking-widest">Cung cấp đầy đủ thông tin định danh</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-dark-400 hover:text-white transition-colors bg-white/5 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form className="p-8 space-y-8 overflow-y-auto custom-scrollbar" onSubmit={handleSubmit}>
              {/* Form Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Household Link */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest ml-1">Thuộc Hộ khẩu*</label>
                  <select
                    name="householdId"
                    value={formData.householdId}
                    onChange={handleInputChange}
                    required
                    className="premium-input bg-dark-950/40"
                  >
                    <option value="" disabled className="bg-dark-900">-- Chọn hộ khẩu đăng ký --</option>
                    {households.map(h => (
                      <option key={h.id} value={h.id} className="bg-dark-900">
                        {h.householdCode} - Chủ hộ: {h.Owner?.fullName || 'N/A'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Full Name */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Họ và tên nhân khẩu*</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="NHẬP TÊN ĐẦY ĐỦ..."
                    className="premium-input bg-dark-950/40 text-lg font-bold"
                  />
                </div>

                {/* Personal Specs */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Ngày sinh*</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="premium-input bg-dark-950/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Giới tính*</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="premium-input bg-dark-950/40"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {/* Identity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Số CMND / CCCD</label>
                  <input
                    name="idCardNumber"
                    value={formData.idCardNumber}
                    onChange={handleInputChange}
                    placeholder="12 chữ số"
                    className="premium-input bg-dark-950/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Quan hệ với chủ hộ*</label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    required
                    className="premium-input bg-dark-950/40"
                  >
                    {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-dark-900">{opt}</option>)}
                  </select>
                </div>

                {/* Contact & Job */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Số điện thoại</label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="0xxxxxxxxx"
                    className="premium-input bg-dark-950/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Nghề nghiệp / Trạng thái</label>
                  <input
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="VD: Sinh viên, Kỹ sư..."
                    className="premium-input bg-dark-950/40"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex justify-end gap-3">
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
                  className="premium-button-primary py-3 px-10 shadow-indigo-500/20"
                >
                  {isSubmitting ? 'Đang gửi...' : currentResident ? 'Lưu thay đổi' : 'Xác nhận khai báo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentManagementPage;