import React, { useState, useEffect, useCallback } from 'react';
import * as householdService from '../services/householdService';
import Spinner from '../components/common/Spinner';
import './HouseholdManagementPage.css';

const HouseholdManagementPage = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHousehold, setCurrentHousehold] = useState(null);
  
  // State của form khớp với đặc tả
  const [formData, setFormData] = useState({
    apartmentCode: '',
    ownerName: '',
    address: '',
    memberCount: '',
    apartmentType: '', // Giá trị mặc định cho dropdown
    area: '',
    status: 'occupied',
  });

  const fetchHouseholds = useCallback(async () => {
    try {
      setLoading(true);
      const response = await householdService.getAllHouseholds();
      setHouseholds(response.data.data);
    } catch (err) {
      setError('Không thể tải dữ liệu hộ khẩu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);
  
  const handleOpenModal = (household = null) => {
    if (household) {
      setCurrentHousehold(household);
      setFormData({
        apartmentCode: household.apartmentCode,
        ownerName: household.ownerName,
        address: household.address,
        memberCount: household.memberCount,
        apartmentType: household.apartmentType,
        area: household.area || '',
        status: household.status,
      });
    } else {
      setCurrentHousehold(null);
      // Đặt giá trị mặc định cho apartmentType là lựa chọn đầu tiên hoặc rỗng
      setFormData({ apartmentCode: '', ownerName: '', address: '', memberCount: '', apartmentType: 'Studio', area: '', status: 'occupied' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentHousehold) {
        await householdService.updateHousehold(currentHousehold.id, formData);
      } else {
        await householdService.createHousehold(formData);
      }
      handleCloseModal();
      fetchHouseholds();
    } catch (err) {
      alert('Thao tác thất bại: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hộ khẩu này?')) {
      try {
        await householdService.deleteHousehold(id);
        fetchHouseholds();
      } catch (err) {
        alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý Hộ khẩu</h1>
        <button className="add-btn" onClick={() => handleOpenModal()}>Thêm Hộ khẩu</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã hộ khẩu</th>
              <th>Tên chủ hộ</th>
              <th>Địa chỉ</th>
              <th>Loại căn hộ</th>
              <th>Số thành viên</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {households.length > 0 ? (
              households.map(h => (
                <tr key={h.id}>
                  <td>{h.apartmentCode}</td>
                  <td>{h.ownerName}</td>
                  <td>{h.address}</td>
                  <td>{h.apartmentType}</td>
                  <td>{h.memberCount}</td>
                  <td className="action-cell">
                    <button className="edit-btn" onClick={() => handleOpenModal(h)}>Sửa</button>
                    <button className="delete-btn" onClick={() => handleDelete(h.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : ( <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không có dữ liệu hộ khẩu.</td></tr> )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{currentHousehold ? 'Chỉnh sửa Hộ khẩu' : 'Thêm Hộ khẩu mới'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group"><label>Mã hộ khẩu*</label><input name="apartmentCode" value={formData.apartmentCode} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Tên chủ hộ*</label><input name="ownerName" value={formData.ownerName} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Địa chỉ*</label><input name="address" value={formData.address} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Số thành viên*</label><input type="number" name="memberCount" value={formData.memberCount} onChange={handleInputChange} required /></div>
              
              {/* === SỬA ĐỔI QUAN TRỌNG Ở ĐÂY === */}
              <div className="form-group">
                <label>Loại căn hộ*</label>
                <select name="apartmentType" value={formData.apartmentType} onChange={handleInputChange} required>
                  <option value="Studio">Studio</option>
                  <option value="1 phòng ngủ">1 phòng ngủ</option>
                  <option value="2 phòng ngủ">2 phòng ngủ</option>
                  <option value="3 phòng ngủ">3 phòng ngủ</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>
              
              <div className="form-group"><label>Diện tích (m²) (Tùy chọn)</label><input type="number" step="0.01" name="area" value={formData.area} onChange={handleInputChange} /></div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="submit-btn">{currentHousehold ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdManagementPage;