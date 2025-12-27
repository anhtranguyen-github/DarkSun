import React, { useState } from 'react';
import * as statisticsService from '../services/statisticsService';
import Spinner from '../components/common/Spinner';
import './HouseholdStatsPage.css'; // Sẽ tạo file CSS sau

const HouseholdStatsPage = () => {
  const [filters, setFilters] = useState({
    area: '',
    apartmentType: '',
  });
  const [results, setResults] = useState(null); // null: chưa tìm, object: đã có kết quả
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    try {
      const response = await statisticsService.getHouseholdStats(filters);
      setResults(response.data);
    } catch (error) {
      alert('Lỗi khi lấy dữ liệu thống kê.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      await statisticsService.exportHouseholdStatsToExcel(filters);
    } catch (error) {
      alert('Lỗi khi xuất file Excel.');
      console.error(error);
    }
  };

  const handleExportPdf = async () => {
    try {
      await statisticsService.exportHouseholdStatsToPdf(filters);
    } catch (error) {
      alert('Lỗi khi xuất file PDF.');
      console.error(error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Thống kê Hộ khẩu</h1>
      </div>

      <form className="filter-form card" onSubmit={handleSearch}>
        <div className="filter-grid">
        <div className="filter-group">
          <label>Khu vực (Địa chỉ/Mã căn hộ)</label>
          <input type="text" name="area" placeholder="VD: Block A, Tầng 3" value={filters.area} onChange={handleFilterChange} />
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
        <div className="filter-group">
          <label>Số thành viên</label>
          <input type="number" name="memberCount" placeholder='VD: 4' value={filters.memberCount} onChange={handleFilterChange} />
        </div>
        </div>
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Thống kê'}
        </button>
      </form>

      {loading && <Spinner />}

      {results && !loading && (
        <div className="results-container">
          <div className="summary-grid">
            <div className="summary-card">
              <h4>Tổng số hộ gia đình</h4>
              <span>{results.summary.householdCount}</span>
            </div>
            <div className="summary-card">
              <h4>Tổng số nhân khẩu</h4>
              <span>{results.summary.totalMemberCount}</span>
            </div>
          </div>

          <div className="action-bar">
            <button onClick={handleExportExcel} className="export-btn excel">Xuất Excel</button>
            <button onClick={handleExportPdf} className="export-btn pdf">Xuất PDF</button>
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
                </tr>
              </thead>
              <tbody>
                {results.data.map(household => (
                  <tr key={household.id}>
                    <td>{household.apartmentCode}</td>
                    <td>{household.ownerName}</td>
                    <td>{household.address}</td>
                    <td>{household.apartmentType}</td>
                    <td>{household.memberCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {results && results.summary.householdCount === 0 && !loading && (
        <p className="no-results">Không có dữ liệu phù hợp với tiêu chí đã chọn.</p>
      )}
    </div>
  );
};

export default HouseholdStatsPage;