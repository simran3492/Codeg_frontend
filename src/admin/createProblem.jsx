import React, { useState } from 'react';
import axiosClient from '../utils/axiosClient'; // Your configured Axios instance

// This constant is the single source of truth for language configurations.
// - id: Used for React state keys (e.g., formData.code.cpp).
// - name: Used for display in UI tabs and for parsing the "language" field in the JSON file.
// - backendName: The exact string your backend API expects (e.g., "c++").
const LANGUAGES = [
    { id: 'cpp', name: 'C++', backendName: 'c++' },
    { id: 'java', name: 'Java', backendName: 'java' },
    { id: 'javascript', name: 'JavaScript', backendName: 'javascript' },
    { id: 'python', name: 'Python', backendName: 'python' },
];

// Helper function to provide a clean initial state for the form. Used for initialization and resetting.
const getInitialState = () => ({
    title: '',
    serialNumber: '',
    description: '',
    difficulty: '',
    tags: [],
    visibleTestCases: [{ input: '', output: '', explanation: '' }],
    hiddenTestCases: [{ input: '', output: '' }],
    code: {
        cpp: { startCode: '', referenceSolution: '' },
        java: { startCode: '', referenceSolution: '' },
        javascript: { startCode: '', referenceSolution: '' },
        python: { startCode: '', referenceSolution: '' },
    },
});

const AdminCreateProblem = () => {
    const [mode, setMode] = useState('manual'); // Manages 'manual' vs 'json' mode
    const [formData, setFormData] = useState(getInitialState());
    const [currentTag, setCurrentTag] = useState('');
    const [activeLang, setActiveLang] = useState(LANGUAGES[0].id);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // --- FORM HANDLERS ---
    const handleFieldChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
    const handleTagKeyDown = (e) => { if (e.key === 'Enter' && currentTag.trim()) { e.preventDefault(); if (!formData.tags.includes(currentTag.trim())) { setFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] })); } setCurrentTag(''); } };
    const removeTag = (tagToRemove) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    const handleCodeChange = (type, value) => setFormData(prev => ({ ...prev, code: { ...prev.code, [activeLang]: { ...prev.code[activeLang], [type]: value } } }));
    const handleTestCaseChange = (index, field, value, type) => { const key = type === 'visible' ? 'visibleTestCases' : 'hiddenTestCases'; const updatedCases = [...formData[key]]; updatedCases[index][field] = value; setFormData(prev => ({ ...prev, [key]: updatedCases })); };
    const addTestCase = (type) => { const key = type === 'visible' ? 'visibleTestCases' : 'hiddenTestCases'; const newTC = type === 'visible' ? { input: '', output: '', explanation: '' } : { input: '', output: '' }; setFormData(prev => ({ ...prev, [key]: [...prev[key], newTC] })); };
    const removeTestCase = (index, type) => { const key = type === 'visible' ? 'visibleTestCases' : 'hiddenTestCases'; setFormData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) })); };

    // --- **REWRITTEN** JSON FILE HANDLER TO MATCH YOUR SPECIFIC FORMAT ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                // This object will hold the structured code data for our state
                const newCodeState = getInitialState().code;

                // Process the `startCode` array from the JSON file
                if (Array.isArray(data.startCode)) {
                    data.startCode.forEach(item => {
                        const langConfig = LANGUAGES.find(l => l.name === item.language);
                        if (langConfig) {
                            newCodeState[langConfig.id].startCode = item.initialCode || '';
                        }
                    });
                }

                // Process the `referenceSolution` array from the JSON file
                if (Array.isArray(data.referenceSolution)) {
                    data.referenceSolution.forEach(item => {
                        const langConfig = LANGUAGES.find(l => l.name === item.language);
                        if (langConfig) {
                            newCodeState[langConfig.id].referenceSolution = item.completeCode || '';
                        }
                    });
                }
                
                // Populate the entire form state with data from the file
                setFormData({
                    title: data.title || '',
                    serialNumber: data.serial_number || '',
                    description: data.description || '',
                    difficulty: data.difficulty || '',
                    tags: data.tags || [],
                    visibleTestCases: data.visibleTestCases || [{ input: '', output: '', explanation: '' }],
                    hiddenTestCases: data.hiddenTestCases || [{ input: '', output: '' }],
                    code: newCodeState, // Use the correctly parsed code object
                });
                
                alert('Fields populated from JSON! Please review in "Add Manually" mode before submitting.');
                setMode('manual'); // Switch back to manual mode for review
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                alert("Failed to parse JSON file. Please check its structure and content.");
            }
        };
        reader.readAsText(file);
    };

    // --- FORM SUBMISSION ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const startCodePayload = Object.entries(formData.code).filter(([, data]) => data.startCode?.trim()).map(([langId, data]) => ({ language: LANGUAGES.find(l => l.id === langId).backendName, initialCode: data.startCode }));
        const referenceSolutionPayload = Object.entries(formData.code).filter(([, data]) => data.referenceSolution?.trim()).map(([langId, data]) => ({ language: LANGUAGES.find(l => l.id === langId).backendName, completeCode: data.referenceSolution }));
        
        const problemData = {
            title: formData.title,
            serial_number: parseInt(formData.serialNumber, 10),
            description: formData.description,
            difficulty: formData.difficulty,
            tags: formData.tags,
            visibleTestCases: formData.visibleTestCases,
            hiddenTestCases: formData.hiddenTestCases,
            startCode: startCodePayload,
            referenceSolution: referenceSolutionPayload,
        };

        if (referenceSolutionPayload.length === 0) {
            setError("At least one Reference Solution is required.");
            setLoading(false);
            return;
        }

        try {
            console.log(problemData)
            const response = await axiosClient.post('/problem/create', problemData);
            setSuccess(response.data.message || 'Problem created successfully!');
            setFormData(getInitialState()); // Reset form on success
        } catch (err) {
            const result = err.response?.data;
            const errorMessage = result?.message || err.message;
            const errorDetails = result?.details ? `Status: ${result.details.status}` : '';
            setError(`${errorMessage} ${errorDetails}`.trim());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 bg-base-200 min-h-screen">
            <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Create New Problem</h1>
                
                <div role="tablist" className="tabs tabs-boxed my-6 bg-base-200">
                    <a role="tab" className={`tab ${mode === 'manual' ? 'tab-active' : ''}`} onClick={() => setMode('manual')}>Add Manually</a>
                    <a role="tab" className={`tab ${mode === 'json' ? 'tab-active' : ''}`} onClick={() => setMode('json')}>Add via JSON File</a>
                </div>

                {mode === 'manual' ? (
                    <form onSubmit={handleSubmit}>
                        {/* All form sections are wired to the unified `formData` state */}
                        <div className="mb-8 p-4 border border-base-300 rounded-lg"><h2 className="text-xl font-semibold mb-4">1. Problem Details</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="form-control"><label className="label"><span className="label-text">Problem Title</span></label><input type="text" value={formData.title} onChange={e => handleFieldChange('title', e.target.value)} className="input input-bordered w-full" required /></div><div className="form-control"><label className="label"><span className="label-text">Serial Number</span></label><input type="number" value={formData.serialNumber} onChange={e => handleFieldChange('serialNumber', e.target.value)} className="input input-bordered w-full" required /></div><div className="form-control"><label className="label"><span className="label-text">Difficulty</span></label><select value={formData.difficulty} onChange={e => handleFieldChange('difficulty', e.target.value)} className="select select-bordered" required><option value="" disabled>Select</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div><div className="form-control"><label className="label"><span className="label-text">Tags</span></label><div className="p-2 border border-base-300 rounded-lg flex flex-wrap gap-2 items-center">{formData.tags.map(tag => (<div key={tag} className="badge badge-primary gap-2">{tag}<button type="button" onClick={() => removeTag(tag)} className="btn btn-xs btn-ghost p-0">x</button></div>))}<input type="text" value={currentTag} onChange={e => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} className="input input-ghost p-1 flex-grow" placeholder="Add tag + Enter" /></div></div></div><div className="form-control mt-4"><label className="label"><span className="label-text">Description</span></label><textarea value={formData.description} onChange={e => handleFieldChange('description', e.target.value)} className="textarea textarea-bordered h-32" required></textarea></div></div>
                        <div className="mb-8 p-4 border border-base-300 rounded-lg"><h2 className="text-xl font-semibold mb-4">2. Code Stubs & Solutions</h2><div role="tablist" className="tabs tabs-lifted">{LANGUAGES.map(lang => (<a key={lang.id} role="tab" className={`tab ${activeLang === lang.id ? 'tab-active' : ''}`} onClick={() => setActiveLang(lang.id)}>{lang.name}</a>))}</div><div className="bg-base-100 p-4 rounded-b-lg border-t-0 border-base-300"><div className="form-control mb-4"><label className="label"><span className="label-text">Starter Code</span></label><textarea value={formData.code[activeLang].startCode} onChange={(e) => handleCodeChange('startCode', e.target.value)} className="textarea textarea-bordered font-mono h-40"></textarea></div><div className="form-control"><label className="label"><span className="label-text">Reference Solution</span></label><textarea value={formData.code[activeLang].referenceSolution} onChange={(e) => handleCodeChange('referenceSolution', e.target.value)} className="textarea textarea-bordered font-mono h-48"></textarea></div></div></div>
                        <div className="mb-8 p-4 border border-base-300 rounded-lg"><h2 className="text-xl font-semibold mb-4">3. Test Cases</h2><div><h3 className="text-lg font-medium">Visible Test Cases</h3>{formData.visibleTestCases.map((tc, index) => (<div key={index} className="p-3 my-2 border border-base-300 rounded-md relative"><button type="button" onClick={() => removeTestCase(index, 'visible')} className="btn btn-xs btn-circle btn-ghost absolute top-2 right-2">✕</button><div className="grid grid-cols-1 md:grid-cols-2 gap-2"><div className="form-control"><label className="label"><span className="label-text">Input</span></label><textarea value={tc.input} onChange={e => handleTestCaseChange(index, 'input', e.target.value, 'visible')} className="textarea textarea-bordered h-24 font-mono"></textarea></div><div className="form-control"><label className="label"><span className="label-text">Output</span></label><textarea value={tc.output} onChange={e => handleTestCaseChange(index, 'output', e.target.value, 'visible')} className="textarea textarea-bordered h-24 font-mono"></textarea></div></div><div className="form-control mt-2"><label className="label"><span className="label-text">Explanation</span></label><textarea value={tc.explanation} onChange={e => handleTestCaseChange(index, 'explanation', e.target.value, 'visible')} className="textarea textarea-bordered h-20"></textarea></div></div>))}<button type="button" onClick={() => addTestCase('visible')} className="btn btn-sm btn-outline btn-accent mt-2">+ Add</button></div><div className="mt-6"><h3 className="text-lg font-medium">Hidden Test Cases</h3>{formData.hiddenTestCases.map((tc, index) => (<div key={index} className="p-3 my-2 border border-base-300 rounded-md relative"><button type="button" onClick={() => removeTestCase(index, 'hidden')} className="btn btn-xs btn-circle btn-ghost absolute top-2 right-2">✕</button><div className="grid grid-cols-1 md:grid-cols-2 gap-2"><div className="form-control"><label className="label"><span className="label-text">Input</span></label><textarea value={tc.input} onChange={e => handleTestCaseChange(index, 'input', e.target.value, 'hidden')} className="textarea textarea-bordered h-24 font-mono"></textarea></div><div className="form-control"><label className="label"><span className="label-text">Output</span></label><textarea value={tc.output} onChange={e => handleTestCaseChange(index, 'output', e.target.value, 'hidden')} className="textarea textarea-bordered h-24 font-mono"></textarea></div></div></div>))}<button type="button" onClick={() => addTestCase('hidden')} className="btn btn-sm btn-outline btn-accent mt-2">+ Add</button></div></div>
                        <div>
                            {error && <div role="alert" className="alert alert-error mb-4"><span>Error: {error}</span></div>}
                            {success && <div role="alert" className="alert alert-success mb-4"><span>{success}</span></div>}
                            <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading && <span className="loading loading-spinner"></span>}{loading ? 'Creating...' : 'Create Problem'}</button>
                        </div>
                    </form>
                ) : (
                    <div className="p-4 border border-base-300 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Upload Problem JSON</h2>
                        <p className="mb-4">Select a correctly formatted JSON file. The form will be auto-populated for review.</p>
                        <div className="form-control"><label className="label"><span className="label-text">Problem JSON File</span></label><input type="file" accept=".json" className="file-input file-input-bordered file-input-primary w-full" onChange={handleFileChange} /></div>
                        <div className="mt-6 text-sm text-base-content/70"><p className="font-bold">Required JSON Structure:</p>
                        {/* Updated JSON example to match your required format */}
                        <pre className="bg-base-200 p-2 rounded-md mt-2 text-xs overflow-auto">{`{
  "title": "Two Sum",
  "serial_number": 1,
  "description": "...",
  "difficulty": "easy",
  "tags": ["array", "hash-table"],
  "visibleTestCases": [
    { "input": "...", "output": "...", "explanation": "..." }
  ],
  "hiddenTestCases": [
    { "input": "...", "output": "..." }
  ],
  "startCode": [
    { "language": "C++", "initialCode": "..." },
    { "language": "Java", "initialCode": "..." }
  ],
  "referenceSolution": [
    { "language": "C++", "completeCode": "..." },
    { "language": "Java", "completeCode": "..." }
  ]
}`}</pre></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCreateProblem;