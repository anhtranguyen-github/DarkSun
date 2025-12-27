import React, { useState, useEffect, useCallback } from 'react';
import * as residentService from '../services/residentService';
import * as householdService from '../services/householdService';
import Spinner from '../components/common/Spinner';
import './UserManagementPage.css'; // Dùng lại CSS của trang User


// Định nghĩa các lựa chọn cho dropdown ở đây để dễ quản lý
const RELATIONSHIP_OPTIONS = ['Chủ hộ', 'Vợ', 'Chồng', 'Con', 'Bố', 'Mẹ', 'Anh', 'Chị', 'Em', 'Ông', 'Bà', 'Cháu', 'Khác'];

const ResidentManagementPage = () => {
  const [residents, setResidents] = useState([]);
  const [households, setHouseholds] = useState([]); // State để chứa danh sách hộ khẩu cho dropdown
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResident, setCurrentResident] = useState(null);
  const [formData, setFormData] = useState({
    householdId: '', fullName: '', dateOfBirth: '', gender: 'Nam',
    idCardNumber: '', relationship: 'Con', occupation: ''
  });



  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [residentsRes, householdsRes] = await Promise.all([
        residentService.getAllResidents(),
        householdService.getAllHouseholds()
      ]);
      setResidents(residentsRes.data.data);
      setHouseholds(householdsRes.data.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleOpenModal = (resident = null) => {
    if (resident) {
      setCurrentResident(resident);
      setFormData({
        householdId: resident.householdId,
        fullName: resident.fullName,
        dateOfBirth: resident.dateOfBirth ? new Date(resident.dateOfBirth).toISOString().split('T')[0] : '',
        gender: resident.gender,
        idCardNumber: resident.idCardNumber || '',
        relationship: resident.relationship || '',
        occupation: resident.occupation || '',
      });
    } else {
      setCurrentResident(null);
      setFormData({
        householdId: '', fullName: '', dateOfBirth: '', gender: 'Nam',
        idCardNumber: '', relationship: '', occupation: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentResident) {
        await residentService.updateResident(currentResident.id, formData);
      } else {
        await residentService.createResident(formData);
      }
      handleCloseModal();
      fetchAllData();
    } catch (err) {
      alert('Thao tác thất bại: ' + (err.response?.data?.message || err.message));
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

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý Nhân khẩu</h1>
        <button className="add-btn" onClick={() => handleOpenModal()}>Thêm Nhân khẩu</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Họ tên</th><th>Hộ khẩu</th><th>Ngày sinh</th><th>Giới tính</th><th>Số CCCD</th><th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {residents.map(res => (
              <tr key={res.id}>
                <td>{res.fullName}</td>
                <td>{res.Household?.apartmentCode}</td>
                <td>{new Date(res.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                <td>{res.gender}</td>
                <td>{res.idCardNumber}</td>
                <td className="action-cell">
                  <button className="edit-btn" onClick={() => handleOpenModal(res)}>Sửa</button>
                  <button className="delete-btn" onClick={() => handleDelete(res.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{currentResident ? 'Chỉnh sửa Nhân khẩu' : 'Thêm Nhân khẩu mới'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Thuộc Hộ khẩu*</label>
                <select name="householdId" value={formData.householdId} onChange={handleInputChange} required>
                  <option value="" disabled>-- Chọn hộ khẩu --</option>
                  {households.map(h => <option key={h.id} value={h.id}>{h.apartmentCode} - {h.ownerName}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Họ và tên*</label><input name="fullName" value={formData.fullName} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Ngày sinh*</label><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required /></div>
              <div className="form-group">
                <label>Giới tính*</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                  <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
                </select>
              </div>
              <div className="form-group"><label>Số CCCD</label><input name="idCardNumber" value={formData.idCardNumber} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Quan hệ với chủ hộ</label>
               <select name="relationship" value={formData.relationship} onChange={handleInputChange} required>
                  {RELATIONSHIP_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                </div>
              <div className="form-group"><label>Nghề nghiệp</label><input name="occupation" value={formData.occupation} onChange={handleInputChange} /></div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="submit-btn">{currentResident ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentManagementPage;