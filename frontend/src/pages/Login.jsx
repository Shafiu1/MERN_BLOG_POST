import { useState } from 'react';
import axios from 'axios';

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setMsg('All fields are required');
            console.log("Not logged in");
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            console.log("Full backend response:", res.data);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            setUser(res.data.user);
            setMsg('Login successful!');
        } catch (err) {
            setMsg(err.response?.data?.msg || 'Login failed');
            console.log("Login unsuccessful");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

            {msg && (
                <p className="text-center mb-4 text-sm text-red-600">
                    {msg}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
