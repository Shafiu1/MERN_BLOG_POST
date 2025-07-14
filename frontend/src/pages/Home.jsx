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
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-6 text-center">All Posts</h2>
            {posts.length === 0 ? (
                <p className="text-gray-500 text-center">No posts yet.</p>
            ) : (
                posts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
                    >
                        <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                        <p className="text-gray-700 mt-2">
                            {post.content.slice(0, 100)}...
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            <strong>Author:</strong> {post.author?.username || 'Unknown'}
                        </p>

                        <Link
                            to={`/post/${post._id}`}
                            className="inline-block mt-4 text-blue-600 hover:underline font-medium"
                        >
                            See More →
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
