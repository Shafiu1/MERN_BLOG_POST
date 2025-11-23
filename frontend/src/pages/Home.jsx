import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/posts');
                setPosts(res.data);
            } catch (err) {
                console.error('Failed to fetch posts:', err.message);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text drop-shadow-md">
                Latest Blog Posts
            </h2>

            {posts.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">No posts yet.</p>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-gray-700 mt-3 leading-relaxed">
                                {post.content.slice(0, 130)}...
                            </p>
                            <p className="text-sm text-gray-500 mt-3">
                                ✍️ <span className="font-semibold">{post.author?.username || 'Unknown'}</span>
                            </p>


                            <Link
                                to={`/post/${post._id}`}
                                className="inline-block mt-5 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition"
                            >
                                Read Full Post →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
