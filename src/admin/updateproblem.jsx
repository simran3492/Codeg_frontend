// src/pages/ProblemListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axiosClient'; // Your custom API client

const UpdateProblemPage = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllProblems = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get('/problem/getAllProblem');
                setProblems(response.data.problems || response.data);
            } catch (err) {
                setError('Failed to fetch problems. Please try refreshing the page.');
                console.error("Fetch All Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProblems();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Manage Problems</h1>
            {error && <div role="alert" className="alert alert-error mb-4"><span>{error}</span></div>}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="table w-full">
                    <thead className="bg-base-200 text-base">
                        <tr>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Tags</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((problem) => (
                            <tr key={problem._id} className="hover">
                                <td className="font-semibold">{problem.title}</td>
                                <td><span className={`badge ${problem.difficulty === 'easy' ? 'badge-success' : problem.difficulty === 'medium' ? 'badge-warning' : 'badge-error'}`}>{problem.difficulty}</span></td>
                                <td><div className="flex flex-wrap gap-1">{problem.tags.slice(0, 3).map(tag => <div key={tag} className="badge badge-outline">{tag}</div>)}</div></td>
                                <td className="text-right">
                                    {/* Link to the dedicated edit page */}
                                    <Link to={`/admin/update/editproblem/${problem._id}`} className="btn btn-primary btn-sm">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UpdateProblemPage;