import { useState, useCallback } from 'react';

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args);
      setData(response.data.data); // Lấy data từ response của backend
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra';
      setError(errorMessage);
      console.error(err);
      throw err; // Ném lỗi ra để component có thể xử lý thêm nếu cần
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, error, loading, request };
};