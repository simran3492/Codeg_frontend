import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient'; // Ensure this points to your configured axios instance

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [updatingUserId, setUpdatingUserId] = useState(null); // Tracks the user being updated for loading state

    useEffect(() => {
        // Get the logged-in user's ID from localStorage.
        const currentLoggedInUser = JSON.parse(localStorage.getItem('user'));
        if (currentLoggedInUser) {
            setLoggedInUserId(currentLoggedInUser._id);
        }
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await axiosClient.get('/user/getalluser');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            // You might want to show a toast or a message to the user
        }
    };

    const handleRoleChange = async (userId, currentRole) => {
        if (updatingUserId) return; // Prevent multiple requests at once

        setUpdatingUserId(userId); // Set loading state for the specific button
        const newRole = currentRole === 'user' ? 'admin' : 'user';

        try {
            await axiosClient.put(`/user/role/${userId}`, { role: newRole });
            // Refresh the list to show the change immediately
            await fetchAllUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
            alert(error.response?.data?.message || 'Failed to update role.');
        } finally {
            setUpdatingUserId(null); // Reset loading state
        }
    };

    // Helper function to correctly display user's name
    const getUserName = (user) => {
        // Use displayName if it exists.
        if (user.displayName) {
            return user.displayName;
        }
        // Otherwise, construct it from firstName and lastName.
        // This filters out null/undefined values and joins them with a space.
        return [user.firstName, user.lastName].filter(Boolean).join(' ');
    };

    return (
        <div className="p-4 md:p-8 bg-base-200 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">Manage User Roles</h1>
            
            <div className="overflow-x-auto shadow-xl rounded-lg">
                <table className="table w-full">
                    {/* head */}
                    <thead className="bg-base-300 text-sm uppercase">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="hover">
                                <td className="p-4 font-medium">
                                    {getUserName(user)}
                                </td>
                                <td className="p-4">{user.emailID}</td>
                                <td className="p-4">
                                    {user.role === 'admin' ? (
                                        <div className="badge badge-error gap-2">admin</div>
                                    ) : (
                                        <div className="badge badge-info gap-2">user</div>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    {/* A user cannot change their own role */}
                                    {user._id !== loggedInUserId && (
                                        <button
                                            onClick={() => handleRoleChange(user._id, user.role)}
                                            className={`btn btn-sm capitalize ${
                                                user.role === 'user' ? 'btn-success' : 'btn-warning'
                                            } ${updatingUserId === user._id ? 'loading' : ''}`}
                                            disabled={updatingUserId === user._id}
                                        >
                                            {updatingUserId === user._id
                                                ? 'Updating'
                                                : `Make ${user.role === 'user' ? 'Admin' : 'User'}`}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;