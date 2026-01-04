import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import * as financeService from '../services/financeService';
import * as feeService from '../services/feeService';
import * as periodFeeService from '../services/periodFeeService';
import * as invoiceService from '../services/invoiceService';

const FeePeriodDetailPage = () => {
  const { id: feePeriodId } = useParams();
  const { user } = useAuth();
  const userRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const canEdit = userRoles.includes('admin') || userRoles.includes('accountant');

  const [period, setPeriod] = useState(null);
  const [periodFees, setPeriodFees] = useState([]);
  const [allFeeTypes, setAllFeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPeriodFee, setCurrentPeriodFee] = useState(null);
  const [formData, setFormData] = useState({
    feeTypeId: '', amount: '', description: '', type: 'Bắt buộc'
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [periodRes, periodFeesRes, feeTypesRes] = await Promise.all([
        financeService.getFeePeriodById(feePeriodId),
        periodFeeService.getFeesInPeriod(feePeriodId),
        feeService.getAllFeeTypes()
      ]);
      setPeriod(periodRes.data.data);
      setPeriodFees(periodFeesRes.data.data);
      setAllFeeTypes(feeTypesRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [feePeriodId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentPeriodFee(item);
      setFormData({
        feeTypeId: item.feeTypeId,
        amount: item.amount,
        description: item.description || '',
        type: item.type,
      });
    } else {
      setCurrentPeriodFee(null);
      setFormData({ feeTypeId: '', amount: '', description: '', type: 'Bắt buộc' });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentPeriodFee) {
        await periodFeeService.updateFeeInPeriod(currentPeriodFee.id, formData);
      } else {
        await periodFeeService.addFeeToPeriod(feePeriodId, formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa khoản phí này khỏi đợt thu?')) {
      try {
        await periodFeeService.deleteFeeInPeriod(id);
        fetchData();
      } catch (err) { alert('Thất bại: ' + (err.response?.data?.message || err.message)); }
    }
  };

  const handleGenerateInvoices = async () => {
    if (!window.confirm(`Xác nhận phát hành hóa đơn cho "${period.name}"? Hệ thống sẽ tự động tính toán và gửi thông báo đến các cư dân liên quan.`)) return;
    setIsSubmitting(true);
    try {
      const response = await invoiceService.generateInvoicesForPeriod(feePeriodId);
      alert(response.data.message);
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Thao tác thất bại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="space-y-8 animate-fade-in p-12">
      <div className="h-12 w-1/3 bg-white/5 rounded-2xl animate-pulse"></div>
      <div className="glass-card h-96 rounded-3xl animate-pulse"></div>
    </div>
  );

  if (!period) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="text-dark-600 font-black text-9xl">404</div>
      <p className="text-dark-400 font-bold uppercase tracking-widest">Không tìm thấy đợt thu phí này</p>
      <Link to="/fee-periods" className="premium-button-primary px-8 py-3">Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary-500 font-black text-[10px] uppercase tracking-widest mb-2">
            <Link to="/fee-periods" className="hover:text-white transition-colors">Đợt thu phí</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            <span className="text-dark-500">Chi tiết cấu hình</span>
          </div>
          <h1 className="text-5xl font-outfit font-black text-white leading-none">{period.name}</h1>
          <p className="text-dark-400 font-medium">
            Phân bổ tỷ lệ và quản lý các danh mục tài chính cho chu kỳ này.
          </p>
        </div>

        <div className="flex gap-3">
          {canEdit && (
            <button
              onClick={handleGenerateInvoices}
              disabled={isSubmitting || periodFees.length === 0}
              className="premium-button-primary bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 px-8 disabled:opacity-50 disabled:grayscale transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Phát hành Hóa đơn
            </button>
          )}
        </div>
      </div>

      {/* Info Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Trạng thái', value: period.type, color: period.type === 'Bắt buộc' ? 'text-rose-400' : 'text-emerald-400' },
          { label: 'Bắt đầu', value: new Date(period.startDate).toLocaleDateString('vi-VN'), color: 'text-white' },
          { label: 'Kết thúc', value: new Date(period.endDate).toLocaleDateString('vi-VN'), color: 'text-white' },
          { label: 'Khoản thu', value: periodFees.length, color: 'text-primary-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-dark-500">{stat.label}</span>
            <span className={`text-lg font-outfit font-black ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border-white/5">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-xl font-outfit font-black text-white uppercase tracking-tight">Cơ cấu Khoản thu</h2>
          </div>
          {canEdit && (
            <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
              + Thêm Mục Thu
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-dark-500 uppercase font-black text-[10px] tracking-widest">
                <th className="px-8 py-5">Danh mục</th>
                <th className="px-8 py-5">Cơ sở tính phí</th>
                <th className="px-8 py-5">Đơn giá áp dụng</th>
                <th className="px-8 py-5">Ghi chú</th>
                {canEdit && <th className="px-8 py-5 text-right">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {periodFees.length > 0 ? periodFees.map(pf => (
                <tr key={pf.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-white font-bold group-hover:text-primary-400 transition-colors">{pf.FeeType?.name}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-tighter ${pf.type === 'Bắt buộc' ? 'text-rose-500/70' : 'text-emerald-500/70'}`}>{pf.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-dark-400 font-medium">
                    Dựa trên: <span className="text-white font-mono">{pf.FeeType?.unit || 'Hộ'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-outfit font-black text-white">{Number(pf.amount).toLocaleString('vi-VN')}</span>
                      <span className="text-[10px] font-black uppercase text-dark-500">VNĐ</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-xs">
                    <p className="text-xs text-dark-500 italic truncate group-hover:text-dark-300 transition-colors">
                      {pf.description || 'Chưa có ghi chú đặc thù.'}
                    </p>
                  </td>
                  {canEdit && (
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(pf)} className="p-2 text-dark-400 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        <button onClick={() => handleDelete(pf.id)} className="p-2 text-dark-500 hover:text-rose-400 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-dark-700">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <p className="text-dark-500 font-bold uppercase tracking-widest text-sm">Chưa có mục thu nào được cấu hình cho đợt này</p>
                      {canEdit && (
                        <button onClick={() => handleOpenModal()} className="premium-button-primary px-6 py-2 text-xs">Cấu hình ngay</button>
                      )}
                    </div>
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
          <div className="absolute inset-0 bg-dark-950/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden shadow-2xl animate-page-transition-enter-active">
            <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-outfit font-black text-white">{currentPeriodFee ? 'Sửa định mức' : 'Thêm mục thu'}</h2>
                <p className="text-dark-500 text-[10px] uppercase font-bold tracking-widest mt-1">Cấu hình quy mô tài chính</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-dark-500 hover:text-white transition-colors bg-white/5 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Loại phí dịch vụ*</label>
                <select
                  name="feeTypeId"
                  value={formData.feeTypeId}
                  onChange={handleInputChange}
                  required
                  disabled={!!currentPeriodFee}
                  className="premium-input bg-dark-950/40 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled className="bg-dark-900">-- Chọn danh mục phí --</option>
                  {allFeeTypes.map(ft => <option key={ft.id} value={ft.id} className="bg-dark-900">{ft.name} ({ft.unit})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Định mức thu (VNĐ)*</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required className="premium-input bg-dark-950/40 font-mono text-white text-lg font-bold" placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Tính chất*</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} required className="premium-input bg-dark-950/40">
                    <option value="Bắt buộc" className="bg-dark-900">Bắt buộc</option>
                    <option value="Đóng góp" className="bg-dark-900">Đóng góp</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Mô tả đặc thù cho danh mục này</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="premium-input bg-dark-950/40 resize-none text-sm" placeholder="Nhập ghi chú (không bắt buộc)..." />
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-dark-400 font-bold hover:text-white transition-colors uppercase tracking-widest text-xs">Đóng</button>
                <button type="submit" disabled={isSubmitting} className="premium-button-primary py-3 px-10">
                  {isSubmitting ? 'Chờ xử lý...' : currentPeriodFee ? 'Lưu thay đổi' : 'Thêm mục thu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeePeriodDetailPage;