// src/components/question/AnswerForm.jsx
import React from 'react';
import StyledButton from '../../components copy/ui/StyledButton';

const AnswerForm = ({ content, setContent, onSubmit, isSubmitting, error }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Answer</h3>
    {error && (
      <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
        {error}
      </div>
    )}
    <textarea
      className="mt-4 w-full rounded-md border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      rows="5"
      placeholder="Share your solution or insights here..."
      value={content}
      onChange={(e) => setContent(e.target.value)}
      disabled={isSubmitting}
    />
    <div className="mt-4 flex justify-end">
      <StyledButton onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Post Answer'}
      </StyledButton>
    </div>
  </div>
);

export default AnswerForm;