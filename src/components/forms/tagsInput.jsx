// src/components/forms/TagInput.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

const popularTags = ["Graph", "sliding window", "string", "arrays", "hashmaps", "tree", "dp"];

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = React.useState('');

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const addTag = (tag) => {
    const newTag = tag.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === ',' || e.key === 'Enter') && inputValue) {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full flex-wrap gap-2 rounded-lg border-2 border-gray-300 p-2 dark:border-gray-600">
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.div
              key={tag}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
            >
              {tag}
              <button onClick={() => removeTag(index)} className="focus:outline-none">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className="flex-grow bg-transparent p-1 text-gray-900 focus:outline-none dark:text-white"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Popular Tags:</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <button key={tag} type="button" onClick={() => addTag(tag)} className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-800 transition-transform hover:scale-105 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagInput;