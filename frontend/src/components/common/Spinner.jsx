import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-primary-500 rounded-full animate-spin"></div>
        <div className="absolute inset-4 bg-primary-500/10 rounded-full blur-sm animate-pulse"></div>
      </div>
    </div>
  );
};

export default Spinner;