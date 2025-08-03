import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { ChevronLeft, ChevronRight, List, Sun, Moon, Bot, Shuffle, Play, Send, Code2, BookOpen, FileText, Trophy, Users, Star, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';

import SubmissionModal from './submitted'; // Import the new modal component
import ChatAi from '../components/ChatAi';


// ===================================================================================
// API SERVICE - Enhanced with serial number navigation
// ===================================================================================
const getProblemById = (id) => axiosClient.get(`/problem/getParticularProblem?by=id&value=${id}`);
const runCode = (id, { language, code }) => axiosClient.post(`/submission/run/${id}`, { language, code });
const submitCode = (id, { language, code }) => axiosClient.post(`/submission/submit/${id}`, { language, code });
const getAllProblems = () => axiosClient.get('/problem/getAllProblem');

const SUPPORTED_LANGUAGES = [
    { id: 'Python', display: 'Python', dbName: 'python' },
    { id: 'C++', display: 'C++', dbName: 'c++' },  
    { id: 'Java', display: 'Java', dbName: 'java' },
    { id: 'Javascript', display: 'JavaScript', dbName: 'javascript' }
];

const ProblemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [language, setLanguage] = useState('Python');
    const [code, setCode] = useState('');
    const [initialCode, setInitialCode] = useState(''); // Store initial code for reset
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProblem, setIsLoadingProblem] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [activeResultTab, setActiveResultTab] = useState('testcase');
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [allProblems, setAllProblems] = useState([]);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(-1);
    const [submissions, setSubmissions] = useState([]);
    const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);
    const [submissionsError, setSubmissionsError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

// 2. CREATE A NEW API SERVICE FUNCTION to call your endpoint
const getSubmissionsForProblem = (problemId) => axiosClient.get(`/problem/submittedProblem/${problemId}`);
    
   useEffect(() => {
    const fetchSubmissions = async () => {
        // ADD `&& problem` HERE to ensure `problem` is not null
        if (activeTab === 'submissions' && problem && submissions.length === 0 && !isSubmissionsLoading) {
            setIsSubmissionsLoading(true);
            setSubmissionsError(null);
            try {
                // Now this line will only run when `problem` has been loaded
                const { data } = await getSubmissionsForProblem(problem._id);

                if (typeof data === 'string') {
                    setSubmissions([]);
                } else {
                    const sortedData = data.submissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setSubmissions(sortedData);
                }

            } catch (err) {
                console.error("Failed to fetch submissions", err);
                setSubmissionsError("Could not load submissions. Please try again later.");
            } finally {
                setIsSubmissionsLoading(false);
            }
        }
    };

    fetchSubmissions();
}, [activeTab, problem]); // Dependencies for the effect

// Also, reset submissions when the problem changes
useEffect(() => {
    setSubmissions([]);
    setSubmissionsError(null);
}, [id]);
    
    // Fetch all problems for navigation
    useEffect(() => {
        const fetchAllProblems = async () => {
            try {
                const { data } = await getAllProblems();
                const sortedProblems = data.sort((a, b) => a.serial_number - b.serial_number);
                setAllProblems(sortedProblems);
                
                // Find current problem index
                const currentIndex = sortedProblems.findIndex(p => p._id === id);
                setCurrentProblemIndex(currentIndex);
            } catch (err) {
                console.error("Failed to fetch all problems", err);
            }
        };
        fetchAllProblems();
    }, [id]);

    // Fetch problem data
    useEffect(() => {
        const fetchProblem = async () => {
            setIsLoadingProblem(true);
            try {
                const { data } = await getProblemById(id);
                setProblem(data);
            } catch (err) {
                console.error("Failed to fetch problem", err);
                setProblem(null);
            } finally {
                setIsLoadingProblem(false);
            }
        };
        if (id) {
            fetchProblem();
        }
    }, [id]);

    // Set initial code when problem or language changes
    useEffect(() => {
        if (problem) {
            const currentLangConfig = SUPPORTED_LANGUAGES.find(lang => lang.id === language);
            if (currentLangConfig) {
                const starterCodeObj = problem.startCode?.find(sc => sc.language === currentLangConfig.id);
                const startCode = starterCodeObj?.initialCode || `// No starter code available for ${currentLangConfig.display}`;
                setCode(startCode);
                setInitialCode(startCode); // Store for reset functionality
            }
        }
    }, [language, problem]);

    // Auto-switch to result tab when result arrives
    useEffect(() => {
        if (result) {
            setActiveResultTab('result');
        }
    }, [result]);

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const resetCode = () => {
        setCode(initialCode);
        setResult(null); // Clear any existing results
    };

    const handleCodeAction = async (actionType) => {
    setIsLoading(true);
    setResult(null);
    const action = actionType === 'submit' ? submitCode : runCode;
    
    // Get the display name for the current language
    const currentLangConfig = SUPPORTED_LANGUAGES.find(lang => lang.id === language);
    const languageToSend = currentLangConfig ? currentLangConfig.dbName : language;
    
    try {
        const { data } = await action(id, { language: languageToSend, code });
        setResult(data);
    } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
        setResult({ success: false, errorMessage: errorMessage, testCases: [] });
    } finally {
        setIsLoading(false);
    }
};
    const getDifficultyColor = (difficulty) => {
        if (!difficulty) return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getStatusClass = (success) => success ? 'text-green-500' : 'text-red-500';

    // Enhanced navigation handlers using serial numbers
    const handlePrevious = async () => {
        // 1. Safety check to ensure the current problem and its serial number exist
        if (!problem || !problem.serial_number) {
            console.log("Current problem data is not loaded yet.");
            return;
        }

        try {
            // 2. Subtract 1 from the current problem's serial_number
            const serial_number = problem.serial_number;

            // Optional: Prevent API call if we know we are at the beginning
            if (serial_number < 1) {
                console.log("Already at the first problem.");
                return;
            }
            
                const response = await axiosClient.get(`/problem/getParticularProblem?by=serial&value=${serial_number - 1}`);
                console.log(response)
                const prevProblem=response.data._id
      // 4. From the response, fetch the _id and navigate to that problem's page
            if (prevProblem ) {
                navigate(`/problems/${prevProblem}`);
            }

        } catch (error) {
            // This error is expected when there is no problem with the given serial number (i.e., you're at the very first problem)
            console.error("Could not fetch the previous problem. You might be at the beginning of the list.", error.response?.data?.message || error.message);
        }
    };

    const handleNext = async () => {
        // 1. Safety check to ensure the current problem and its serial number exist
        if (!problem || !problem.serial_number) {
            console.log("Current problem data is not loaded yet.");
            return;
        }

        try {
            // 2. Subtract 1 from the current problem's serial_number
            const serial_number = problem.serial_number;

            
                const response = await axiosClient.get(`/problem/getParticularProblem?by=serial&value=${serial_number + 1}`);
                console.log(response)
                const nextProblem=response.data._id
      // 4. From the response, fetch the _id and navigate to that problem's page
            if (nextProblem ) {
                navigate(`/problems/${nextProblem}`);
            }

        } catch (error) {
            // This error is expected when there is no problem with the given serial number (i.e., you're at the very first problem)
            console.error("Could not fetch the previous problem. You might be at the beginning of the list.", error.response?.data?.message || error.message);
        }
    };

    const handleShuffle = () => {
        if (allProblems.length > 0) {
            const randomIndex = Math.floor(Math.random() * allProblems.length);
            const randomProblem = allProblems[randomIndex];
            navigate(`/problems/${randomProblem._id}`);
        }
    };

    const handleProblemList = () => {
        navigate('/problems');
    };

    // Theme classes
    const themeClasses = isDarkTheme 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900';

    const cardClasses = isDarkTheme 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200 shadow-sm';

    const tabClasses = (isActive) => isDarkTheme
        ? `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${isActive ? 'text-blue-400 border-blue-400' : 'text-gray-400 hover:text-gray-200 border-transparent'}`
        : `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${isActive ? 'text-blue-600 border-blue-600' : 'text-gray-600 hover:text-gray-800 border-transparent'}`;

    // Loading states
    if (isLoadingProblem) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${themeClasses}`}>
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-lg font-medium">Loading problem...</p>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${themeClasses}`}>
                <div className="text-center">
                    <p className="text-xl font-semibold text-red-500 mb-2">Failed to load problem</p>
                    <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>Please try again later</p>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'description':
                return (
                    <div className="p-6 space-y-6 overflow-y-auto h-full">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold">{problem.title}</h1>
                            <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                    {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {problem.tags?.map(tag => (
                                <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <ThumbsUp className="w-4 h-4 text-green-500" />
                                <span>Like</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <ThumbsDown className="w-4 h-4 text-red-500" />
                                <span>Dislike</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>Favorite</span>
                            </div>
                        </div>

                        <div className={`prose max-w-none ${isDarkTheme ? 'prose-invert' : ''}`} 
                             dangerouslySetInnerHTML={{ __html: problem.description }} />

                        <div className="space-y-4">
                            {problem.visibleTestCases?.map((tc, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${cardClasses}`}>
                                    <h3 className="font-semibold mb-2">Example {index + 1}:</h3>
                                    <div className="space-y-2 font-mono text-sm">
                                        <div>
                                            <span className={`font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Input: </span>
                                            <span className={`${isDarkTheme ? 'text-blue-300' : 'text-blue-600'}`}>{tc.input}</span>
                                        </div>
                                        <div>
                                            <span className={`font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Output: </span>
                                            <span className={`${isDarkTheme ? 'text-green-300' : 'text-green-600'}`}>{tc.output}</span>  
                                        </div>
                                        {tc.explanation && (
                                            <div>
                                                <span className={`font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Explanation: </span>
                                                <span>{tc.explanation}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'editorial':
                return (
                    <div className="p-6 h-full flex items-center justify-center">
                        <div className={`text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Editorial coming soon...</p>
                        </div>
                    </div>
                );
            case 'solutions':
                return (
                    <div className="h-full flex flex-col overflow-y-scroll overflow-hidden ">
                        {/* Fixed Header */}
                        <div className={`p-6 border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Reference Solutions</h2>
                                <div className="flex items-center space-x-2">
                                    <Code2 className="w-5 h-5" />
                                    <span className="text-sm text-gray-500">
                                        {problem.referenceSolution?.length || 0} solution(s) available
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Scrollable Content */}
                        <div className="flex-1 ">
                            <div className="p-6 overflow-y-scroll overflow-hidden">
                                {!problem.referenceSolution || problem.referenceSolution.length === 0 ? (
                                    <div className={`text-center py-12 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No reference solutions available yet</p>
                                        <p className="text-sm mt-2">Solutions will be added by our team soon</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6 overflow-y-scroll">
                                        {problem.referenceSolution.map((solution, index) => {
                                            const langConfig = SUPPORTED_LANGUAGES.find(lang => lang.dbName === solution.language);
                                            const displayName = langConfig?.display || solution.language;
                                            
                                            return (
                                                <div key={index} className={`border rounded-lg overflow-hidden ${cardClasses}`}>
                                                    <div className={`px-4 py-3 border-b flex items-center justify-between ${isDarkTheme ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-3 h-3 rounded-full ${
                                                                solution.language === 'Python' ? 'bg-blue-500' :
                                                                solution.language === 'C++' ? 'bg-purple-500' :
                                                                solution.language === 'Java' ? 'bg-orange-500' :
                                                                solution.language === 'Javascript' ? 'bg-yellow-500' :
                                                                'bg-gray-500'
                                                            }`}></div>
                                                            <h3 className="font-semibold text-lg">{displayName}</h3>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`text-xs px-2 py-1 rounded ${isDarkTheme ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                                                Reference Solution
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="relative">
                                                        <Editor
                                                            height="300px"
                                                            language={langConfig?.id || 'plaintext'}
                                                            theme={isDarkTheme ? "vs-dark" : "light"}
                                                            value={solution.completeCode}
                                                            options={{
                                                                readOnly: true,
                                                                minimap: { enabled: false },
                                                                fontSize: 13,
                                                                scrollBeyondLastLine: false,
                                                                wordWrap: 'on',
                                                                automaticLayout: true,
                                                                lineNumbers: 'on',
                                                                folding: true,
                                                                renderWhitespace: 'selection'
                                                            }}
                                                        />
                                                        
                                                        {/* Copy button overlay */}
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(solution.completeCode);
                                                                // You can add a toast notification here
                                                            }}
                                                            className={`absolute top-3 right-3 p-2 rounded-md transition-opacity opacity-0 hover:opacity-100 ${
                                                                isDarkTheme ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg'
                                                            }`}
                                                            title="Copy code"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Solution stats or notes could go here */}
                                                    <div className={`px-4 py-3 border-t text-sm ${isDarkTheme ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                                                        <div className="flex items-center justify-between">
                                                            <span>✓ Optimal solution provided by our team</span>
                                                            <div className="flex items-center space-x-4 text-xs">
                                                                <span>Time: O(n)</span>
                                                                <span>Space: O(1)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* Additional information section */}
                                        <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${isDarkTheme ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                                            <h4 className={`font-semibold mb-2 ${isDarkTheme ? 'text-blue-400' : 'text-blue-700'}`}>
                                                💡 About Reference Solutions
                                            </h4>
                                            <p className={`text-sm ${isDarkTheme ? 'text-blue-300' : 'text-blue-600'}`}>
                                                These are optimal solutions created by our team. They demonstrate best practices, 
                                                efficient algorithms, and clean code structure. Use them to learn different approaches 
                                                and improve your problem-solving skills.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'submissions':
                const handleViewClick = (submission) => {
        setSelectedSubmission(submission);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSubmission(null);
    };

    // Helper function to format date nicely
    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // Helper for status styling
    const getStatusClass = (status) => {
        const lowerCaseStatus = status.toLowerCase();
        if (lowerCaseStatus.includes('accepted')) {
            return isDarkTheme ? 'text-green-400' : 'text-green-600';
        }
        if (lowerCaseStatus.includes('wrong')) {
            return isDarkTheme ? 'text-red-400' : 'text-red-500';
        }
        return isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'; // For other statuses like 'runtime error'
    };

    return (
        <>
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`p-6 border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">My Submissions</h2>
                    <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm text-gray-500">
                            {submissions.length} submission(s) found
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {isSubmissionsLoading && (
                    <div className="flex items-center justify-center h-full p-6 space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                            Loading submissions...
                        </span>
                    </div>
                )}

                {!isSubmissionsLoading && submissionsError && (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-red-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-lg font-semibold text-red-500">{submissionsError}</p>
                    </div>
                )}

                {!isSubmissionsLoading && !submissionsError && submissions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className={`text-lg font-semibold ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            No Submissions Yet
                        </p>
                        <p className={`mt-1 text-sm ${isDarkTheme ? 'text-gray-500' : 'text-gray-500'}`}>
                            Your submissions for this problem will appear here.
                        </p>
                    </div>
                )}
                
                {/* Submissions Table */}
                {!isSubmissionsLoading && !submissionsError && submissions.length > 0 && (
                    <div className="p-4">
                        <table className="min-w-full divide-y divide-transparent">
                            <thead className="">
                                <tr>
                                    {['Status', 'Language', 'Runtime', 'Memory', 'Date'].map(header => (
                                        <th key={header} scope="col" className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {header}
                                        </th>
                                    ))}
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">View</span>
                                    </th>
                                </tr>
                            </thead>
                           <tbody className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden`}>
                                {submissions.map((sub) => (
                                    <tr key={sub.submission_id} className={`transition-colors ${isDarkTheme ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`font-semibold text-sm ${getStatusClass(sub.status)}`}>
                                                {sub.status || 'Processing'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-800'}`}>
                                            {sub.language}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {/* This will now correctly display the runtime sent from the backend */}
                                            {sub.runtime}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {sub.memory}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {/* THE FIX: Use 'submitted_at' which is the correct field name from the API */}
                                            {formatDate(sub.submitted_at)}
                                        </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {/* MODIFICATION: Added onClick handler */}
                                                <button
                                                    onClick={() => handleViewClick(sub)}
                                                    className={`px-3 py-1.5 rounded-md transition-colors font-semibold ${
                                                        isDarkTheme
                                                            ? 'text-blue-400 hover:bg-blue-900/50'
                                                            : 'text-blue-600 hover:bg-blue-100'
                                                    }`}
                                                >
                                                    View
                                                </button>
                                            </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
        {isModalOpen && (
                <SubmissionModal
                    submission={selectedSubmission}
                    onClose={handleCloseModal}
                    isDarkTheme={isDarkTheme}
                />
            )}
            </>
    );
    case 'AI_Assitant':
                return (
                    <div className=" h-full  flex items-center justify-center">
                        <div className={`text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            
                            <ChatAi problem={problem} isDarkTheme={isDarkTheme}></ChatAi>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${themeClasses}`}>
            {/* Header */}
            <header className={`border-b ${isDarkTheme ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} sticky top-0 z-10`}>
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handlePrevious}
                            disabled={currentProblemIndex <= 0}
                            className={`p-2 rounded-lg transition-colors ${
                                currentProblemIndex <= 0 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : (isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                            }`}
                            title="Previous Problem"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={handleProblemList}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                            <List className="w-4 h-4" />
                            <span className="text-sm font-medium">Problem List</span>
                        </button>
                        <button 
                            onClick={handleNext}
                            disabled={currentProblemIndex >= allProblems.length - 1}
                            className={`p-2 rounded-lg transition-colors ${
                                currentProblemIndex >= allProblems.length - 1 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : (isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                            }`}
                            title="Next Problem"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        
                        <div className={`text-sm px-3 py-1 rounded-md ${isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            Problem #{problem.serial_number || id} {currentProblemIndex >= 0 && `(${currentProblemIndex + 1}/${allProblems.length})`}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={handleShuffle}
                            disabled={allProblems.length === 0}
                            className={`p-2 rounded-lg transition-colors ${
                                allProblems.length === 0 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : (isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                            }`}
                            title="Random Problem"
                        >
                            <Shuffle className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            title="Toggle Theme"
                        >
                            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex h-[calc(100vh-65px)]">
                {/* Left Panel */}
                <div className={`w-1/2 border-r ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} flex flex-col ${themeClasses}`}>
                    {/* Tabs */}
                    <div className={`border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} px-6 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
                        <nav className="flex space-x-6">
                            {[
                                { id: 'description', label: 'Description', icon: FileText },
                                { id: 'editorial', label: 'Editorial', icon: BookOpen },
                                { id: 'solutions', label: 'Solutions', icon: Users },
                                { id: 'submissions', label: 'Submissions', icon: Trophy },
                                { id: 'AI_Assitant', label: 'AI Chat', icon: Bot }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={tabClasses(activeTab === id)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Icon className="w-4 h-4" />
                                        <span>{label}</span>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className={`flex-1 ${themeClasses}`}>
                        {renderTabContent()}
                    </div>
                </div>

                {/* Right Panel - Code Editor */}
                <div className={`w-1/2 flex flex-col ${themeClasses}`}>
                    {/* Language Selector and Reset Button */}
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${isDarkTheme ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium border ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        >
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <option key={lang.id} value={lang.id}>{lang.display}</option>
                            ))}
                        </select>
                        
                        <button
                            onClick={resetCode}
                            className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                isDarkTheme 
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                            }`}
                            title="Reset to initial code"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Reset</span>
                        </button>
                    </div>

                    {/* Code Editor */}
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language={language}
                            theme={isDarkTheme ? "vs-dark" : "light"}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                                automaticLayout: true
                            }}
                        />
                    </div>

                    {/* Bottom Panel - Test Cases / Results */}
                    <div className="h-64 flex flex-col">
                        <div className={`border-t ${isDarkTheme ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center justify-between px-4 py-2">
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setActiveResultTab('testcase')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                            activeResultTab === 'testcase' 
                                                ? (isDarkTheme ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700')
                                                : (isDarkTheme ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800')
                                        }`}
                                    >
                                        Testcase
                                    </button>
                                    <button
                                        onClick={() => setActiveResultTab('result')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                            activeResultTab === 'result' 
                                                ? (isDarkTheme ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700')
                                                : (isDarkTheme ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800')
                                        }`}
                                    >
                                        Result
                                    </button>
                                </div>
                                
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleCodeAction('run')}
                                        disabled={isLoading}
                                        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isDarkTheme 
                                                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50' 
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50'
                                        }`}
                                    >
                                        <Play className="w-4 h-4" />
                                        <span>Run</span>
                                    </button>
                                    <button
                                        onClick={() => handleCodeAction('submit')}
                                        disabled={isLoading}
                                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>Submit</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={`flex-1 overflow-y-auto p-4 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
                            {activeResultTab === 'testcase' ? (
                                <div className="space-y-3">
                                    {problem.visibleTestCases?.map((tc, index) => (
                                        <div key={index} className={`p-3 rounded-lg border ${cardClasses}`}>
                                            <p className="font-semibold text-sm mb-2">Case {index + 1}</p>
                                            <div className="font-mono text-xs space-y-1">
                                                <div>Input: <span className={isDarkTheme ? 'text-blue-300' : 'text-blue-600'}>{tc.input}</span></div>
                                                <div>Expected: <span className={isDarkTheme ? 'text-green-300' : 'text-green-600'}>{tc.output}</span></div>
                                            </div>
                                        </div>
                                    )) || <div className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>No test cases available</div>}
                                </div>
                            ) : (
                                <div>
                                    {isLoading && (
                                        <div className="flex items-center space-x-3">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                            <span>Running your code...</span>
                                        </div>
                                    )}
                                    
                                    {!isLoading && !result && (
                                        <div className={`text-center py-8 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <p>Click "Run" or "Submit" to see results</p>
                                        </div>
                                    )}

                                    {!isLoading && result && (
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className={`font-semibold text-lg ${getStatusClass(result.success)}`}>
                                                    {result.success ? 'Accepted' : (result.errorMessage ? 'Error' : 'Wrong Answer')}
                                                </span>
                                            </div>

                                            {result.errorMessage && (
                                                <div className="mb-6">
                                                    <h4 className={`font-semibold text-sm mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Error:</h4>
                                                    <pre className={`p-4 rounded-lg text-red-500 whitespace-pre-wrap font-mono text-sm ${isDarkTheme ? 'bg-red-900/20' : 'bg-red-50'}`}>
                                                        {result.errorMessage}
                                                    </pre>
                                                </div>
                                            )}

                                            {result.testCases && result.testCases.length > 0 && (
                                                <div className="space-y-3">
                                                    {result.testCases.map((tc, index) => {
                                                        const testCaseSuccess = tc.status?.id === 3;
                                                        const originalTestCase = problem.visibleTestCases?.[index];
                                                        return (
                                                            <details key={index} className={`p-4 rounded-lg border ${cardClasses}`} open={index === 0}>
                                                                <summary className={`cursor-pointer font-medium ${getStatusClass(testCaseSuccess)} flex items-center justify-between`}>
                                                                    <span>Case {index + 1}: {tc.status?.description || 'Unknown'}</span>
                                                                    <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                        {tc.time}s | {tc.memory} KB
                                                                    </span>
                                                                </summary>
                                                                <div className="mt-3 font-mono text-sm space-y-2">
                                                                    {originalTestCase && (
                                                                        <>
                                                                            <div>
                                                                                <span className={`font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Input: </span>
                                                                                <span className={isDarkTheme ? 'text-blue-300' : 'text-blue-600'}>{originalTestCase.input}</span>
                                                                            </div>
                                                                            
                                                                            <div>
                                                                                <span className={`font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Your Output: </span>
                                                                                <span className={isDarkTheme ? 'text-green-300' : 'text-green-600'}>{tc.stdout || '(no output)'}</span>
                                                                            </div>
                                                                            
                                                                            {!testCaseSuccess && tc.status?.id !== 6 && (
                                                                                <div>
                                                                                    <span className={`font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Expected: </span>
                                                                                    <span className={isDarkTheme ? 'text-yellow-300' : 'text-yellow-600'}>{originalTestCase.output}</span>
                                                                                </div>
                                                                            )}

                                                                            {tc.stderr && (
                                                                                <div>
                                                                                    <span className="font-medium text-red-500">Stderr: </span>
                                                                                    <span className="text-red-500">{tc.stderr}</span>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </details>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;