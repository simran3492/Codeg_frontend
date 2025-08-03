// src/pages/EditProblemPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient'; // Your custom API client

const EditProblemPage = () => {
    const { id } = useParams(); // Get the problem ID from the URL
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // --- Data Fetching for the specific problem ---
    useEffect(() => {
        const fetchProblemById = async () => {
            setLoading(true);
            setError('');
            try {
                // Using your route to get a single problem by its ID
                const response = await axiosClient.get(`/problem/getParticularProblem?by=id&value=${id}`);
                setProblem(response.data);
            } catch (err) {
                setError(`Failed to fetch problem with ID: ${id}. Please go back and try again.`);
                console.error("Fetch by ID Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProblemById();
    }, [id]); // Re-fetch if the ID in the URL changes

    // --- Form State Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProblem(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
        setProblem(prev => ({ ...prev, tags }));
    };
    
    const handleArrayItemChange = (section, index, field, value) => {
        const updatedArray = [...problem[section]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        setProblem(prev => ({ ...prev, [section]: updatedArray }));
    };

    const addArrayItem = (section, newItem) => {
        setProblem(prev => ({ ...prev, [section]: [...(prev[section] || []), newItem] }));
    };

    const removeArrayItem = (section, index) => {
        const updatedArray = problem[section].filter((_, i) => i !== index);
        setProblem(prev => ({ ...prev, [section]: updatedArray }));
    };

    // --- Form Submission ---
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await axiosClient.put(`/problem/update/${id}`, problem);
            alert('Problem updated successfully!');
            
            // **MODIFICATION HERE: Navigates to the previous page in history**
            navigate(-1); 

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data || "An unexpected error occurred during the update.";
            setError(errorMessage);
            console.error("Update error:", err.response);
        } finally {
            setSubmitting(false);
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    if (!problem) {
        return <div className="flex justify-center items-center h-screen"><div role="alert" className="alert alert-error max-w-lg"><span>Error! {error}</span></div></div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-base-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Edit: <span className="text-primary">{problem.title}</span></h1>
                {/* This button also goes back, just like a successful save will */}
                <button onClick={() => navigate(-1)} className="btn btn-ghost">← Back to List</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-12">
                {/* General Details Card */}
                <div className="card bg-base-200 shadow-xl"><div className="card-body">
                    <h2 className="card-title text-2xl">General Details</h2>
                    <div className="form-control"><label className="label"><span className="label-text">Title</span></label><input type="text" name="title" value={problem.title} onChange={handleInputChange} className="input input-bordered w-full" /></div>
                    <div className="form-control"><label className="label"><span className="label-text">Description (Markdown)</span></label><textarea name="description" value={problem.description} onChange={handleInputChange} className="textarea textarea-bordered h-48 w-full font-mono" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control"><label className="label"><span className="label-text">Difficulty</span></label><select name="difficulty" value={problem.difficulty} onChange={handleInputChange} className="select select-bordered w-full"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
                        <div className="form-control"><label className="label"><span className="label-text">Tags (comma-separated)</span></label><input type="text" value={problem.tags.join(', ')} onChange={handleTagsChange} className="input input-bordered w-full" /></div>
                    </div>
                </div></div>

                {/* Test Cases Card */}
                <div className="card bg-base-200 shadow-xl"><div className="card-body">
                    <h2 className="card-title text-2xl">Test Cases</h2>
                    {['visibleTestCases', 'hiddenTestCases'].map(section => (
                        <div key={section} className="mt-4"><h3 className="text-xl font-semibold capitalize">{section.replace('TestCases', ' Test Cases')}</h3><div className="space-y-4 mt-2">
                            {problem[section].map((tc, index) => (
                                <div key={index} className="p-4 bg-base-100 rounded-lg border border-base-300 space-y-2">
                                    <h4>Test Case #{index + 1}</h4>
                                    <div className="form-control"><label className="label"><span className="label-text">Input</span></label><textarea value={tc.input} onChange={e => handleArrayItemChange(section, index, 'input', e.target.value)} className="textarea textarea-bordered font-mono h-24" /></div>
                                    <div className="form-control"><label className="label"><span className="label-text">Expected Output</span></label><textarea value={tc.output} onChange={e => handleArrayItemChange(section, index, 'output', e.target.value)} className="textarea textarea-bordered font-mono h-24" /></div>
                                    {section === 'visibleTestCases' && <div className="form-control"><label className="label"><span className="label-text">Explanation (Optional)</span></label><input type="text" value={tc.explanation || ''} onChange={e => handleArrayItemChange(section, index, 'explanation', e.target.value)} className="input input-bordered w-full" /></div>}
                                    <div className="text-right"><button type="button" onClick={() => removeArrayItem(section, index)} className="btn btn-sm btn-error btn-outline">Remove</button></div>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem(section, { input: '', output: '', explanation: '' })} className="btn btn-sm btn-outline btn-accent mt-2">+ Add Case</button>
                        </div></div>
                    ))}
                </div></div>

                {/* Code Snippets Card */}
                <div className="card bg-base-200 shadow-xl"><div className="card-body">
                    <h2 className="card-title text-2xl">Code Snippets</h2>
                    {['startCode', 'referenceSolution'].map(section => (
                        <div key={section} className="mt-4"><h3 className="text-xl font-semibold capitalize">{section === 'startCode' ? 'Starter Code' : 'Reference Solution'}</h3>
                            {problem[section].map((code, index) => (
                                <div key={index} className="p-4 bg-base-100 rounded-lg border border-base-300 mt-2">
                                    <h4 className="font-bold text-lg">{code.language}</h4>
                                    <div className="form-control mt-2"><textarea value={section === 'startCode' ? code.initialCode : code.completeCode} onChange={e => handleArrayItemChange(section, index, section === 'startCode' ? 'initialCode' : 'completeCode', e.target.value)} className="textarea textarea-bordered h-64 w-full font-mono" /></div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div></div>

                {/* Submission Area */}
                <div className="card-actions justify-end mt-8 items-center gap-4">
                    {error && <div role="alert" className="alert alert-error flex-grow"><span><strong>Error:</strong> {error}</span></div>}
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                        {submitting && <span className="loading loading-spinner"></span>}
                        {submitting ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProblemPage;