import { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setMsg('All fields are required');
            console.log("Not log in");
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            console.log("Full backend response:",res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            setMsg('Login successful!');
        } catch (err) {
            setMsg(err.response?.data?.msg || 'Login failed');
            console.log("Login unsuccessful");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {msg && <p>{msg}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
