// src/components/question/UpvoteButton.jsx
// src/components/question/UpvoteButton.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon } from '@heroicons/react/24/solid';

const UpvoteButton = ({ onUpvote, upvotes, hasVoted, isUpvoting }) => {
  const buttonVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 },
  };

  return (
    // 1. Add a relative container with the "group" class
    // This allows us to position the tooltip and trigger it on hover.
    <div className="relative flex items-center group">
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onUpvote}
        disabled={isUpvoting}
        className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed ${
          hasVoted
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        <ArrowUpIcon className="h-5 w-5" />
        <span>{upvotes}</span>
      </motion.button>
      
      {/* 2. The Tooltip Element */}
      {/* It's hidden by default and appears on group-hover */}
      <div 
        className="absolute bottom-full mb-2 w-max max-w-xs
                   invisible opacity-0 group-hover:visible group-hover:opacity-100 
                   transition-opacity duration-300"
      >
        <div className="bg-blue-200  text-black border-gray-500 border-1 dark:bg-gray-800 dark:text-white  text-xs rounded-md py-1 px-3">
          Upvote the answer if you find it helpful!
        </div>
        {/* Optional: Add a small arrow pointing down */}
        <div className="absolute left-4 -translate-x-1/2 w-0 h-0 
                       border-l-[6px] border-l-transparent
                       border-r-[6px] border-r-transparent
                       border-t-[6px] border-t-gray-800">
        </div>
      </div>
    </div>
  );
};

export default UpvoteButton;