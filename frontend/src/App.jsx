import React from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    // Có thể thêm Layout chung ở đây nếu muốn
    <div className="app-container">
        <AppRoutes />
    </div>
  );
}

export default App;