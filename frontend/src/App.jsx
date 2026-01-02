import React from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary-500/30">
      <AppRoutes />
    </div>
  );
}

export default App;