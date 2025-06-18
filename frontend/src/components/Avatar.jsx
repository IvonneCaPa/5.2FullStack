import React from 'react';

const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const Avatar = ({ name, photoUrl, size = 40 }) => {
  return photoUrl ? (
    <img
      src={photoUrl}
      alt={name}
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-white object-cover bg-orange-200"
    />
  ) : (
    <div
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      className="flex items-center justify-center rounded-full bg-orange-500 text-white font-bold border-2 border-white select-none"
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar; 