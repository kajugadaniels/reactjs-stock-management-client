import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: location.state.error,
            });
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                email,
                password,
            });

            const { access_token, user } = response.data.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            if (rememberMe) {
                localStorage.setItem('email', email);
            } else {
                localStorage.removeItem('email');
            }

            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back!',
            });

            navigate('/dashboard');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || 'An error occurred. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="flex items-start justify-center min-h-screen bg-white">
            <div className="flex flex-col gap-32 mt-32 overflow-hidden bg-white md:flex-row">
                <div className="hidden bg-center bg-cover md:flex md:w-1/2">
                    <div className="flex flex-col items-center justify-center p-6 mb-28">
                        <img src="images/Container.png" alt="icon1" className="w-auto mb-4 h-96" />
                    </div>
                </div>
                <div className="flex items-start justify-center bg-white mb-28">
                    <div className="max-w-md px-6 py-20 space-y-6 bg-white rounded-lg shadow-md w-96">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-zinc-900">
                                Welcome back{' '}
                                <span role="img" aria-label="wave">
                                    👋
                                </span>
                            </h2>
                            <p className="text-zinc-600">Log in to your account</p>
                        </div>

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
                                    className="flex-grow w-full gap-10 px-4 py-2 pl-10 border rounded-md text-zinc-900 placeholder-zinc-500 bg-zinc-100 border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                    className="flex-grow w-full gap-10 px-4 py-2 pl-10 border rounded-md text-zinc-900 placeholder-zinc-500 bg-zinc-100 border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent "
                                    placeholder="*******"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Continue'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;