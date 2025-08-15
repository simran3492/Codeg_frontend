// src/components/question/QuestionHeader.jsx
import React from 'react';
import { Link } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Tag from "../../components copy/ui/tag";


const QuestionHeader = ({ title, tags, isAuthor, onDelete }) => (
  <header className="mb-6">
    <Link
      to="/discussion"
      className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Back to Discussions
    </Link>
    <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {isAuthor && (
            <button className="btn btn-sm btn-error" onClick={onDelete}>
                Delete Question
            </button>
        )}
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {tags.map((tag) => <Tag key={tag} name={tag} />)}
    </div>
  </header>
);

export default QuestionHeader;