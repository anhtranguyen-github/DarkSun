import React, { useEffect, useState } from 'react';
import * as householdService from '../../services/householdService';

const HouseholdDetailsModal = ({ householdId, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await householdService.getHouseholdDetails(householdId);
                setDetails(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải thông tin chi tiết.');
            } finally {
                setLoading(false);
            }
        };

        if (householdId) {
            fetchDetails();
        }
    }, [householdId]);

    if (!householdId) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-4xl glass-card rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-page-transition-enter-active">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-xl font-outfit font-bold">Chi tiết Hộ khẩu</h2>
                        {details && (
                            <p className="text-sm text-primary-400 font-medium mt-1">
                                Mã hộ: {details.householdCode}
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 text-dark-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-rose-400">
                            <p>{error}</p>
                            <button onClick={onClose} className="mt-4 text-sm underline">Đóng</button>
                        </div>
                    ) : details ? (
                        <div className="space-y-8 p-8">
                            {/* General Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] uppercase tracking-widest text-dark-400 font-bold mb-1">Chủ hộ</p>
                                    <p className="font-bold text-lg text-white">{details.Owner?.fullName || '---'}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] uppercase tracking-widest text-dark-400 font-bold mb-1">Địa chỉ</p>
                                    <p className="font-bold text-white">{details.address}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] uppercase tracking-widest text-dark-400 font-bold mb-1">Diện tích</p>
                                    <p className="font-bold text-white">{details.area} m²</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] uppercase tracking-widest text-dark-400 font-bold mb-1">Tổng thành viên</p>
                                    <p className="font-bold text-white">{details.Residents?.length || 0}</p>
                                </div>
                            </div>

                            {/* Residents Table */}
                            <div>
                                <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest border-l-2 border-primary-500 pl-3 mb-4">
                                    Danh sách Nhân khẩu ({details.Residents?.length || 0})
                                </h3>
                                <div className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5">
                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5">Họ và tên</th>
                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5">CCCD</th>
                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5">Ngày sinh</th>
                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5">Giới tính</th>
                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-dark-400 border-b border-white/5">Quan hệ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {details.Residents?.map((resident) => (
                                                <tr key={resident.id} className="hover:bg-white/[0.02]">
                                                    <td className="p-4 font-bold text-dark-200">
                                                        {resident.fullName}
                                                        {resident.id === details.ownerId && (
                                                            <span className="ml-2 text-[10px] bg-primary-500/20 text-primary-400 px-1.5 py-0.5 rounded font-bold">CHỦ HỘ</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-sm text-dark-400 font-mono">{resident.idCardNumber || '---'}</td>
                                                    <td className="p-4 text-sm text-dark-400">{new Date(resident.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                                                    <td className="p-4 text-sm text-dark-400">{resident.gender}</td>
                                                    <td className="p-4 text-sm text-dark-400">{resident.relationshipWithOwner || resident.relationship}</td>
                                                </tr>
                                            ))}
                                            {(!details.Residents || details.Residents.length === 0) && (
                                                <tr><td colSpan="5" className="p-6 text-center text-dark-500">Chưa có nhân khẩu nào.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Vehicles Table */}
                            <div>
                                <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest border-l-2 border-primary-500 pl-3 mb-4">
                                    Phương tiện đăng ký ({details.Vehicles?.length || 0})
                                </h3>
                                {details.Vehicles && details.Vehicles.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {details.Vehicles.map(v => (
                                            <div key={v.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${v.type === 'Oto' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                    {v.type === 'Oto' ? (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> // Placeholder icon
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> // Placeholder icon
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{v.licensePlate}</p>
                                                    <p className="text-xs text-dark-400">{v.name} - {v.color}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-dark-500 italic pl-4">Chưa có phương tiện nào.</p>
                                )}
                            </div>
                            {/* Linked Accounts */}
                            <div>
                                <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest border-l-2 border-primary-500 pl-3 mb-4">
                                    Tài khoản liên kết ({details.AssociatedAccounts?.length || 0})
                                </h3>
                                {details.AssociatedAccounts && details.AssociatedAccounts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {details.AssociatedAccounts.map(u => (
                                            <div key={u.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                                <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white max-w-[150px] truncate">{u.username}</p>
                                                    <p className="text-xs text-dark-400 max-w-[150px] truncate">{u.email || 'No email'}</p>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                                        {u.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-dark-500 italic pl-4">Chưa có tài khoản nào liên kết với hộ khẩu này.</p>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 flex justify-end bg-white/5">
                    <button
                        onClick={onClose}
                        className="premium-button-primary"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div >
    );
};

export default HouseholdDetailsModal;
