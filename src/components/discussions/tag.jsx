// src/components/discussion/Tag.jsx
import React from 'react';
import { motion } from 'framer-motion';

const getTagColors = (tag) => {
  switch (tag.toLowerCase()) {
    case 'express':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
    case 'array':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
    case 'react':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200';
    default:
      return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const Tag = ({ name }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getTagColors(name)}`}
  >
    {name}
  </motion.div>
);

export default Tag;