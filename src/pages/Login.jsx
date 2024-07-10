import React from 'react';

const Login = () => {
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
                        <form className="space-y-6">
                            <div className="space-y-1">
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <div className="relative flex items-center w-full">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full pl-10 gap-10 flex-grow px-4 py-2 text-zinc-900 placeholder-zinc-500 bg-zinc-100 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="md@jabana.com"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                            <path fill="#000000" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm3.519 0L12 11.671L18.481 6zM20 7.329l-7.341 6.424a1 1 0 0 1-1.318 0L4 7.329V18h16z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1 flex">
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <div className="relative flex items-center w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#000000" d="M12 17a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m6 3V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"></path></svg>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full pl-10 gap-10 flex-grow px-4 py-2 text-zinc-900 placeholder-zinc-500 bg-zinc-100 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent "
                                        placeholder="...................."
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1.5em"
                                            height="1.5em"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="#000000"
                                                d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.8 11.8 0 0 1-4 5.19l-1.42-1.43A9.86 9.86 0 0 0 20.82 12A9.82 9.82 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.82 9.82 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>

                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="w-4 h-4 text-primary border-zinc-300 rounded focus:ring-primary" />
                                    <label htmlFor="remember-me" className="ml-2 text-sm text-zinc-600">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-primary hover:text-primary-foreground">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="w-full px-4 py-2 text-white bg-[#00BDD6] rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;
