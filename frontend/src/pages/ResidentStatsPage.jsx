import React, { useState } from 'react';
import * as statisticsService from '../services/statisticsService';
import Spinner from '../components/common/Spinner';
import './ResidentStatsPage.css'; // Sẽ tạo file CSS sau

const ResidentStatsPage = () => {
  const [filters, setFilters] = useState({
    area: '',
    gender: '',
    ageGroup: '',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExportExcel = async () => {
      try {
        await statisticsService.exportResidentStatsToExcel(filters);
      } catch (error) {
        alert('Lỗi khi xuất file Excel.');
        console.error(error);
      }
    };
  
    const handleExportPdf = async () => {
      try {
        await statisticsService.exportResidentStatsToPdf(filters);
      } catch (error) {
        alert('Lỗi khi xuất file PDF.');
        console.error(error);
      }
    };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    try {
      const response = await statisticsService.getResidentStats(filters);
      setResults(response.data);
    } catch (error) {
      alert('Lỗi khi lấy dữ liệu thống kê.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Thống kê Nhân khẩu</h1>
      </div>

      <form className="filter-form card" onSubmit={handleSearch}>
        <div className="filter-grid">
        <div className="filter-group">
          <label>Khu vực</label>
          <input type="text" name="area" placeholder="VD: Block A, Tầng 3" value={filters.area} onChange={handleFilterChange} />
        </div>
        <div className="filter-group">
          <label>Giới tính</label>
          <select name="gender" value={filters.gender} onChange={handleFilterChange}>
            <option value="">Tất cả</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Độ tuổi</label>
          <select name="ageGroup" value={filters.ageGroup} onChange={handleFilterChange}>
            <option value="">Tất cả</option>
            <option value="<18">Dưới 18</option>
            <option value="18-35">18 - 35</option>
            <option value="36-60">36 - 60</option>
            <option value=">60">Trên 60</option>
          </select>
        </div>
        </div>
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Thống kê'}
        </button>
      </form>

      {loading && <Spinner />}
      
      {results && !loading && (
        <div className="results-container">
          <div className="summary-card">
            <h3>Kết quả Thống kê</h3>
            <p>Tìm thấy <strong>{results.count}</strong> nhân khẩu phù hợp.</p>
            <div className="action-bar">
              <button onClick={handleExportExcel} className="export-btn excel">Xuất Excel</button>
              <button onClick={handleExportPdf} className="export-btn pdf">Xuất PDF</button>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Họ và tên</th><th>Giới tính</th><th>Ngày sinh</th><th>Thuộc Hộ khẩu</th>
                </tr>
              </thead>
              <tbody>
                {results.data.map(resident => (
                  <tr key={resident.id}>
                    <td>{resident.fullName}</td>
                    <td>{resident.gender}</td>
                    <td>{new Date(resident.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                    <td>{resident.Household?.apartmentCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {results && results.count === 0 && !loading && (
        <p className="no-results">Không có dữ liệu phù hợp với tiêu chí đã chọn.</p>
      )}
    </div>
  );
};

export default ResidentStatsPage;