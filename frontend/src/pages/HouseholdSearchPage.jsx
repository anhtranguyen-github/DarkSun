
import './HouseholdSearchPage.css';
import React, { useState } from 'react';
import * as householdService from '../services/householdService';
import * as residentService from '../services/residentService';
import Spinner from '../components/common/Spinner';
 // Sẽ tạo file CSS sau

const HouseholdSearchPage = () => {
  const [filters, setFilters] = useState({
    apartmentCode: '',
    ownerName: '',
    address: '',
    apartmentType: '',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

// --- STATE MỚI CHO MODAL CHI TIẾT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null); // Hộ khẩu đang được xem
  const [residentsInHousehold, setResidentsInHousehold] = useState([]); // Danh sách nhân khẩu
  const [modalLoading, setModalLoading] = useState(false);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    try {
      const response = await householdService.getAllHouseholds(filters);
      setResults(response.data.data);
    } catch (error) {
      alert('Lỗi khi truy vấn dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM MỚI ĐỂ MỞ MODAL VÀ TẢI DỮ LIỆU CHI TIẾT ---
  const handleViewDetails = async (household) => {

    if (!household || !household.id) {
      console.error("Không thể xem chi tiết: Dữ liệu hộ khẩu không hợp lệ hoặc thiếu ID.", household);
      alert("Đã có lỗi xảy ra, không thể xem chi tiết hộ khẩu này.");
      return;
    }
    
    setSelectedHousehold(household);
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const response = await residentService.getResidentsByHousehold(household.id);
      setResidentsInHousehold(response.data.data);
    } catch (error) {
      console.error("Lỗi tải danh sách nhân khẩu:", error);
      // Có thể hiển thị lỗi trong modal
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Truy vấn Thông tin Hộ khẩu</h1>
      </div>

      <form className="filter-form card" onSubmit={handleSearch}>
        <div className="filter-grid">
          <div className="filter-group">
            <label>Mã hộ khẩu</label>
            <input type="text" name="apartmentCode" value={filters.apartmentCode} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <label>Tên chủ hộ</label>
            <input type="text" name="ownerName" value={filters.ownerName} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <label>Địa chỉ</label>
            <input type="text" name="address" value={filters.address} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <label>Loại căn hộ</label>
            <select name="apartmentType" value={filters.apartmentType} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              <option value="Studio">Studio</option>
              <option value="1 phòng ngủ">1 phòng ngủ</option>
              <option value="2 phòng ngủ">2 phòng ngủ</option>
              <option value="3 phòng ngủ">3 phòng ngủ</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
        </div>
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>

      {loading && <Spinner />}
      {results && !loading && (
        <div className="results-container">
          <h4>Tìm thấy {results.length} kết quả</h4>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã hộ khẩu</th><th>Tên chủ hộ</th><th>Địa chỉ</th><th>Loại căn hộ</th><th>Số thành viên</th>
                </tr>
              </thead>
              <tbody>
                {results.map(h => (
                  <tr key={h.id}>
                    <td>{h.apartmentCode}</td>
                    <td>{h.ownerName}</td>
                    <td>{h.address}</td>
                    <td>{h.apartmentType}</td>
                    <td>{h.memberCount}</td>
                    <td className="action-cell">
                      <button className="view-details-btn" onClick={() => handleViewDetails(h)}>
                        Xem chi tiết
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
        <p className="no-results">Không tìm thấy hộ khẩu nào phù hợp.</p>
      )}
      {/* MODAL HIỂN THỊ THÔNG TIN CHI TIẾT */}
      {isModalOpen && selectedHousehold && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>Chi tiết Hộ khẩu: {selectedHousehold.apartmentCode}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              {modalLoading ? <Spinner /> : (
                <>
                  {/* Phần thông tin chung */}
                  <div className="household-details-grid">
                    <div><strong>Chủ hộ:</strong> {selectedHousehold.ownerName}</div>
                    <div><strong>Địa chỉ:</strong> {selectedHousehold.address}</div>
                    <div><strong>Loại căn hộ:</strong> {selectedHousehold.apartmentType}</div>
                    <div><strong>Diện tích:</strong> {selectedHousehold.area} m²</div>
                    <div><strong>Số thành viên:</strong> {selectedHousehold.memberCount}</div>
                    <div><strong>Trạng thái:</strong> {selectedHousehold.status}</div>
                  </div>
                  
                  <hr />

                  {/* Phần danh sách nhân khẩu */}
                  <h4>Danh sách Nhân khẩu</h4>
                  <div className="table-container nested">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Họ tên</th><th>Ngày sinh</th><th>Giới tính</th><th>CCCD</th><th>Quan hệ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {residentsInHousehold.map(res => (
                          <tr key={res.id}>
                            <td>{res.fullName}</td>
                            <td>{new Date(res.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                            <td>{res.gender}</td>
                            <td>{res.idCardNumber}</td>
                            <td>{res.relationship}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdSearchPage;