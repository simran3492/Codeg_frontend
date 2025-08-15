// src/components/question/QuestionBody.jsx
import React from 'react';
import { motion } from 'framer-motion';
import UserInfo from './UserInfo';

const QuestionBody = ({ description, user, date }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
  >
    {/* Ideally, use a Markdown renderer here for `description` */}
    <p className="text-base leading-relaxed text-gray-800 dark:text-gray-300">
      {description}
    </p>
    <UserInfo user={user} date={date} />
  </motion.div>
);

export default QuestionBody;