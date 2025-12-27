import React, { useState } from 'react';
import * as residentService from '../services/residentService';
import Spinner from '../components/common/Spinner';
import './ResidentSearchPage.css'; // Sẽ tạo file CSS sau

const ResidentSearchPage = () => {
  const [filters, setFilters] = useState({
    fullName: '',
    householdCode: '',
    idCardNumber: '',
    relationship: 'Chủ hộ', // Mặc định là Chủ hộ
  });
  const RELATIONSHIP_OPTIONS = ['Chủ hộ', 'Vợ', 'Chồng', 'Con', 'Bố', 'Mẹ', 'Anh', 'Chị', 'Em', 'Ông', 'Bà', 'Cháu', 'Khác'];
  
  // State cho kết quả và modal
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    // Luồng thay thế 3a: Yêu cầu nhập ít nhất 1 trường
    if (Object.values(filters).every(val => val === '')) {
      alert('Vui lòng nhập ít nhất một tiêu chí tìm kiếm.');
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const response = await residentService.getAllResidents(filters);
      setResults(response.data.data);
    } catch (error) {
      alert('Lỗi khi truy vấn dữ liệu.');
    } finally {
      setLoading(false);
    }
  };
  // Mở modal để xem chi tiết
  const handleViewDetails = (resident) => {
    setSelectedResident(resident);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Truy vấn / Tìm kiếm Nhân khẩu</h1>
      </div>

      <form className="filter-form card" onSubmit={handleSearch}>
        <div className="filter-grid">
          <div className="filter-group">
            <label>Họ tên</label>
            <input type="text" name="fullName" value={filters.fullName} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <label>Mã hộ khẩu</label>
            <input type="text" name="householdCode" value={filters.householdCode} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <label>Số CCCD</label>
            <input type="text" name="idCardNumber" value={filters.idCardNumber} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <label>Quan hệ với chủ hộ</label>
           <select name="relationship" value={filters.relationship} onChange={handleFilterChange}>
              {RELATIONSHIP_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>

      {/* KHU VỰC HIỂN THỊ KẾT QUẢ */}
      {loading && <Spinner />}
      {results && !loading && (
        <div className="results-container">
          <h4>Tìm thấy {results.length} kết quả</h4>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Họ tên</th><th>Hộ khẩu</th><th>Ngày sinh</th><th>Giới tính</th><th>Số CCCD</th>
                </tr>
              </thead>
              <tbody>
                {results.map(resident => (
                  <tr key={resident.id}>
                    <td>{resident.fullName}</td>
                    <td>{resident.Household?.apartmentCode}</td>
                    <td>{new Date(resident.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                    <td>{resident.gender}</td>
                    <td>{resident.idCardNumber}</td>
                    <td className="action-cell">
                      <button className="view-details-btn" onClick={() => handleViewDetails(resident)}>
                        Xem đầy đủ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {results && results.length === 0 && !loading && (
        <p className="no-results">Không có kết quả nào phù hợp.</p>
      )}
     {/* MODAL HIỂN THỊ THÔNG TIN CHI TIẾT */}
      {isModalOpen && selectedResident && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>Chi tiết Nhân khẩu: {selectedResident.fullName}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="household-details-grid">
                <div><strong>Hộ khẩu:</strong> {selectedResident.Household?.apartmentCode}</div>
                <div><strong>Ngày sinh:</strong> {new Date(selectedResident.dateOfBirth).toLocaleDateString('vi-VN')}</div>
                <div><strong>Giới tính:</strong> {selectedResident.gender}</div>
                <div><strong>Số CCCD:</strong> {selectedResident.idCardNumber || '(chưa có)'}</div>
                <div><strong>Quan hệ với chủ hộ:</strong> {selectedResident.relationship || '(chưa có)'}</div>
                <div><strong>Nghề nghiệp:</strong> {selectedResident.occupation || '(chưa có)'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentSearchPage;