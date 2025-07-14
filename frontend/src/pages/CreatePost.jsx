import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to create a post.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/posts', {
                title,
                content,
                author: user.id,
            });

            navigate('/');
        } catch (err) {
            console.error('Post creation failed:', err.message);
            toast.error('Post creation failed');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Post</h2>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md space-y-6"
            >
                <div>
                    <label className="block mb-2 text-gray-700 font-medium">Title</label>
                    <input
                        type="text"
                        placeholder="Enter post title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-gray-700 font-medium">Content</label>
                    <textarea
                        placeholder="Write your content here..."
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
                    Create
                </button>
            </form>
        </div>
    );
}

export default CreatePost;
