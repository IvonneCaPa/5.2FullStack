import React from 'react';

const Loader = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[200px]">
    <div className="loader-spinner"></div>
    <style>{`
      .loader-spinner {
        border: 6px solid #f3f3f3;
        border-top: 6px solid #fb923c;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Loader; 