// src/pages/ForumPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router'; // Corrected import
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // ✅ 1. Import the search icon
import axiosClient from '../utils/axiosClient';
import DiscussionCard from '../components/discussions/DiscussionCard'; // Corrected path
import StyledButton from '../components copy/ui/StyledButton';
import FilterChips from '../components/discussions/FilterChips'; // Corrected path
import Particles from '../components copy/ui/particlebg'; // Assuming this path is correct
import { useSelector } from 'react-redux';
import LoginAccessCard from '../components/loginmessage';



const ForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState(''); // ✅ 2. Add state for the search query 
  const user=useSelector((state)=>state.auth.user)


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/discussion/getAllQuestions');
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // ✅ 3. Update filtering logic to include search
  const filteredQuestions = questions
    .filter(q => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true; // If no search query, show all

      const titleMatch = q.title.toLowerCase().includes(query);
      const tagMatch = q.tags.some(tag => tag.toLowerCase().includes(query));

      return titleMatch || tagMatch;
    })
    .filter(q => {
      if (filter === "Unanswered") return q.answers.length === 0;
      return true;
    })
    .sort((a, b) => {
      if (filter === "Most Answered") return b.answers.length - a.answers.length;
      if (filter === "Recent") return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt); // Default sort by recent
    });

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' } }
  };
   if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-10">
                <LoginAccessCard message="You need to be logged in to become part of Discussion" />
            </div>
        )
    }



  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen  bg-gradient-to-br from-sky-100 via-violet-100 to-pink-100 dark:from-slate-800 dark:via-neutral-900 dark:to-slate-600 p-4 transition-colors sm:p-8"
    >
      <div className="mx-auto max-w-4xl ">
         <div className="absolute inset-0 z-0 pointer-events-none">
                <Particles
                    particleColors={['#ffffff', '#ffffff']}
                    particleCount={180}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={true}
                    alphaParticles={false}
                    disableRotation={false}
                    className="absolute inset-0 w-full h-full"
                />
            </div>
        <motion.header variants={itemVariants} className="mb-6 flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text font-serif text-3xl font-bold text-transparent sm:text-4xl">
            Discussions
          </h1>
          <Link to="/ask-question">
            <StyledButton>Ask a Question</StyledButton>
          </Link>
        </motion.header>

        {/* ✅ 4. Add the Search Bar UI */}
        <motion.div variants={itemVariants} className="relative mb-4">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search questions by title or tag (e.g., 'Array', 'DP')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-11 pr-4 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-500"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FilterChips onFilterChange={handleFilterChange} />
        </motion.div>

        {loading ? (
          <p className="pt-10 text-center text-gray-600 dark:text-gray-400">Loading questions...</p>
        ) : (
          <main className="mt-6 space-y-5">
            <AnimatePresence>
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q) => (
                  <motion.div
                    key={q._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <DiscussionCard question={q} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-10 text-center text-gray-500 dark:text-gray-400"
                >
                  <h3 className="text-lg font-semibold">No Questions Found</h3>
                  <p>Try adjusting your search or filters.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        )}
      </div>
    </motion.div>
  );
};

export default ForumPage;