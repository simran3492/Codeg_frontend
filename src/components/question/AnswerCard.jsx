// src/components/question/AnswerCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import UserInfo from './UserInfo';
import UpvoteButton from './UpvoteButton';

const AnswerCard = ({ answer, onUpvote, upvotingId, currentUserId, onDelete, deletingId }) => {
  const isAuthor = currentUserId && answer.posted_by._id === currentUserId;
  const hasVoted = currentUserId && answer.upvoted_by.includes(currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative rounded-xl border bg-white p-5 shadow-sm dark:bg-gray-800 ${
        answer.is_accepted ? 'border-green-500/50' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {answer.is_accepted && (
        <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckBadgeIcon className="h-4 w-4" />
          Accepted Answer
        </div>
      )}
      
      <p className="text-base text-gray-800 dark:text-gray-300">{answer.content}</p>
      
      <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:items-center">
        <UserInfo user={answer.posted_by} date={answer.createdAt} prefix="Answered" />
        <div className="flex items-center gap-4">
          {isAuthor && (
            <button
              onClick={() => onDelete(answer._id)}
              disabled={deletingId === answer._id}
              className="text-sm font-semibold text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              {deletingId === answer._id ? 'Deleting...' : 'Delete'}
            </button>
          )}
          <UpvoteButton
            onUpvote={() => onUpvote(answer._id)}
            upvotes={answer.upvotes}
            hasVoted={hasVoted}
            isUpvoting={upvotingId === answer._id}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AnswerCard;