import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as feeService from '../services/feeService';
import './FeeTypeManagement.css'; // Sử dụng file CSS mới
import { useAuth } from '../context/AuthContext'; // Import hook useAuth
import { useApiError } from '../hooks/useApiError'; // Import hook for error handling

const FeeTypeManagement = () => {

  const { user } = useAuth(); // Lấy thông tin user đang đăng nhập
  const { handleError, handleSuccess } = useApiError(); // Sử dụng hook error handling

  // Use ref to avoid infinite loops
  const handleErrorRef = useRef(handleError);
  const handleSuccessRef = useRef(handleSuccess);

  useEffect(() => {
    handleErrorRef.current = handleError;
    handleSuccessRef.current = handleSuccess;
  });

  // Xác định quyền hạn của người dùng
  const canEdit = user?.roles?.includes('Kế toán') || user?.roles?.includes('Admin');
  // State quản lý dữ liệu
  const [feeTypes, setFeeTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFeeType, setCurrentFeeType] = useState(null); // null: tạo mới, object: chỉnh sửa

  // State quản lý Form
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    price: '',
    description: '',
  });

  // 1. Tải dữ liệu ban đầu
  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const fetchFeeTypes = async () => {
    setIsLoading(true);
    try {
      const response = await feeService.getAllFeeTypes();
      setFeeTypes(response.data.data || []);
    } catch (error) {
      handleErrorRef.current(error, { fallbackMessage: 'Không thể tải danh sách loại phí.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Lọc dữ liệu dựa trên ô tìm kiếm
  const filteredFeeTypes = useMemo(() => {
    if (!searchTerm) return feeTypes;
    return feeTypes.filter(fee =>
      fee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, feeTypes]);


  // 3. Xử lý các hành động với Modal
  const handleOpenModal = (feeType = null) => {
    if (feeType) { // Chế độ chỉnh sửa
      setCurrentFeeType(feeType);
      setFormData({
        name: feeType.name,
        unit: feeType.unit,
        price: feeType.price,
        description: feeType.description || '',
      });
    } else { // Chế độ tạo mới
      setCurrentFeeType(null);
      setFormData({ name: '', unit: '', price: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentFeeType(null);
  };

  // 4. Xử lý Form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (currentFeeType) {
        await feeService.updateFeeType(currentFeeType.id, formData);
        handleSuccessRef.current('Cập nhật loại phí thành công!');
      } else {
        await feeService.createFeeType(formData);
        handleSuccessRef.current('Tạo mới loại phí thành công!');
      }
      handleCloseModal();
      fetchFeeTypes(); // Tải lại danh sách
    } catch (error) {
      handleErrorRef.current(error, { fallbackMessage: 'Thao tác thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Xử lý Xóa
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại phí này?')) {
      setIsLoading(true);
      try {
        await feeService.deleteFeeType(id);
        handleSuccessRef.current('Xóa loại phí thành công!');
        fetchFeeTypes();
      } catch (error) {
        handleErrorRef.current(error, { fallbackMessage: 'Không thể xóa loại phí.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="page-container">
      {/* Phần tiêu đề và thanh chức năng */}
      <div className="page-header">
        <h1>Quản lý phí</h1>
        <div className="action-bar">
          {canEdit && (
            <button className="add-btn" onClick={() => handleOpenModal()}>Thêm</button>
          )}
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên phí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Phần bảng hiển thị dữ liệu */}
      <div className="table-container">
        <table className="fee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên phí</th>
              <th>Đơn vị</th>
              <th>Đơn giá</th>
              <th>Chú thích</th>
              {canEdit && <th>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {filteredFeeTypes.map((fee) => (
              <tr key={fee.id}>
                <td>{fee.id}</td>
                <td>{fee.name}</td>
                <td>{fee.unit}</td>
                <td>{Number(fee.price).toLocaleString('vi-VN')}</td>
                <td>{fee.description}</td>
                {canEdit && (
                  <td className="action-cell">
                    <button className="edit-btn" onClick={() => handleOpenModal(fee)}>Sửa</button>
                    <button className="delete-btn" onClick={() => handleDelete(fee.id)}>Xóa</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal để Thêm/Sửa */}
      {isModalOpen && canEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{currentFeeType ? 'Chỉnh sửa Loại phí' : 'Thêm Loại phí mới'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên loại phí</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Đơn vị tính</label>
                <input name="unit" value={formData.unit} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Đơn giá</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Chú thích</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="submit-btn">{currentFeeType ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeTypeManagement;