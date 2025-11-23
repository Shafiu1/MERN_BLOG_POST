import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      {/* ----------------------- Navigation Bar ----------------------- */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
            >
              Blog App
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
              <Link to="/" className="hover:text-blue-600 transition duration-200">
                Home
              </Link>

              {!user && (
                <>
                  <Link to="/login" className="hover:text-blue-600 transition">
                    Login
                  </Link>
                  <Link to="/register" className="hover:text-blue-600 transition">
                    Register
                  </Link>
                </>
              )}

              {user && (
                <Link to="/create" className="hover:text-blue-600 transition">
                  Create Post
                </Link>
              )}
            </div>

            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  👋 Welcome, <span className="font-semibold">{user.username}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Hamburger Icon */}
            <div className="md:hidden">
              <button className="text-gray-700 text-2xl hover:text-blue-600 transition">
                ☰
              </button>
            </div>

          </div>
        </div>
      </nav>
     
      <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/create"
            element={
              user ? (
                <CreatePost />
              ) : (
                <p className="p-4 bg-yellow-100 text-yellow-700 rounded shadow">
                  ⚠️ You must be logged in to create a post.
                </p>
              )
            }
          />

          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
