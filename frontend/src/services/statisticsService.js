import apiClient from './api';

/**
 * Lấy dữ liệu thống kê hộ khẩu với các bộ lọc
 * @param {object} filters - Object chứa các tiêu chí lọc, ví dụ: { area: 'Block A' }
 * @returns {Promise}
 */
export const getHouseholdStats = (filters = {}) => {
  // Loại bỏ các filter rỗng trước khi gửi đi để URL được sạch sẽ
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== '')
  );
  return apiClient.get('/statistics/households', { params: activeFilters });
};


export const getResidentStats = (filters = {}) => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value)
  );
  return apiClient.get('/statistics/residents', { params: activeFilters });
};

// Hàm helper để xử lý việc tải file
const handleFileDownload = async (response, filename) => {
  // Tạo một URL tạm thời cho dữ liệu file đã tải về
  const url = window.URL.createObjectURL(new Blob([response.data]));
  
  // Tạo một thẻ <a> ẩn
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename); // Đặt tên file sẽ được tải về
  
  // Gắn thẻ <a> vào DOM, click vào nó, và sau đó gỡ bỏ
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url); // Giải phóng bộ nhớ
};


// HÀM MỚI ĐỂ XUẤT FILE
export const exportHouseholdStatsToExcel = async (filters = {}) => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v)
  );
  
  // Sử dụng apiClient để gửi request, và quan trọng là đặt responseType là 'blob'
  const response = await apiClient.get('/statistics/households/export/excel', {
    params: activeFilters,
    responseType: 'blob', // Báo cho axios biết chúng ta đang mong đợi một file
  });
  
  // Gọi hàm helper để xử lý việc tải xuống
  await handleFileDownload(response, 'BaoCaoHoKhau.xlsx');
};

// HÀM MỚI ĐỂ XUẤT PDF
export const exportHouseholdStatsToPdf = async (filters = {}) => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v)
  );
  
  const response = await apiClient.get('/statistics/households/export/pdf', {
    params: activeFilters,
    responseType: 'blob',
  });
  
  await handleFileDownload(response, 'BaoCaoHoKhau.pdf');
};

// HÀM MỚI ĐỂ XUẤT FILE (Resident Stats)
export const exportResidentStatsToExcel = async (filters = {}) => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v)
  );
  
  // Sử dụng apiClient để gửi request, và quan trọng là đặt responseType là 'blob'
  const response = await apiClient.get('/statistics/residents/export/excel', {
    params: activeFilters,
    responseType: 'blob', // Báo cho axios biết chúng ta đang mong đợi một file
  });
  
  // Gọi hàm helper để xử lý việc tải xuống
  await handleFileDownload(response, 'ThongKeNhanKhau.xlsx');
};

// HÀM MỚI ĐỂ XUẤT PDF (Resident Stats)
export const exportResidentStatsToPdf = async (filters = {}) => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v)
  );
  
  const response = await apiClient.get('/statistics/residents/export/pdf', {
    params: activeFilters,
    responseType: 'blob',
  });
  
  await handleFileDownload(response, 'ThongKeNhanKhau.pdf');
};