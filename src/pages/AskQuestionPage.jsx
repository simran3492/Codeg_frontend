// src/pages/AskQuestionPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { SparklesIcon, CodeBracketSquareIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import axiosClient from '../utils/axiosClient';
import { HelpCircle, MessageSquare, Tag, Send, Sparkles, Code, Users, Lightbulb } from 'lucide-react';


// Import new components
import FloatingLabelInput from '../components/forms/FloatingLabelInput';
import TagInput from '../components/forms/tagsInput';

// Zod schema for validation
const questionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.').max(150),
  description: z.string().min(15, 'Description must be at least 15 characters long.'),
});

const AskQuestionPage = () => {
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(questionSchema)
  });

  const onSubmit = async (data) => {
    if (tags.length === 0) {
      toast.error("Please add at least one tag.");
      return;
    }

    const promise = axiosClient.post('/discussion/create', { ...data, tags });

    toast.promise(promise, {
      loading: 'Posting your question...',
      success: (res) => {
        navigate(`/question/${res.data._id}`);
        return 'Question posted successfully!';
      },
      error: (err) => err.response?.data?.msg || 'An unexpected error occurred.',
    });
  };


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' } }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };



  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 p-4 md:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl"
          >
            {/* Enhanced Header */}
            <motion.header variants={itemVariants} className="mb-12 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent sm:text-6xl mb-4">
                Ask a Public Question
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Stuck on a coding problem? Our vibrant community of developers is here to help you succeed.
              </p>

              {/* Stats Cards */}
              
            </motion.header>

            {/* Enhanced Form Container */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative"
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>

              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-cyan-500/20 p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Your Challenge</h2>
                      <p className="text-gray-600 dark:text-gray-300">The more details you provide, the better help you'll receive</p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Title Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-3"
                    >
                      <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                        <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                          <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>Question Title</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register('title')}
                          className="w-full px-4 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-lg"
                          placeholder="e.g., How to implement binary search in Python?"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      {errors.title && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm flex items-center space-x-1"
                        >
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          <span>{errors.title.message}</span>
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Description Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3"
                    >
                      <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                        <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                          <Code className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span>Problem Description</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          {...register('description')}
                          rows={12}
                          className="w-full px-4 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 font-mono text-sm resize-none"
                          placeholder="Describe your problem in detail:

• What are you trying to achieve?
• What have you tried so far?
• What specific error or issue are you encountering?
• Include relevant code snippets

Example:
```python
def binary_search(arr, target):
    # Your code here
    pass
```"
                        />
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                        </div>
                      </div>
                      {errors.description && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm flex items-center space-x-1"
                        >
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          <span>{errors.description.message}</span>
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Tags Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                      <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                        <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                          <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span>Tags</span>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(Help others find your question)</span>
                      </label>
                      <div className="bg-gray-50/50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 focus-within:border-purple-500 dark:focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-500/20 transition-all duration-200">
                        <TagInput tags={tags} setTags={setTags} />
                      </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="pt-6"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:shadow-blue-500/25"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-cyan-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                          <span>Post Your Question</span>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce delay-0"></div>
                            <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </motion.button>
                    </motion.div>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Helper Tips */}
            <motion.div
              variants={itemVariants}
              className="mt-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
                Tips for Getting Great Answers
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Be specific about what you're trying to accomplish</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Include relevant code snippets and error messages</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Show what you've already tried</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use clear, descriptive titles</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AskQuestionPage;