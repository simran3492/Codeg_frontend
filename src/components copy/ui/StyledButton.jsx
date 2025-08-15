// src/components/ui/StyledButton.jsx
import React from 'react';
import { motion } from 'framer-motion';

const StyledButton = ({ children, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    onClick={onClick}
  >
    {children}
  </motion.button>
);

export default StyledButton;