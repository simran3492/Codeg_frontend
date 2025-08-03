import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';

const AdminDelete = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State to manage the delete confirmation modal for a better user experience
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [problemToDelete, setProblemToDelete] = useState(null);

    // --- Data Fetching ---
    const fetchProblems = async () => {
        setLoading(true);
        setError(''); // Reset error on each fetch
        try {
            // Your API returns the array directly, so we use 'data' itself.
            const { data } = await axiosClient.get('/problem/getAllProblem');

            // 1. Ensure 'data' is an array before trying to sort it.
            const problemsArray = Array.isArray(data) ? data : [];

            // 2. Sort the array by 'serial_number' in ascending order.
            problemsArray.sort((a, b) => a.serial_number - b.serial_number);
            
            // 3. Set the sorted array to state. THIS IS THE CRITICAL FIX.
            setProblems(problemsArray);

        } catch (err) {
            setError('Failed to fetch problems. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);


    // --- Modal and Deletion Logic ---

    // Opens the modal and sets which problem is targeted for deletion
    const openDeleteModal = (problem) => {
        setProblemToDelete(problem);
        setIsModalOpen(true);
    };

    // Closes the modal and resets the state
    const closeDeleteModal = () => {
        setProblemToDelete(null);
        setIsModalOpen(false);
    };

    // This function is called only after the user confirms in the modal
    const handleDeleteConfirm = async () => {
        if (!problemToDelete) return;

        try {
            await axiosClient.delete(`/problem/delete/${problemToDelete._id}`);
            // Update UI by filtering out the deleted problem from the current state
            setProblems(prevProblems => prevProblems.filter(p => p._id !== problemToDelete._id));
            closeDeleteModal(); // Close modal on success
        } catch (err) {
            setError('Failed to delete the problem. Please try again.');
            console.error(err);
            closeDeleteModal(); // Close modal even if there's an error
        }
    };


    // --- Render Logic ---

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="card-title text-3xl font-bold mb-4">Delete Problems</h1>

                    {error && (
                        <div role="alert" className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Error! {error}</span>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-base-200 text-base">
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Difficulty</th>
                                    <th>Tags</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {problems.map((problem) => (
                                    <tr key={problem._id} className="hover">
                                        {/* Display the serial_number */}
                                        <th className="font-mono text-center">{problem.serial_number}</th>
                                        <td className="font-semibold">{problem.title}</td>
                                        <td>
                                            <span className={`badge capitalize ${
                                                problem.difficulty.toLowerCase() === 'easy' ? 'badge-success'
                                                : problem.difficulty.toLowerCase() === 'medium' ? 'badge-warning'
                                                : 'badge-error'
                                            }`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td>
                                            {/* Map over the tags array to display each one separately */}
                                            <div className="flex flex-wrap gap-1">
                                                {problem.tags.map(tag => (
                                                    <div key={tag} className="badge badge-ghost">{tag}</div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <button 
                                                onClick={() => openDeleteModal(problem)}
                                                className="btn btn-error btn-sm"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {problems.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-lg text-base-content/60">No problems found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal (DaisyUI) */}
            <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
                    <p className="py-4">
                        Are you sure you want to delete the problem: <br/>
                        <strong className="text-lg">"{problemToDelete?.title}"</strong>?
                        <br/>
                        <span className="text-warning">This action cannot be undone.</span>
                    </p>
                    <div className="modal-action">
                        <button onClick={closeDeleteModal} className="btn">Cancel</button>
                        <button onClick={handleDeleteConfirm} className="btn btn-error">Confirm Delete</button>
                    </div>
                </div>
                {/* Enables closing modal by clicking outside of it */}
                <form method="dialog" className="modal-backdrop">
                    <button onClick={closeDeleteModal}>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default AdminDelete;