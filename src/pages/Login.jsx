import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
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
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'Welcome back!',
                });
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify({
                    name: data.data.name,
                    role: data.data.role
                }));
                if (rememberMe) {
                    localStorage.setItem('email', email);
                } else {
                    localStorage.removeItem('email');
                }
                navigate('/dashboard');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'Login failed',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'An error occurred. Please try again.',
            });
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
                            <button 
                                type="submit" 
                                className="w-full px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
