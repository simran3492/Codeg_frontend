// src/components/discussion/DiscussionCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Link } from 'react-router';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import Tag from './Tag';
import UserAvatar from './UserAvatar';

const DiscussionCard = ({ question }) => {
  const answerCount = question.answers.length;
  const isSolved = question.is_solved;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="group cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <Link to={`/question/${question._id}`} className="block">
        <div className="flex items-start justify-between">
          {/* ✅ Dark Mode: Update title text color */}
          <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
            {question.title}
          </h3>
          {isSolved && (
            <CheckBadgeIcon className="ml-2 h-6 w-6 flex-shrink-0 text-green-500" title="Solved" />
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {question.tags.map(tag => <Tag key={tag} name={tag} />)}
        </div>
      </Link>
      
      {/* ✅ Dark Mode: Update meta info section */}
      <div className="mt-4 flex flex-col justify-between gap-4 border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <UserAvatar user={question.posted_by} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span 
              className={`font-semibold ${
                answerCount === 0 
                  ? 'text-orange-600 dark:text-orange-400' // Highlight for unanswered
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {answerCount} {answerCount === 1 ? 'Answer' : 'Answers'}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              Asked by {question.posted_by.first_name || 'User'}
            </span>
          </div>
        </div>
        <span title={`Asked on ${format(new Date(question.createdAt), 'PPpp')}`}>
          {format(new Date(question.createdAt), 'PPP')}
        </span>
      </div>
    </motion.div>
  );
};

export default DiscussionCard;