import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-orange-500 text-white text-center py-4 shadow-inner">
      <span className="font-semibold">Fullstack App</span> &copy; {new Date().getFullYear()}
    </footer>
  );
};

export default Footer; 