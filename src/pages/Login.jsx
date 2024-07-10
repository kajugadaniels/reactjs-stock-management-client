import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = {
            email,
            password,
        };

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                setError('');
                alert(`Login Successful! Welcome ${data.data.name}`);
                navigate('/dashboard');
            } else {
                console.error('Login error:', data.message);
                setError(data.message || 'Login failed');
                alert('Login Failed: ' + (data.message || 'Invalid credentials'));
            }
        } catch (error) {
            console.error('Network error:', error);
            setError('An error occurred. Please try again.');
            alert('Network Error: Please try again later.');
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-white">
            <div className="flex flex-col md:flex-row bg-white overflow-hidden gap-32 mt-32">
                <div className="hidden md:flex md:w-1/2 bg-cover bg-center">
                    <div className="flex flex-col items-center justify-center mb-28 p-6">
                        <img src="images/Container.png" alt="icon1" className="mb-4 w-auto h-96" />
                    </div>
                </div>
                <div className="flex items-start justify-center mb-28 bg-white">
                    <div className="w-96 max-w-md px-6 py-20 space-y-6 bg-white rounded-lg shadow-md">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-zinc-900">
                                Welcome back{' '}
                                <span role="img" aria-label="wave">
                                    👋
                                </span>
                            </h2>
                            <p className="text-zinc-600">Log in to your account</p>
                        </div>
                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-1">
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 gap-10 flex-grow px-4 py-2 text-zinc-900 placeholder-zinc-500 bg-zinc-100 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="md@jabana.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 gap-10 flex-grow px-4 py-2 text-zinc-900 placeholder-zinc-500 bg-zinc-100 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent "
                                    placeholder="...................."
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember_me"
                                        name="remember_me"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary border-zinc-300 rounded focus:ring-primary"
                                    />
                                    <label htmlFor="remember_me" className="ml-2 block text-sm text-zinc-900">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-primary hover:text-primary-dark">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                            <button type="submit" className="w-full px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                                    Continue
                                </button>
                        </form>
                        <div className="text-center">
                            <p className="text-zinc-600">
                                Don't have an account?{' '}
                                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
