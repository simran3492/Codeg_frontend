// src/components/forms/FloatingLabelInput.jsx
import React from 'react';

const FloatingLabelInput = ({ id, label, register, error, ...rest }) => (
  <div className="relative">
    <input
      id={id}
      {...register(id)}
      className={`peer block w-full appearance-none rounded-lg border-2 bg-transparent px-4 pb-2.5 pt-4 text-base text-gray-900 focus:outline-none focus:ring-0 dark:text-white ${
        error
          ? 'border-red-500 focus:border-red-600'
          : 'border-gray-300 focus:border-blue-600 dark:border-gray-600 dark:focus:border-blue-500'
      }`}
      placeholder=" " // This space is crucial for the animation
      {...rest}
    />
    <label
      htmlFor={id}
      className={`absolute left-4 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-base duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-gray-900 ${
        error
          ? 'text-red-500 dark:text-red-400'
          : 'text-gray-500 peer-focus:text-blue-600 dark:text-gray-400 dark:peer-focus:text-blue-500'
      }`}
    >
      {label}
    </label>
  </div>
);

export default FloatingLabelInput;