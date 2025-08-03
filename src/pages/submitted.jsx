import React from 'react';
import { X } from 'lucide-react'; // Icon for the close button

// NOTE: You will likely need a syntax highlighting library for the code.
// react-syntax-highlighter is a popular choice.
// Install it: npm install react-syntax-highlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';


const SubmissionModal = ({ submission, onClose, isDarkTheme }) => {
    if (!submission) return null;

    // Prevents clicks inside the modal from closing it
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    // Assuming your submission object has a `code` property
    const codeString = submission.code || "// Code not available";
    const language = submission.language ? submission.language.toLowerCase() : 'javascript';

    return (
        // Modal Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={onClose} // Close modal if you click outside of it
        >
            {/* Modal Content */}
            <div
                className={`relative w-11/12 max-w-4xl flex flex-col rounded-lg shadow-xl ${isDarkTheme ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
                onClick={handleModalContentClick}
            >
                {/* Modal Header */}
                <div className={`flex items-center justify-between p-4 border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="text-xl font-bold">Submission Details</h3>
                    <button
                        onClick={onClose}
                        className={`p-1 rounded-full transition-colors ${isDarkTheme ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-200'}`}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                        <div><span className="font-semibold">Status:</span> {submission.status}</div>
                        <div><span className="font-semibold">Language:</span> {submission.language}</div>
                        <div><span className="font-semibold">Runtime:</span> {submission.runtime}</div>
                        <div><span className="font-semibold">Memory:</span> {submission.memory}</div>
                    </div>
                    
                    {/* Code Viewer with Syntax Highlighting */}
                    <div className="rounded-md overflow-hidden">
                         <SyntaxHighlighter
                            language={language}
                            style={isDarkTheme ? atomDark : prism}
                            showLineNumbers={true}
                            customStyle={{ margin: 0 }}
                         >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionModal;