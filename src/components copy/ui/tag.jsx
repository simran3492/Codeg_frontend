// src/components/ui/Tag.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Tag = ({ name }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    className="cursor-pointer rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 transition-colors dark:bg-indigo-900 dark:text-indigo-200"
  >
    {name}
  </motion.div>
);

export default Tag;