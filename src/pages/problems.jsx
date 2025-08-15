import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';

import {
  FaSearch, FaFilter, FaTag, FaCheckCircle, FaCode,
  FaTachometerAlt, FaListAlt, FaBullseye, FaTimes
} from 'react-icons/fa';

// --- Helper Arrays and Functions for Filters ---

const difficultyOptions = [
    { value: 'all', label: 'All', color: 'bg-blue-500 text-white' },
    { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700 border border-green-400' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border border-yellow-400' },
    { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700 border border-red-400' },
];

const statusOptions = [
    { value: 'all', label: 'All', color: 'bg-blue-500 text-white' },
    { value: 'solved', label: 'Solved', color: 'bg-cyan-100 text-cyan-700 border border-cyan-400' },
    { value: 'unsolved', label: 'Unsolved', color: 'bg-gray-100 text-gray-700 border border-gray-400' },
];

const tagOptions = [
  'all', 'array', 'string', 'hash table', 'math', 'sorting', 'two pointers', 
  'binary search', 'linked list', 'stack', 'queue', 'tree', 'graph', 
  'heap (priority queue)', 'dynamic programming', 'greedy', 'backtracking', 
  'trie', 'bit manipulation', 'matrix'
];

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'badge-success bg-green-500 text-white';
    case 'medium': return 'badge-warning bg-yellow-500 text-white';
    case 'hard': return 'badge-error bg-red-500 text-white';
    default: return 'badge-neutral';
  }
};

// --- Main Component ---

function Problems() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    status: 'all',
    tag: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        const sortedData = data.sort((a, b) => a.serial_number - b.serial_number);
        setProblems(sortedData);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/solvedAllProblembyUser');
        setSolvedProblems(data.submissions || []);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) {
      fetchSolvedProblems();
    }
  }, [user]);

  // --- Event Handlers ---
 
  const handleClearFilters = () => {
    setFilters({ difficulty: 'all', status: 'all', tag: 'all' });
    setSearchQuery('');
  };

  // --- Filtering Logic ---
  const filteredProblems = problems.filter(problem => {
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = searchLower === '' ||
                        problem.title.toLowerCase().includes(searchLower) ||
                        String(problem.serial_number).includes(searchLower);

    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags.includes(filters.tag);
    
    const isSolved = solvedProblems.some(sp => sp._id === problem._id);
    let statusMatch = true;
    if (filters.status === 'solved') {
      statusMatch = isSolved;
    } else if (filters.status === 'unsolved') {
      statusMatch = !isSolved;
    }

    return searchMatch && difficultyMatch && tagMatch && statusMatch;
  });

  // --- Derived State for Stat Cards ---
  const totalProblemsCount = problems.length;
  const solvedProblemsCount = solvedProblems.length;
  const remainingProblemsCount = totalProblemsCount - solvedProblemsCount;
  const solvedPercentage = totalProblemsCount > 0 ? Math.round((solvedProblemsCount / totalProblemsCount) * 100) : 0;

//   if (loading) {
//         return (
//             <div className="min-h-screen bg-base-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
//                     <p className="text-base-content font-medium">Loading problems...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
//                 <div className="card max-w-md w-full bg-base-100 shadow-xl border-error border-2">
//                     <div className="card-body text-center">
//                         <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <XCircle className="w-8 h-8 text-error" />
//                         </div>
//                         <h3 className="card-title text-error justify-center mb-2">Error Loading Problems</h3>
//                         <p className="text-error mb-4">{error}</p>
//                         <button onClick={() => window.location.reload()} className="btn btn-outline btn-error">
//                             Try Again
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

  return (
    <div className="min-h-screen bg-gray-50">
     

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">

        {/* --- NEW STATISTIC CARDS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Problems Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Problems</p>
              <p className="text-4xl font-bold text-indigo-600">{totalProblemsCount}</p>
              <p className="text-sm text-gray-500 mt-1">A new challenge awaits!</p>
            </div>
            <div className="bg-indigo-500 text-white p-3 rounded-md">
                <FaListAlt className="text-3xl" />
            </div>
          </div>

          {/* Problems Solved Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Problems Solved</p>
              <p className="text-4xl font-bold text-emerald-500">{solvedProblemsCount}</p>
              <p className="text-sm text-emerald-500 mt-1">{solvedPercentage}% solved</p>
            </div>
            <div className="bg-emerald-500 text-white p-3 rounded-full">
                <FaCheckCircle className="text-3xl" />
            </div>
          </div>

          {/* Remaining Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-4xl font-bold text-pink-500">{remainingProblemsCount}</p>
              <p className="text-sm text-gray-500 mt-1">Keep pushing forward!</p>
            </div>
            <div className="text-pink-500 border-4 border-pink-500 p-2 rounded-full">
                <FaBullseye className="text-3xl" />
            </div>
          </div>
        </div>


        {/* --- Filters Section (No Changes) --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search problems by title or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10 text-base"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span className="font-semibold">Difficulty:</span>
              {difficultyOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilters(f => ({ ...f, difficulty: opt.value }))}
                  className={`btn btn-xs sm:btn-sm rounded-full ${filters.difficulty === opt.value ? opt.color : 'btn-ghost'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-gray-500" />
              <span className="font-semibold">Status:</span>
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilters(f => ({ ...f, status: opt.value }))}
                  className={`btn btn-xs sm:btn-sm rounded-full ${filters.status === opt.value ? opt.color : 'btn-ghost'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <FaTag className="text-gray-500" />
              <span className="font-semibold">Tags:</span>
              <select
                value={filters.tag}
                onChange={(e) => setFilters(f => ({ ...f, tag: e.target.value }))}
                className="select select-bordered select-sm rounded-full capitalize"
              >
                {tagOptions.map(tag => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </div>

            <button onClick={handleClearFilters} className="btn btn-ghost btn-sm text-gray-600 ml-auto">
              <FaTimes className="mr-1" /> Clear All
            </button>
          </div>
        </div>

        {/* --- Problems Table (No Changes) --- */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-16">#</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map(problem => {
                const isSolved = solvedProblems.some(sp => sp._id === problem._id);
                return (
                  <tr key={problem._id} className="hover">
                    <td className="font-medium text-gray-600">{problem.serial_number}</td>
                    <td>
                      <NavLink to={`/problems/${problem._id}`} className="flex items-center gap-2 link link-hover text-gray-800">
                        <FaCode className="text-gray-400" />
                        <span>{problem.title}</span>
                      </NavLink>
                    </td>
                    <td>
                      <span className={`badge badge-lg border-none capitalize ${getDifficultyBadgeColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map(tag => (
                          <div key={tag} className="badge badge-outline capitalize">{tag}</div>
                        ))}
                      </div>
                    </td>
                    <td className="text-center">
                      {isSolved && <FaCheckCircle className="text-green-500 text-xl mx-auto" />}
                    </td>
                  </tr>
                );
              })}
              {filteredProblems.length === 0 && (
                 <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      No problems match your criteria.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Problems;