import React, { useState, useEffect } from 'react';
import * as statisticsService from '../services/statisticsService';
import * as financeService from '../services/financeService';

const FeeCollectionStatsPage = () => {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        feePeriodId: '',
        status: ''
    });
    const [feePeriods, setFeePeriods] = useState([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFeePeriods = async () => {
            try {
                const response = await financeService.getAllFeePeriods();
                setFeePeriods(response.data.data);
            } catch (error) {
                console.error('Lỗi khi tải đợt thu:', error);
            }
        };
        fetchFeePeriods();
    }, []);

    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await statisticsService.getFeeCollectionStats(filters);
            setResults(response.data);
        } catch (error) {
            alert('Lỗi truy vấn dữ liệu.');
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            await statisticsService.exportFeeCollectionStatsToExcel(filters);
        } catch (error) {
            alert('Lỗi xuất file Excel.');
        }
    };

    const handleExportPdf = async () => {
        try {
            await statisticsService.exportFeeCollectionStatsToPdf(filters);
        } catch (error) {
            alert('Lỗi xuất file PDF.');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-4xl font-outfit font-black text-white">Thống kê Thu phí</h1>
                <p className="text-dark-400 font-medium tracking-wide">Quản lý và theo dõi tình trạng thu phí, đóng góp trong khu dân cư.</p>
            </header>

            <form className="glass-card p-8 rounded-3xl space-y-6 shadow-2xl" onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Đợt thu</label>
                        <select name="feePeriodId" value={filters.feePeriodId} onChange={handleFilterChange} className="premium-input bg-dark-950/40 text-white">
                            <option value="">Tất cả đợt thu</option>
                            {feePeriods.map(period => (
                                <option key={period.id} value={period.id}>{period.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Trạng thái</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="premium-input bg-dark-950/40 text-white">
                            <option value="">Tất cả trạng thái</option>
                            <option value="paid">Đã thanh toán</option>
                            <option value="unpaid">Chưa thanh toán</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Từ ngày</label>
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="premium-input bg-dark-950/40" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Đến ngày</label>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="premium-input bg-dark-950/40" />
                    </div>

                    {/* New Filters */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Mã Hộ khẩu</label>
                        <input type="text" name="householdCode" value={filters.householdCode || ''} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="VD: S1..." />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Tên Chủ hộ</label>
                        <input type="text" name="ownerName" value={filters.ownerName || ''} onChange={handleFilterChange} className="premium-input bg-dark-950/40" placeholder="Nhập tên chủ hộ..." />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Số tiền từ (VNĐ)</label>
                        <input type="number" name="minAmount" value={filters.minAmount || ''} onChange={handleFilterChange} className="premium-input bg-dark-950/40 font-mono" placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Số tiền đến (VNĐ)</label>
                        <input type="number" name="maxAmount" value={filters.maxAmount || ''} onChange={handleFilterChange} className="premium-input bg-dark-950/40 font-mono" placeholder="Max" />
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={loading} className="premium-button-primary px-10">
                        {loading ? 'Đang truy xuất...' : 'Xem báo cáo'}
                    </button>
                </div>
            </form>

            {results && !loading && (
                <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-8 rounded-3xl border-l-[6px] border-primary-500">
                            <h4 className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-4">Tổng các khoản thu</h4>
                            <div className="text-3xl font-outfit font-black text-white">{Number(results.stats.totalAmount).toLocaleString('vi-VN')} đ</div>
                            <div className="text-[10px] text-primary-400 font-bold mt-1">Số lượng: {results.stats.totalCount} hóa đơn</div>
                        </div>
                        <div className="glass-card p-8 rounded-3xl border-l-[6px] border-emerald-500">
                            <h4 className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-4">Đã thu</h4>
                            <div className="text-3xl font-outfit font-black text-emerald-400">{Number(results.stats.paidAmount).toLocaleString('vi-VN')} đ</div>
                            <div className="text-[10px] text-emerald-500/60 font-bold mt-1">Hoàn thành: {((results.stats.paidAmount / (results.stats.totalAmount || 1)) * 100).toFixed(1)}%</div>
                        </div>
                        <div className="glass-card p-8 rounded-3xl border-l-[6px] border-amber-500">
                            <h4 className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-4">Chưa thu</h4>
                            <div className="text-3xl font-outfit font-black text-amber-400">{Number(results.stats.unpaidAmount).toLocaleString('vi-VN')} đ</div>
                            <div className="text-[10px] text-amber-500/60 font-bold mt-1">Dư nợ: {results.stats.unpaidCount} hộ</div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-2xl">
                                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Xuất báo cáo chi tiết</h3>
                                <p className="text-xs text-dark-500">Tải dữ liệu dưới dạng Excel hoặc PDF để lưu trữ ngoại tuyến.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleExportExcel} className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-all border border-emerald-500/20">
                                Excel
                            </button>
                            <button onClick={handleExportPdf} className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/20">
                                PDF
                            </button>
                        </div>
                    </div>

                    <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 text-[10px] font-black text-dark-500 uppercase tracking-widest">
                                        <th className="px-8 py-5">Đợt thu</th>
                                        <th className="px-8 py-5">Hộ khẩu</th>
                                        <th className="px-8 py-5">Chủ hộ</th>
                                        <th className="px-8 py-5">Số tiền</th>
                                        <th className="px-8 py-5">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {results.data.map(item => (
                                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6 text-sm text-dark-200">{item.FeePeriod?.name}</td>
                                            <td className="px-8 py-6 text-sm font-bold text-white uppercase">{item.Household?.householdCode}</td>
                                            <td className="px-8 py-6 text-sm text-dark-300">{item.Household?.Owner?.fullName}</td>
                                            <td className="px-8 py-6 text-sm font-black text-primary-400">{Number(item.totalAmount).toLocaleString('vi-VN')} đ</td>
                                            <td className="px-8 py-6">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${item.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    {item.status === 'paid' ? 'Đã thu' : 'Chưa thu'}
                                                </span>
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

export default FeeCollectionStatsPage;
