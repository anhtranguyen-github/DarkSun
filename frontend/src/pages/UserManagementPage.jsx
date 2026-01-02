import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as userService from '../services/userService';
import * as roleService from '../services/roleService';
import * as householdService from '../services/householdService';
import { useAuth } from '../context/AuthContext';

const UserManagementPage = () => {
  const { user: currentUser, updateAuthUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [allHouseholds, setAllHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleToAssign, setRoleToAssign] = useState('');
  const [householdToAssign, setHouseholdToAssign] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data.data.filter(u => u.status !== 'deleted'));
    } catch (err) {
      setError('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    roleService.getAllRoles().then(res => setAllRoles(res.data.data));
    householdService.getAllHouseholds().then(res => setAllHouseholds(res.data.data));
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term || u.username.toLowerCase().includes(term) || u.fullName.toLowerCase().includes(term);
      const matchesRole = !selectedRoleFilter || u.Roles.some(r => r.name === selectedRoleFilter);
      const matchesStatus = !selectedStatus || u.status === selectedStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRoleFilter, selectedStatus, users]);

  const handleToggleLock = async (user) => {
    const newStatus = user.status === 'active' ? 'locked' : 'active';
    if (window.confirm(`Bạn có chắc chắn muốn ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản "${user.username}"?`)) {
      try {
        await userService.updateUserStatus(user.id, newStatus);
        fetchUsers();
      } catch (error) {
        alert('Thao tác thất bại.');
      }
    }
  };

  const handleDelete = async (userId, username) => {
    if (window.confirm(`Xóa tài khoản "${username}"? Hành động này không thể hoàn tác.`)) {
      try {
        await userService.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        alert('Không thể xóa tài khoản.');
      }
    }
  };

  const handleAssignRole = async () => {
    if (!roleToAssign) return;
    setIsSubmitting(true);
    try {
      const response = await userService.assignRole(selectedUser.id, roleToAssign);
      if (currentUser && currentUser.id === selectedUser.id) updateAuthUser(response.data.data);
      setIsRoleModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert('Gán vai trò thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignHousehold = async () => {
    setIsSubmitting(true);
    try {
      await userService.assignHousehold(selectedUser.id, householdToAssign || null);
      setIsHouseholdModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert('Cập nhật hộ khẩu thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-outfit font-black text-white">Quản lý Tài khoản</h1>
        <p className="text-dark-400 font-medium">Kiểm soát quyền truy cập, phân quyền và trạng thái hoạt động của người dùng hệ thống.</p>
      </header>

      <div className="glass-card p-6 rounded-2xl flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <input
            className="premium-input bg-dark-950/30 py-2 pl-10"
            placeholder="Tìm theo tên hoặc username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        </div>
        <select className="premium-input bg-dark-950/30 py-2 w-auto min-w-[160px]" value={selectedRoleFilter} onChange={(e) => setSelectedRoleFilter(e.target.value)}>
          <option value="">Tất cả vai trò</option>
          {allRoles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
        </select>
        <select className="premium-input bg-dark-950/30 py-2 w-auto min-w-[160px]" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="locked">Đã khóa</option>
        </select>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400">Người dùng</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400">Vai trò</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400">Hộ khẩu liên kết</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400">Trạng thái</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-dark-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => <tr key={i} className="animate-pulse"><td colSpan="5" className="p-4"><div className="h-10 bg-white/5 rounded"></div></td></tr>)
              ) : filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center font-bold text-dark-300 border border-white/5">
                        {u.username[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white leading-tight">{u.fullName}</span>
                        <span className="text-xs text-dark-500">@{u.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {u.Roles.map(r => (
                        <span key={r.id} className="px-2 py-0.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded text-[10px] font-black uppercase">{r.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    {u.Household ? (
                      <span className="text-sm text-dark-300 font-medium">🏠 {u.Household.householdCode}</span>
                    ) : (
                      <span className="text-xs text-dark-600 italic">Chưa liên kết</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {u.status === 'active' ? 'Active' : 'Locked'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setSelectedUser(u); setHouseholdToAssign(u.householdId || ''); setIsHouseholdModalOpen(true); }} className="p-2 text-dark-500 hover:text-indigo-400 transition-colors" title="Gán hộ khẩu"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></button>
                      <button onClick={() => { setSelectedUser(u); setRoleToAssign(''); setIsRoleModalOpen(true); }} className="p-2 text-dark-500 hover:text-primary-400 transition-colors" title="Phân quyền"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></button>
                      <button onClick={() => handleToggleLock(u)} className={`p-2 transition-colors ${u.status === 'active' ? 'text-dark-500 hover:text-rose-400' : 'text-emerald-500 hover:text-emerald-400'}`} title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}>
                        {u.status === 'active' ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>}
                      </button>
                      <button onClick={() => handleDelete(u.id, u.username)} className="p-2 text-dark-500 hover:text-rose-600 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals - Common Transition Logic */}
      {(isRoleModalOpen || isHouseholdModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => { setIsRoleModalOpen(false); setIsHouseholdModalOpen(false); }}></div>
          <div className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden shadow-2xl animate-page-transition-enter-active p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-outfit font-black text-white">
                {isRoleModalOpen ? 'Phân quyền hệ thống' : 'Liên kết hộ khẩu'}
              </h2>
              <p className="text-dark-500 text-xs font-bold uppercase tracking-widest">Tài khoản: {selectedUser?.fullName}</p>
            </div>

            {isRoleModalOpen ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Chọn vai trò bổ sung</label>
                  <select className="premium-input bg-dark-950/40" value={roleToAssign} onChange={(e) => setRoleToAssign(e.target.value)}>
                    <option value="" disabled className="bg-dark-900">-- Chọn vai trò --</option>
                    {allRoles.map(r => <option key={r.id} value={r.id} className="bg-dark-900">{r.name}</option>)}
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setIsRoleModalOpen(false)} className="px-4 py-2 text-dark-400 hover:text-white font-bold text-sm">Hủy</button>
                  <button onClick={handleAssignRole} disabled={isSubmitting} className="premium-button-primary py-2 px-6 text-sm">Xác nhận</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Tìm Hộ khẩu</label>
                  <select className="premium-input bg-dark-950/40" value={householdToAssign} onChange={(e) => setHouseholdToAssign(e.target.value)}>
                    <option value="" className="bg-dark-900">-- Không liên kết --</option>
                    {allHouseholds.map(h => <option key={h.id} value={h.id} className="bg-dark-900">{h.householdCode} - {h.ownerName}</option>)}
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setIsHouseholdModalOpen(false)} className="px-4 py-2 text-dark-400 hover:text-white font-bold text-sm">Hủy</button>
                  <button onClick={handleAssignHousehold} disabled={isSubmitting} className="premium-button-primary py-2 px-6 text-sm">Lưu liên kết</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;