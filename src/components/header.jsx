import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../redux/authSlice';
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { toggleTheme } from '../redux/themeSlice';

// Enhanced UserAvatar component with better fallback handling
const UserAvatar = ({ user }) => {
  const [imageError, setImageError] = useState(false);

  const displayName = user?.firstName || user?.displayName || "User";
  const initial = displayName[0]?.toUpperCase() || "U";

  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-green-500', 'bg-teal-500', 'bg-blue-500',
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
  ];
  const colorIndex = initial.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  // Debug log to see what photoURL we're getting
  console.log('UserAvatar - photoURL:', user?.photoURL);
  console.log('UserAvatar - firstName:', user?.firstName);

  // Check if we have a valid photoURL and no error occurred
  if (user?.photoURL && !imageError && user.photoURL.trim() !== '') {
    return (
      <img
        src={user.photoURL}
        alt={displayName}
        className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow"
        onError={() => {
          console.log('Image failed to load:', user.photoURL);
          setImageError(true);
        }}
        onLoad={() => {
          console.log('Image loaded successfully:', user.photoURL);
        }}
      />
    );
  }

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xl ${bgColor}`}
    >
      {initial}
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.mode);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    console.log("1. Logout process started.");
    try {
      console.log("2. Attempting to sign out from Firebase...");
      await signOut(auth);
      console.log("3. Firebase signOut() successful.");
      console.log("4. Dispatching userLogout to clear backend session and Redux state...");
      dispatch(userLogout());
      console.log("5. Redux dispatch complete.");
    } catch (error) {
      console.error("ERROR during logout:", error);
      dispatch(userLogout());
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300">
      <div className="navbar container mx-auto px-4">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-2xl md:text-3xl font-black tracking-tighter">
            <span className="text-primary">Code</span>Quest
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2">
            {['Problems', 'Subscribe', 'Discussion', 'POTD'].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  className="text-base font-medium text-base-content/70 hover:text-base-content transition-colors duration-300"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end space-x-2 md:space-x-4">
          <button
            onClick={handleThemeToggle}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle Theme"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <FiSun className="h-5 w-5" />
            ) : (
              <FiMoon className="h-5 w-5" />
            )}
          </button>

          <div className="hidden sm:flex items-center space-x-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Enhanced profile link with user info */}
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/profile" 
                    aria-label="View Profile" 
                    title="View Profile"
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <UserAvatar user={user} />
                    
                  </Link>
                </div>
                
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-ghost btn-sm">
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
              </>
            )}
          </div>

          <div className="dropdown dropdown-end lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 space-y-1">
              {['Problems', 'Subscribe', 'Discussion', 'POTD'].map((item) => (
                <li key={item}><Link to={`/${item.toLowerCase()}`}>{item}</Link></li>
              ))}
              <div className="divider my-1"></div>
              {!isAuthenticated ? (
                <>
                  <li><Link to="/login" className="btn btn-ghost w-full">Login</Link></li>
                  <li><Link to="/signup" className="btn btn-primary w-full">Sign Up</Link></li>
                </>
              ) : (
                <>
                  {/* Enhanced mobile profile link */}
                  <li>
                    <Link to="/profile" className="flex items-center justify-start w-full p-2">
                      <UserAvatar user={user} />
                      <div className="ml-3 flex flex-col">
                        <span className="font-medium text-sm">
                          {user?.firstName || user?.displayName || 'User'}
                        </span>
                        <span className="text-xs text-base-content/60">
                          {user?.emailID || user?.email || 'View Profile'}
                        </span>
                      </div>
                    </Link>
                  </li>
                  
                  {user && user?.role === 'admin' && (
                    <li>
                      <Link to="/admin" className="btn btn-ghost w-full justify-start">Admin Panel</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="btn btn-ghost w-full justify-start">Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;