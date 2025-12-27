import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import hook useAuth để lấy thông tin người dùng

import * as financeService from '../services/financeService';
import * as feeService from '../services/feeService';
import * as periodFeeService from '../services/periodFeeService';
import * as invoiceService from '../services/invoiceService';
import Spinner from '../components/common/Spinner';
import './FeePeriodDetailPage.css'; // Dùng lại CSS cũ

const FeePeriodDetailPage = () => {
  const { id: feePeriodId } = useParams(); // Lấy ID của đợt thu
  const { user } = useAuth(); // Lấy thông tin người dùng từ context
  const canEdit = user?.roles?.includes('Kế toán') || user?.roles?.includes('Admin'); // Kiểm tra quyền hạn
  
  // State cho dữ liệu
  const [period, setPeriod] = useState(null); // Thông tin đợt thu
  const [periodFees, setPeriodFees] = useState([]); // Danh sách các khoản thu trong đợt
  const [allFeeTypes, setAllFeeTypes] = useState([]); // Danh sách tất cả loại phí để chọn
  const [loading, setLoading] = useState(true);

  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPeriodFee, setCurrentPeriodFee] = useState(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [descriptionToShow, setDescriptionToShow] = useState('');
  const [formData, setFormData] = useState({
    feeTypeId: '', amount: '', description: '', type: 'Bắt buộc'
  });

  // Tải tất cả dữ liệu cần thiết
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [periodRes, periodFeesRes, feeTypesRes] = await Promise.all([
        financeService.getFeePeriodById(feePeriodId),
        periodFeeService.getFeesInPeriod(feePeriodId),
        feeService.getAllFeeTypes()
      ]);
      setPeriod(periodRes.data.data);
      setPeriodFees(periodFeesRes.data.data);
      setAllFeeTypes(feeTypesRes.data.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu trang chi tiết:", error);
    } finally {
      setLoading(false);
    }
  }, [feePeriodId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logic cho Modal
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
  const handleCloseModal = () => setIsModalOpen(false);
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOpenDescriptionModal = (description) => {
    setDescriptionToShow(description);
    setIsDescriptionModalOpen(true);
  };

  const handleCloseDescriptionModal = () => {
    setIsDescriptionModalOpen(false);
    setDescriptionToShow('');
  };

  // Logic Thêm/Sửa Khoản thu
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPeriodFee) {
        await periodFeeService.updateFeeInPeriod(currentPeriodFee.id, formData);
      } else {
        await periodFeeService.addFeeToPeriod(feePeriodId, formData);
      }
      handleCloseModal();
      fetchData(); // Tải lại toàn bộ dữ liệu
    } catch (err) { alert('Thao tác thất bại: ' + (err.response?.data?.message || err.message)); }
  };

  // Logic Xóa Khoản thu
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khoản thu này khỏi đợt thu?')) {
      try {
        await periodFeeService.deleteFeeInPeriod(id);
        fetchData();
      } catch (err) { alert('Xóa thất bại: ' + (err.response?.data?.message || err.message)); }
    }
  };
  
  // Logic Phát hành Hóa đơn
  const handleGenerateInvoices = async () => {
    if (!window.confirm(`Phát hành hóa đơn cho đợt thu "${period.name}"? Thao tác này sẽ tạo hóa đơn cho tất cả hộ dân và không thể hoàn tác.`)) return;
    try {
      // API này không cần body nữa
      const response = await invoiceService.generateInvoicesForPeriod(feePeriodId);
      alert(response.data.message);
    } catch (err) { alert('Lỗi: ' + (err.response?.data?.message || 'Thao tác thất bại.')); }
  };

  if (loading) return <Spinner />;
  if (!period) return <div>Không tìm thấy đợt thu phí.</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Chi tiết Đợt thu: {period.name}</h1>
        {canEdit && (
          <button onClick={handleGenerateInvoices} className="generate-btn">
            Phát hành Hóa đơn hàng loạt
          </button>
        )}
      </div>

      <div className="action-card">
        <h2>Danh sách Khoản thu trong Đợt</h2>
        {canEdit && (
          <button className="add-btn" onClick={() => handleOpenModal()}>Thêm Khoản thu</button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên Khoản thu</th>
              <th>Số tiền</th>
              <th>Loại hình</th>
              <th>Mô tả</th>
              {canEdit && <th>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {periodFees.map(pf => (
              <tr key={pf.id}>
                <td>{pf.FeeType?.name}</td>
                <td>{Number(pf.amount).toLocaleString('vi-VN')} đ</td>
                <td>{pf.type}</td>
                <td>
                  {pf.description ? (
                    <button 
                      className="view-description-btn" 
                      onClick={() => handleOpenDescriptionModal(pf.description)}
                    >
                      Xem
                    </button>
                  ) : (
                    <span className="no-description">(Không có)</span>
                  )}
                </td>
                {canEdit && (
                  <td className="action-cell">
                    <button className="edit-btn" onClick={() => handleOpenModal(pf)}>Sửa</button>
                    <button className="delete-btn" onClick={() => handleDelete(pf.id)}>Xóa</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM/SỬA KHOẢN THU */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{currentPeriodFee ? 'Chỉnh sửa Khoản thu' : 'Thêm Khoản thu vào Đợt'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Loại phí*</label>
                <select name="feeTypeId" value={formData.feeTypeId} onChange={handleInputChange} required disabled={!!currentPeriodFee}>
                  <option value="" disabled>-- Chọn loại phí --</option>
                  {allFeeTypes.map(ft => <option key={ft.id} value={ft.id}>{ft.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Số tiền*</label><input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required /></div>
              <div className="form-group">
                <label>Loại hình*</label>
                <select name="type" value={formData.type} onChange={handleInputChange} required>
                  <option value="Bắt buộc">Bắt buộc</option><option value="Đóng góp">Đóng góp</option>
                </select>
              </div>
              <div className="form-group"><label>Mô tả</label><textarea name="description" value={formData.description} onChange={handleInputChange}></textarea></div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="submit-btn">{currentPeriodFee ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MỚI ĐỂ XEM MÔ TẢ */}
      {isDescriptionModalOpen && (
        <div className="modal-overlay" onClick={handleCloseDescriptionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết Mô tả</h2>
              <button className="close-btn" onClick={handleCloseDescriptionModal}>×</button>
            </div>
            <div className="modal-body description-body">
              <p>{descriptionToShow}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="submit-btn" onClick={handleCloseDescriptionModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeePeriodDetailPage;