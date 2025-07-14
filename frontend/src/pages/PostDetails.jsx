import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            console.log("✅ Loaded user from localStorage:", parsed);
            setUser(parsed);
        }
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
                console.log("✅ Post fetched:", res.data);
                setPost(res.data);
            } catch (err) {
                setError('Post not found',err);
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/');
        } catch (err) {
            alert('Failed to delete post',err);
        }
    };

    if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;
    if (!post) return <p className="text-center mt-6">Loading...</p>;

    const isAuthor =
        user &&
        post &&
        post.author &&
        post.author._id?.toString() === user.id?.toString();

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>
            <p className="text-gray-600 mb-1">
                <strong>By:</strong> {post.author?.username}
            </p>
            <p className="text-sm text-gray-400 mb-4">
                {new Date(post.createdAt).toLocaleString()}
            </p>
            <hr className="mb-4" />
            <p className="text-gray-700 leading-relaxed">{post.content}</p>

            {isAuthor && (
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={() => navigate(`/edit/${post._id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default PostDetails;
