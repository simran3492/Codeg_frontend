// src/components/discussion/FilterChips.jsx
import React, { useState } from 'react';

const FilterChips = ({ onFilterChange }) => {
  const filters = ["All", "Unanswered", "Most Answered", "Recent"];
  const [activeFilter, setActiveFilter] = useState("All");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeFilter === filter
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;