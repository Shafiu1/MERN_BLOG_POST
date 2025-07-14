import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
                setTitle(res.data.title);
                setContent(res.data.content);
            } catch (err) {
                setMsg('⚠️ Failed to fetch post',err);
            }
        };
        fetchPost();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/posts/${id}`,
                { title, content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate(`/post/${id}`);
        } catch (err) {
            setMsg('⚠️ Failed to update post',err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Post</h2>
            {msg && (
                <p className="mb-4 text-center text-red-600 font-medium">{msg}</p>
            )}

            <form
                onSubmit={handleUpdate}
                className="bg-white p-6 rounded shadow-md space-y-6"
            >
                <div>
                    <label className="block mb-2 text-gray-700 font-medium">Title</label>
                    <input
                        type="text"
                        placeholder="Post title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-gray-700 font-medium">Content</label>
                    <textarea
                        placeholder="Post content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-2 rounded h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                    Update Post
                </button>
            </form>
        </div>
    );
}

export default EditPost;
