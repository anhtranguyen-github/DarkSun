import React, { useState, useEffect, useMemo } from 'react';
import * as feeService from '../services/feeService';
import { useAuth } from '../context/AuthContext';

const FeeTypeManagement = () => {
  const { user } = useAuth();
  const canEdit = user?.roles?.includes('ke_toan') || user?.roles?.includes('admin');

  const [feeTypes, setFeeTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFeeType, setCurrentFeeType] = useState(null);
  const [formData, setFormData] = useState({ name: '', unit: '', price: '', description: '' });

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const fetchFeeTypes = async () => {
    setIsLoading(true);
    try {
      const response = await feeService.getAllFeeTypes();
      setFeeTypes(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFeeTypes = useMemo(() => {
    if (!searchTerm) return feeTypes;
    return feeTypes.filter(fee => fee.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, feeTypes]);

  const handleOpenModal = (feeType = null) => {
    if (feeType) {
      setCurrentFeeType(feeType);
      setFormData({ name: feeType.name, unit: feeType.unit, price: feeType.price, description: feeType.description || '' });
    } else {
      setCurrentFeeType(null);
      setFormData({ name: '', unit: '', price: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (currentFeeType) {
        await feeService.updateFeeType(currentFeeType.id, formData);
      } else {
        await feeService.createFeeType(formData);
      }
      setIsModalOpen(false);
      fetchFeeTypes();
    } catch (error) {
      alert('Thao tác thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa loại phí này sẽ ảnh hưởng đến các hóa đơn liên quan. Bạn có chắc chắn?')) {
      try {
        await feeService.deleteFeeType(id);
        fetchFeeTypes();
      } catch (error) {
        alert('Không thể xóa loại phí.');
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-black text-white">Danh mục Khoản thu</h1>
          <p className="text-dark-400 font-medium">Cấu hình đơn giá và định nghĩa các loại phí dịch vụ, đóng góp.</p>
        </div>
        {canEdit && (
          <button onClick={() => handleOpenModal()} className="premium-button-primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            Thêm Loại Phí
          </button>
        )}
      </header>

      <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            className="premium-input bg-dark-950/30 py-2 pl-10"
            placeholder="Tìm kiếm loại phí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="glass-card h-48 rounded-2xl animate-pulse"></div>)
        ) : filteredFeeTypes.map(fee => (
          <div key={fee.id} className="glass-card p-6 rounded-2xl border-white/5 hover:border-primary-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/10 transition-colors"></div>

            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-white/5 text-primary-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              {canEdit && (
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(fee)} className="p-2 text-dark-500 hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  <button onClick={() => handleDelete(fee.id)} className="p-2 text-dark-500 hover:text-rose-400 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{fee.name}</h3>
                <p className="text-dark-500 text-xs font-bold uppercase tracking-widest mt-1">{fee.description || 'Chưa có mô tả'}</p>
              </div>
              <div className="flex items-baseline justify-between border-t border-white/5 pt-4">
                <span className="text-dark-400 text-sm font-medium">Đơn giá:</span>
                <div className="text-right">
                  <span className="text-2xl font-outfit font-black text-white">{Number(fee.price).toLocaleString('vi-VN')}</span>
                  <span className="text-dark-500 text-[10px] font-bold uppercase ml-1 tracking-tighter">VNĐ/{fee.unit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden shadow-2xl animate-page-transition-enter-active">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-outfit font-bold">{currentFeeType ? 'Sửa Loại phí' : 'Thêm Loại phí'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-dark-400 hover:text-white transition-colors bg-white/10 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-dark-500 uppercase tracking-widest ml-1">Tên loại phí*</label>
                <input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="premium-input bg-dark-950/40" placeholder="VD: Phí vệ sinh..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-dark-500 uppercase tracking-widest ml-1">Đơn vị tính*</label>
                  <input name="unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required className="premium-input bg-dark-950/40" placeholder="Người, m2, căn..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-dark-500 uppercase tracking-widest ml-1">Đơn giá (VNĐ)*</label>
                  <input type="number" name="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="premium-input bg-dark-950/40 font-mono" placeholder="0" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-dark-500 uppercase tracking-widest ml-1">Mô tả / Chú thích</label>
                <textarea name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" className="premium-input bg-dark-950/40 resize-none" placeholder="Chi tiết về cách tính phí..." />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-dark-300 font-bold hover:text-white transition-colors text-sm">Hủy</button>
                <button type="submit" disabled={isLoading} className="premium-button-primary py-2.5 px-8 text-sm">{currentFeeType ? 'Cập nhật' : 'Khởi tạo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeTypeManagement;