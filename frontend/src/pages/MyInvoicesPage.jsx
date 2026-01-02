import React, { useState, useEffect } from 'react';
import * as invoiceService from '../services/invoiceService';

const MyInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await invoiceService.getMyInvoices();
        setInvoices(response.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) return (
    <div className="space-y-8 animate-fade-in">
      <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="glass-card h-48 rounded-2xl animate-pulse"></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-outfit font-black text-white">Hóa đơn của tôi</h1>
        <p className="text-dark-400 font-medium">Theo dõi các khoản phí dịch vụ và lịch sử thanh toán của hộ gia đình.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {invoices.length > 0 ? invoices.map(invoice => (
          <div key={invoice.id} className="glass-card p-6 rounded-2xl border-white/5 hover:border-primary-500/30 transition-all group flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${invoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 animate-pulse'}`}>
                {invoice.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 text-dark-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors leading-tight">{invoice.FeePeriod.name}</h3>
                <p className="text-dark-600 text-[10px] font-bold uppercase mt-1">Mã hóa đơn: #INV-{invoice.id.toString().padStart(5, '0')}</p>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-white/5">
                <span className="text-xs text-dark-500 font-bold uppercase">Tổng cộng</span>
                <span className="text-2xl font-outfit font-black text-white">
                  {Number(invoice.totalAmount).toLocaleString('vi-VN')}
                  <span className="text-xs ml-1 text-dark-500 font-bold uppercase">đ</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedInvoice(invoice)}
              className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-dark-300 hover:text-white transition-all"
            >
              Xem chi tiết & Hóa đơn
            </button>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center glass-card rounded-2xl border-dashed border-white/10">
            <svg className="w-16 h-16 text-dark-700 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-dark-500 font-bold uppercase tracking-widest text-sm text-center">Bạn hiện không có khoản phí nào cần thanh toán</p>
          </div>
        )}
      </div>

      {/* Modal Chi tiết */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-md" onClick={() => setSelectedInvoice(null)}></div>
          <div className="relative w-full max-w-2xl glass-card rounded-3xl overflow-hidden shadow-2xl animate-page-transition-enter-active">
            <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-outfit font-black text-white">Chi tiết Khoản thu</h2>
                <p className="text-dark-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">{selectedInvoice.FeePeriod.name}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-2 text-dark-500 hover:text-white transition-colors bg-white/5 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8">
              <div className="overflow-hidden rounded-xl border border-white/5">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="p-4 text-[10px] font-black uppercase text-dark-400 tracking-widest">Loại khoản phí</th>
                      <th className="p-4 text-[10px] font-black uppercase text-dark-400 tracking-widest text-right">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {selectedInvoice.InvoiceDetails.map(detail => (
                      <tr key={detail.id} className="text-dark-200">
                        <td className="p-4 font-bold text-sm">{detail.FeeType.name}</td>
                        <td className="p-4 text-right font-mono font-bold text-white text-sm">{Number(detail.amount).toLocaleString('vi-VN')} đ</td>
                      </tr>
                    ))}
                    <tr className="bg-white/5">
                      <td className="p-4 font-black uppercase text-primary-400 text-xs">Tổng cộng</td>
                      <td className="p-4 text-right font-black text-xl text-white font-outfit">{Number(selectedInvoice.totalAmount).toLocaleString('vi-VN')} đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                {selectedInvoice.status !== 'paid' && (
                  <button className="premium-button-primary py-3 px-10">
                    Thanh toán ngay
                  </button>
                )}
                <button onClick={() => setSelectedInvoice(null)} className="px-6 py-3 text-dark-400 font-bold hover:text-white transition-colors uppercase tracking-widest text-xs">Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvoicesPage;