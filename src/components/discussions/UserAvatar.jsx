// src/components/discussion/UserAvatar.jsx
import React from 'react';

const UserAvatar = ({ user, size = 'h-8 w-8' }) => { // Default size is h-8 w-8
  // 1. Check for profile picture URL
  if (user?.photoURL) {
    
    return (
      <img
        src={user.photoURL}
        alt={user.firstName || 'User Avatar'}
        className={`${size} rounded-full object-cover`}
        title={user.firstName || 'User'}
      />
    );
  }

  // 2. Fallback to initials
  const initials = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
  const fontSize = size.includes('10') || size.includes('12') ? 'text-base' : 'text-sm';

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-300 font-bold text-gray-600 dark:bg-gray-600 dark:text-gray-200 ${size}`}
      title={user?.firstName || 'User'}
    >
      <span className={fontSize}>{initials}</span>
    </div>
  );
};

export default UserAvatar;