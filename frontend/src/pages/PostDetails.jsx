import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    // Load user
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Fetch post and comments
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
                setPost(res.data);
            } catch (err) {
                setError('Post not found',err);
            }
        };

        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/comments/${id}`);
                setComments(res.data);
            } catch (err) {
                console.error('Failed to fetch comments',err);
            }
        };

        fetchPost();
        fetchComments();
    }, [id]);

    // Delete post
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

    // Add comment
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); // 🔍 Must not be null
            console.log(token);
            if (!token) {
                alert('You must be logged in to comment.');
                return;
            }

            const res = await axios.post(
                `http://localhost:5000/api/comments/${id}`,
                { content: commentText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComments([res.data, ...comments]); // Add new comment
            setCommentText('');
        } catch (err) {
            console.error('Failed to post comment', err);
        }
    };


    if (error) return <p>{error}</p>;
    if (!post) return <p>Loading...</p>;

    const isAuthor = user && post.author?._id === user.id;

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Post */}
            <div className="bg-white shadow-md rounded p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                    By <span className="font-medium">{post.author?.username}</span> on{' '}
                    {new Date(post.createdAt).toLocaleString()}
                </p>
                <p className="text-gray-800">{post.content}</p>

                {isAuthor && (
                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={() => navigate(`/edit/${post._id}`)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                    <textarea
                        className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring focus:border-blue-300"
                        rows="3"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Post Comment
                    </button>
                </form>
            ) : (
                <p className="text-gray-600 mb-4">Login to comment.</p>
            )}

            {/* Comments */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Comments ({comments.length})</h3>
                {comments.length === 0 ? (
                    <p className="text-gray-500">No comments yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {comments.map((c) => (
                            <li key={c._id} className="bg-gray-100 p-3 rounded shadow-sm">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">{c.user?.username}</span> •{' '}
                                    {new Date(c.createdAt).toLocaleString()}
                                </p>
                                <p className="mt-1">{c.content}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default PostDetails;
