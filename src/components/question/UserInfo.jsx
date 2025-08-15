// src/components/question/UserInfo.jsx
import React from 'react';
import { format } from 'date-fns';
import UserAvatar from '../discussions/UserAvatar' // 1. Import UserAvata
const UserInfo = ({ user, date, prefix = "Asked" }) => {
  return (
    <div className="mt-4 flex items-center gap-3">
      {/* 2. Replace the old div with the UserAvatar component */}
      <UserAvatar user={user} size="h-10 w-10" />

      {/* 3. The rest of the component remains the same */}
      <div className="text-sm">
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {user?.firstName || 'Anonymous User'}
        </span>
        <p className="text-gray-600 dark:text-gray-400">
          {prefix} on {date ? format(new Date(date), 'PPP') : 'a while ago'}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;