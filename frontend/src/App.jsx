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

  // Load user from localStorage on mount
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
      {/* Navigation bar */}
      <nav className="bg-gray-800 text-white px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
        <div className="flex gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          {!user && <Link to="/login" className="hover:underline">Login</Link>}
          {!user && <Link to="/register" className="hover:underline">Register</Link>}
          {user && (
            <>
              <Link to="/create" className="hover:underline">Create Post</Link>
            </>
          )}
        </div>
        
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm">Welcome, {user.username}</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
              Logout
            </button>
          </div>
        )}
      </nav>


      {/* Routes */}
      <div className="p-6 max-w-4xl mx-auto bg-gray-200">
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
