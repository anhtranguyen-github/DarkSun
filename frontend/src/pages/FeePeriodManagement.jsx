import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as financeService from '../services/financeService';
import { useAuth } from '../context/AuthContext';

const FeePeriodManagement = () => {
  const { user } = useAuth();
  const canEdit = user?.roles?.includes('ke_toan') || user?.roles?.includes('admin');

  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    type: 'Bắt buộc',
    description: ''
  });

  const fetchPeriods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await financeService.getAllFeePeriods();
      setPeriods(response.data.data);
      setError('');
    } catch (err) {
      setError('Không thể tải các đợt thu từ máy chủ.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await financeService.createFeePeriod(formData);
      setIsModalOpen(false);
      fetchPeriods();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Có lỗi xảy ra.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-dark-50">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-black text-white">Quản lý Đợt thu</h1>
          <p className="text-dark-400 font-medium">Khởi tạo và điều hành quy trình thu phí dịch vụ & đóng góp tự nguyện.</p>
        </div>
        {canEdit && (
          <button onClick={() => setIsModalOpen(true)} className="premium-button-primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            Khởi tạo Đợt thu
          </button>
        )}
      </header>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 font-bold text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="glass-card h-48 rounded-2xl animate-pulse"></div>)
        ) : periods.length > 0 ? (
          periods.map(period => (
            <div key={period.id} className="glass-card rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all group flex flex-col">
              <div className="p-6 flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${period.type === 'mandatory' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {period.typeLabel || (period.type === 'mandatory' ? 'Bắt buộc' : 'Đóng góp')}
                  </span>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${period.status === 'open' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'bg-dark-500/10 text-dark-400 border-white/10'}`}>
                    {period.statusLabel || (period.status === 'open' ? 'Đang mở' : 'Đã đóng')}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors leading-tight">{period.name}</h3>
                  <p className="text-dark-500 text-xs font-bold uppercase mt-1 tracking-tight">Kỳ thu: {new Date(period.startDate).toLocaleDateString('vi-VN')} - {new Date(period.endDate).toLocaleDateString('vi-VN')}</p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-dark-600 font-black uppercase tracking-tighter text-[9px]">Tiến độ thu phí</span>
                      <span className="text-white font-black text-[10px]">{period.progress || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${period.progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'}`}
                        style={{ width: `${period.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] font-bold text-dark-500">
                      <span>{period.paidInvoices || 0} hộ đã đóng</span>
                      <span>{period.totalInvoices || 0} tổng hộ</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link to={`/fee-periods/${period.id}`} className="block w-full py-4 bg-white/5 border-t border-white/5 text-center text-xs font-black uppercase tracking-[0.2em] text-dark-400 hover:bg-primary-600 hover:text-white transition-all">
                {canEdit ? 'Quản lý Khoản thu' : 'Xem chi tiết'}
              </Link>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 py-20 text-center glass-card rounded-2xl border-dashed">
            <svg className="w-16 h-16 text-dark-700 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <p className="text-dark-500 font-bold uppercase tracking-widest text-sm">Chưa có đợt thu phí nào được khởi tạo</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl glass-card rounded-3xl overflow-hidden shadow-2xl animate-page-transition-enter-active">
            <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-outfit font-black text-white">Khởi tạo Đợt thu</h2>
                <p className="text-dark-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Chu kỳ tài chính BlueMoon</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-dark-500 hover:text-white transition-colors bg-white/5 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Tên gọi Đợt thu*</label>
                <input name="name" placeholder="VD: Thu phí vận hành tháng 08/2024" value={formData.name} onChange={handleInputChange} required className="premium-input bg-dark-950/40 text-white font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Ngày bắt đầu*</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="premium-input bg-dark-950/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Ngày kết thúc*</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required className="premium-input bg-dark-950/40" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Hình thức thu phí*</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'Bắt buộc' ? 'bg-primary-500/10 border-primary-500 text-white' : 'bg-dark-950/40 border-white/5 text-dark-500'}`}>
                    <input type="radio" name="type" value="Bắt buộc" checked={formData.type === 'Bắt buộc'} onChange={handleInputChange} className="hidden" />
                    <span className="text-xs font-black uppercase tracking-widest">Bắt buộc</span>
                  </label>
                  <label className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'Đóng góp' ? 'bg-primary-500/10 border-primary-500 text-white' : 'bg-dark-950/40 border-white/5 text-dark-500'}`}>
                    <input type="radio" name="type" value="Đóng góp" checked={formData.type === 'Đóng góp'} onChange={handleInputChange} className="hidden" />
                    <span className="text-xs font-black uppercase tracking-widest">Đóng góp</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Ghi chú vận hành</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="premium-input bg-dark-950/40 resize-none" placeholder="Thông tin bổ sung cho bộ phận kế toán..." />
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-dark-400 font-bold hover:text-white transition-colors uppercase tracking-widest text-xs">Hủy bỏ</button>
                <button type="submit" disabled={isSubmitting} className="premium-button-primary py-3 px-10">
                  {isSubmitting ? 'Đang tạo...' : 'Xác nhận khởi tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeePeriodManagement;