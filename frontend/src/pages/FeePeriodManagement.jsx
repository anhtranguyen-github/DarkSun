import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as financeService from '../services/financeService';
import Spinner from '../components/common/Spinner'; // Giả sử bạn có component Spinner
import './FeePeriodManagement.css'; // Sẽ tạo file CSS sau
import { useAuth } from '../context/AuthContext'; // Import hook useAuth để lấy thông tin người dùng

const FeePeriodManagement = () => {

  const { user } = useAuth();
  const canEdit = user?.roles?.includes('Kế toán') || user?.roles?.includes('Admin');

  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(null); // null: tạo mới
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    type: 'Bắt buộc',
    description: ''
  });
  
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await financeService.getAllFeePeriods();
        setPeriods(response.data.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách đợt thu:", err);
        setError('Không thể tải dữ liệu từ server.');
      } finally {
        setLoading(false);
      }
    };
    fetchPeriods();
  }, []);

  // --- CÁC HÀM XỬ LÝ CHO MODAL ---
  const handleOpenModal = (period = null) => {
    // Hiện tại chỉ hỗ trợ tạo mới, logic sửa sẽ thêm sau nếu cần
    setCurrentPeriod(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      type: 'Bắt buộc',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Logic cho sửa sẽ thêm ở đây
      // if (currentPeriod) { ... }
      await financeService.createFeePeriod(formData);
      alert('Tạo đợt thu mới thành công!');
      handleCloseModal();
      fetchPeriods(); // Tải lại danh sách
    } catch (error) {
      alert('Thao tác thất bại: ' + (error.response?.data?.message || 'Lỗi không xác định'));
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý Đợt thu phí</h1>
        {/* Gắn sự kiện onClick cho nút */}
        {canEdit && (
          <button className="add-btn" onClick={() => handleOpenModal()}>Thêm Đợt thu mới</button>
        )}
      </div>

      <div className="list-container">
        {periods.length > 0 ? (
          periods.map(period => (
            <div key={period.id} className="list-item-card">
              <div className="item-info">
                <h3>{period.name}</h3>
                <div className="item-details">
                  <span>Loại hình: <span className={`type-badge type-${period.type === 'Bắt buộc' ? 'mandatory' : 'voluntary'}`}>{period.type}</span></span>
                  <span>Thời gian: {new Date(period.startDate).toLocaleDateString('vi-VN')} - {new Date(period.endDate).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <Link to={`/fee-periods/${period.id}`} className="details-btn">
              {/* Thay đổi text của nút tùy theo quyền */}
              {canEdit ? 'Quản lý Khoản thu →' : 'Xem chi tiết →'}
            </Link>
            </div>
          ))
        ) : (
          <p className="no-data-message">Chưa có đợt thu phí nào được tạo.</p>
        )}
      </div>

      {/* MODAL ĐỂ THÊM ĐỢT THU MỚI */}
      {isModalOpen && canEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Thêm Đợt thu mới</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên Đợt thu*</label>
                <input name="name" placeholder="VD: Thu phí tháng 6/2025" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Ngày bắt đầu*</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Ngày kết thúc*</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Loại hình*</label>
                <select name="type" value={formData.type} onChange={handleInputChange} required>
                  <option value="Bắt buộc">Bắt buộc</option>
                  <option value="Đóng góp">Đóng góp</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="submit-btn">Thêm mới</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeePeriodManagement;