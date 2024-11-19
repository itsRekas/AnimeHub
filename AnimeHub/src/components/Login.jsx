import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import bcrypt from 'bcryptjs';

const Login = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usere, setUsere] = useState(false);
    const [match, setMatch] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const loginSubmit = async (e) => {
        e.preventDefault();

        const { data: userData, error } = await supabase
            .from('users')
            .select()
            .eq('username', username)
            .single();

        if (error || !userData) {
            setUsere(true);
            setUsername('');
        } else {
            try {
                const hashed = bcrypt.compareSync(password, userData.password);
                setMatch(hashed);

                if (!hashed) {
                    setMatch(true);
                    setPassword('');
                } else {
                    setUser(userData);
                    navigate('/');
                }
            } catch (err) {
                console.error("Error verifying password:", err.message);
            }
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4  text-white'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 
                          bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'>
                AnimeHub
            </h1>
            
            <div className='w-full max-w-[90%] sm:max-w-[400px] md:max-w-[500px] 
                          rounded-3xl shadow-2xl shadow-black 
                          bg-gray-800 p-6 sm:p-8'>
                <h2 className='text-xl sm:text-2xl font-semibold text-center mb-4'>
                    Login
                </h2>
                
                {usere && (
                    <h2 className='text-red-600 text-center text-sm sm:text-base mb-2'>
                        Username does not exist
                    </h2>
                )}
                {match && (
                    <h2 className='text-red-600 text-center text-sm sm:text-base mb-2'>
                        Password incorrect
                    </h2>
                )}
                
                <div className='w-full'>
                    <form onSubmit={loginSubmit} 
                          className='flex flex-col gap-4 sm:gap-6 w-full'>
                        <input
                            className='w-full rounded-xl h-10 sm:h-12 px-4
                                     bg-gray-700 text-white placeholder-gray-400
                                     border border-gray-600 focus:border-blue-500
                                     focus:outline-none transition-colors'
                            type="text"
                            name='username'
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setUsere(false); }}
                            placeholder='Username'
                        />
                        <input
                            className='w-full rounded-xl h-10 sm:h-12 px-4
                                     bg-gray-700 text-white placeholder-gray-400
                                     border border-gray-600 focus:border-blue-500
                                     focus:outline-none transition-colors'
                            type="password"
                            name='password'
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setMatch(false); }}
                            placeholder='Password'
                        />
                        <button 
                            type='submit'
                            className='w-full rounded-xl h-10 sm:h-12
                                     bg-blue-600 text-white font-semibold
                                     hover:bg-blue-700 transition-colors
                                     focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            Login
                        </button>
                    </form>
                </div>
                
                <div className='mt-6 text-center'>
                    <Link 
                        to='/register'
                        className='text-blue-400 hover:text-blue-300 transition-colors
                                 text-sm sm:text-base'
                    >
                        Don't have an account? Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;