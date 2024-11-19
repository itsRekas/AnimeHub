import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase.js';
import bcrypt from 'bcryptjs';

const Register = ({ user, setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [exists, setExists] = useState(false);

    const navigate = useNavigate();

    const registerSubmit = async (e) => {
        e.preventDefault();

        const { data: userData, error } = await supabase
            .from('users')
            .select()
            .eq('username', username)
            .single();

        if (userData) {
            setExists(true);
            setUsername('');
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert({ username, password: hashedPassword })
                .select()
                .single();

            if (insertError) {
                console.error('Error inserting user:', insertError);
                return;
            }

            setUser(newUser);
            navigate('/');
        } catch (err) {
            console.error("Error hashing password or registering user:", err.message);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4  text-white'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 
                          bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'>
                AnimeHub
            </h1>
            
            <div className='w-full max-w-[90%] sm:max-w-[400px] md:max-w-[500px] 
                          min-h-[300px] rounded-3xl shadow-2xl shadow-black 
                          bg-gray-800 p-6 sm:p-8'>
                <h2 className='text-xl sm:text-2xl font-semibold text-center mb-4'>
                    Register
                </h2>
                
                {exists && (
                    <div className='text-red-500 text-sm sm:text-base text-center mb-4 
                                  p-2 bg-red-500/10 rounded-lg'>
                        Username already exists
                    </div>
                )}
                
                <div className='w-full h-full'>
                    <form onSubmit={registerSubmit} 
                          className='flex flex-col gap-6 w-full'>
                        <div className='flex flex-col gap-2'>
                            <input
                                className='w-full rounded-xl h-10 sm:h-12 px-4
                                         bg-gray-700 text-white placeholder-gray-400
                                         border border-gray-600 focus:border-blue-500
                                         focus:outline-none transition-colors'
                                type="text"
                                name='username'
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setExists(false); }}
                                placeholder='Username'
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <input
                                className='w-full rounded-xl h-10 sm:h-12 px-4
                                         bg-gray-700 text-white placeholder-gray-400
                                         border border-gray-600 focus:border-blue-500
                                         focus:outline-none transition-colors'
                                type="password"
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                            />
                        </div>

                        <button 
                            type='submit'
                            className='w-full rounded-xl h-10 sm:h-12
                                     bg-blue-600 text-white font-semibold
                                     hover:bg-blue-700 transition-colors
                                     focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            Register
                        </button>
                    </form>
                </div>
                
                <div className='mt-6 text-center'>
                    <Link 
                        to='/login'
                        className='text-blue-400 hover:text-blue-300 transition-colors
                                 text-sm sm:text-base'
                    >
                        Already have an account? Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;