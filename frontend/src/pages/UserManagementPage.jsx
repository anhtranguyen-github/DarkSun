import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import * as userService from '../services/userService';
import * as roleService from '../services/roleService';
import * as householdService from '../services/householdService';
import { useAuth } from '../context/AuthContext';
import { useApiError } from '../hooks/useApiError';
import Spinner from '../components/common/Spinner';
import './UserManagementPage.css';

const UserManagementPage = () => {
  // =================================================================
  // STATE MANAGEMENT
  // =================================================================
  const { user: currentUser, updateAuthUser } = useAuth();
  const { handleError, handleSuccess, toast } = useApiError();

  // Use ref to store stable references and avoid infinite loops
  const handleErrorRef = useRef(handleError);
  const handleSuccessRef = useRef(handleSuccess);
  const toastRef = useRef(toast);

  useEffect(() => {
    handleErrorRef.current = handleError;
    handleSuccessRef.current = handleSuccess;
    toastRef.current = toast;
  });

  // State cho dữ liệu
  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State cho các bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // State cho Modal Phân quyền
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleToAssign, setRoleToAssign] = useState('');


  const [allHouseholds, setAllHouseholds] = useState([]);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [householdToAssign, setHouseholdToAssign] = useState('');

  // =================================================================
  // DATA FETCHING & LOGIC
  // =================================================================

  // Hàm tải danh sách người dùng
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.getAllUsers();
      setUsers(response.data.data.filter(user => user.status !== 'deleted'));
    } catch (err) {
      setError('Không thể tải danh sách người dùng.');
      handleErrorRef.current(err, { showToast: false });
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - uses refs

  // Effect để tải dữ liệu ban đầu
  useEffect(() => {
    fetchUsers();

    const fetchRoles = async () => {
      try {
        const response = await roleService.getAllRoles();
        setAllRoles(response.data.data);
      } catch (err) {
        handleErrorRef.current(err, { fallbackMessage: 'Không thể tải danh sách vai trò.' });
      }
    };

    const fetchHouseholds = async () => {
      try {
        const res = await householdService.getAllHouseholds();
        setAllHouseholds(res.data.data);
      } catch (err) {
        handleErrorRef.current(err, { fallbackMessage: 'Không thể tải danh sách hộ khẩu.' });
      }
    };

    fetchRoles();
    fetchHouseholds();
  }, [fetchUsers]); // Only depends on fetchUsers which is stable

  // Logic lọc dữ liệu ở phía Frontend
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const term = searchTerm.toLowerCase();
      const matchesSearchTerm = !term ||
        user.username.toLowerCase().includes(term) ||
        user.fullName.toLowerCase().includes(term) ||
        String(user.id).includes(term);
      const matchesRole = !selectedRoleFilter || user.Roles.some(role => role.name === selectedRoleFilter);
      const matchesStatus = !selectedStatus || user.status === selectedStatus;
      return matchesSearchTerm && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRoleFilter, selectedStatus, users]);

  // Logic lọc ra các vai trò có thể gán
  const assignableRoles = useMemo(() => {
    if (!currentUser || !allRoles) return [];
    if (currentUser.roles.includes('Admin')) return allRoles;
    if (currentUser.roles.includes('Tổ trưởng') || currentUser.roles.includes('Tổ phó')) {
      const managerAssignable = ['Tổ trưởng', 'Tổ phó', 'Cư dân'];
      return allRoles.filter(role => managerAssignable.includes(role.name));
    }
    return [];
  }, [allRoles, currentUser]);


  // =================================================================
  // EVENT HANDLERS
  // =================================================================

  const handleToggleLock = async (user) => {
    const newStatus = user.status === 'active' ? 'locked' : 'active';
    const actionText = newStatus === 'locked' ? 'khóa' : 'mở khóa';
    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản "${user.username}"?`)) {
      try {
        await userService.updateUserStatus(user.id, newStatus);
        handleSuccessRef.current(`Đã ${actionText} tài khoản thành công!`);
        fetchUsers();
      } catch (error) {
        handleErrorRef.current(error, { fallbackMessage: 'Thao tác thất bại.' });
      }
    }
  };

  const handleDelete = async (userId, username) => {
    if (window.confirm(`Bạn có chắc chắn muốn XÓA tài khoản "${username}"? Thao tác này không thể hoàn tác.`)) {
      try {
        await userService.deleteUser(userId);
        handleSuccessRef.current('Xóa tài khoản thành công!');
        fetchUsers();
      } catch (error) {
        handleErrorRef.current(error, { fallbackMessage: 'Không thể xóa tài khoản.' });
      }
    }
  };

  const handleOpenAssignRoleModal = (user) => {
    setSelectedUser(user);
    setRoleToAssign('');
    setIsModalOpen(true);
  };


  const handleCloseModal = () => setIsModalOpen(false);

  const handleAssignRole = async () => {
    if (!roleToAssign) {
      toastRef.current.warning('Vui lòng chọn một vai trò để gán.');
      return;
    }
    try {
      const response = await userService.assignRole(selectedUser.id, roleToAssign);
      const updatedUser = response.data.data;
      handleSuccessRef.current('Gán vai trò thành công!');
      handleCloseModal();
      if (currentUser && currentUser.id === updatedUser.id) {
        updateAuthUser(updatedUser);
      }
      fetchUsers();
    } catch (err) {
      handleErrorRef.current(err, { fallbackMessage: 'Gán vai trò thất bại.' });
    }
  };

  const handleOpenHouseholdModal = (user) => {
    setSelectedUser(user);
    // Lấy householdId hiện tại của user để hiển thị trên dropdown
    setHouseholdToAssign(user.householdId || '');
    setIsHouseholdModalOpen(true);
  };
  const handleCloseHouseholdModal = () => setIsHouseholdModalOpen(false);

  const handleAssignHousehold = async () => {
    try {
      // Gửi cả giá trị rỗng (để gỡ)
      await userService.assignHousehold(selectedUser.id, householdToAssign || null);
      handleSuccessRef.current('Cập nhật hộ khẩu thành công!');
      handleCloseHouseholdModal();
      fetchUsers();
    } catch (err) {
      handleErrorRef.current(err, { fallbackMessage: 'Không thể cập nhật hộ khẩu.' });
    }
  };
  // =================================================================
  // RENDER
  // =================================================================

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý Tài khoản Người dùng</h1>
      </div>

      {/* KHU VỰC LỌC */}
      <div className="filter-controls-container card">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm theo ID, Tên, Username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedRoleFilter} onChange={(e) => setSelectedRoleFilter(e.target.value)}>
          <option value="">Tất cả vai trò</option>
          {allRoles.map(role => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="locked">Đã khóa</option>
        </select>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Họ và tên</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>{user.Roles.map(r => r.name).join(', ')}</td>
                  <td>
                    {/* SỬA LỖI CÚ PHÁP Ở ĐÂY */}
                    <span className={`status-badge status-${user.status}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className={user.status === 'active' ? 'lock-btn' : 'unlock-btn'}
                      onClick={() => handleToggleLock(user)}
                    >
                      {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                    </button>
                    <button className="assign-household-btn" onClick={() => handleOpenHouseholdModal(user)}>Gán Hộ</button>
                    <button
                      className="assign-btn"
                      onClick={() => handleOpenAssignRoleModal(user)}
                      disabled={assignableRoles.length === 0}
                    >
                      Phân quyền
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id, user.username)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  Không có người dùng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL GÁN HỘ KHẨU */}
      {isHouseholdModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Gán Hộ khẩu cho: {selectedUser.fullName}</h2>
              <button className="close-btn" onClick={handleCloseHouseholdModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="household-select">Chọn Hộ khẩu</label>
                <select id="household-select" value={householdToAssign} onChange={(e) => setHouseholdToAssign(e.target.value)}>
                  <option value="">-- Gỡ khỏi Hộ khẩu --</option>
                  {allHouseholds.map(h => (
                    <option key={h.id} value={h.id}>{h.apartmentCode} - {h.ownerName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={handleCloseHouseholdModal}>Hủy</button>
              <button type="button" className="submit-btn" onClick={handleAssignHousehold}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PHÂN QUYỀN */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Phân quyền cho: {selectedUser.fullName}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Vai trò hiện tại:</strong> {selectedUser.Roles.map(r => r.name).join(', ') || 'Chưa có'}
              </p>
              <div className="form-group">
                <label htmlFor="role-select">Chọn vai trò để gán thêm:</label>
                <select id="role-select" value={roleToAssign} onChange={(e) => setRoleToAssign(e.target.value)}>
                  <option value="" disabled>-- Chọn vai trò --</option>
                  {assignableRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
              <button type="button" className="submit-btn" onClick={handleAssignRole}>Xác nhận Gán</button>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};

export default UserManagementPage;