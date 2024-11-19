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

        // Check if the username already exists in Supabase
        const { data: userData, error } = await supabase
            .from('users')
            .select()
            .eq('username', username)
            .single();

        if (userData) {
            setExists(true);
            setUsername('');
            return; // Exit if user exists
        }

        // If username is available, hash the password and register the user
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into Supabase
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert({ username, password: hashedPassword })
                .select()
                .single();

            if (insertError) {
                console.error('Error inserting user:', insertError);
                return;
            }

            // Set user and navigate to the homepage
            setUser(newUser);
            navigate('/');
        } catch (err) {
            console.error("Error hashing password or registering user:", err.message);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-full gap-10'>
            <h1>AnimeHub</h1>
            <div className='rounded-3xl shadow-2xl shadow-black h-[400px] w-[500px] flex flex-col justify-center items-center'>
                <h2>Register</h2>
                {exists && <h2 className='text-red-600'>Username already exists</h2>}
                <div className='flex items-center justify-center h-3/4 w-4/5'>
                    <form onSubmit={registerSubmit} className='flex flex-col justify-around h-full w-full items-center'>
                        <input
                            className='rounded-2xl h-12 w-4/5 px-3'
                            type="text"
                            name='username'
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setExists(false); }}
                            placeholder='Username'
                        />
                        <input
                            className='rounded-2xl h-12 w-4/5 px-3'
                            type="password"
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                        />
                        <button type='submit'>Register</button>
                    </form>
                </div>
                <Link to={'/login'}>Login</Link>
            </div>
        </div>
    );
};

export default Register;
