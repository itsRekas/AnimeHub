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
                const hashed = bcrypt.compareSync(password,userData.password);
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
        <div className='flex flex-col items-center justify-center h-full gap-10'>
            <h1>AnimeHub</h1>
            <div className='rounded-3xl shadow-2xl shadow-black h-[400px] w-[500px] flex flex-col justify-center items-center'>
                <h2>Login</h2>
                {usere && <h2 className='text-red-600'>Username does not exist</h2>}
                {match && <h2 className='text-red-600'>Password incorrect</h2>}
                <div className='flex items-center justify-center h-3/5 w-4/5'>
                    <form onSubmit={loginSubmit} className='flex flex-col justify-around h-full w-full items-center'>
                        <input
                            className='rounded-2xl h-9 w-4/5 px-3'
                            type="text"
                            name='username'
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setUsere(false); }}
                            placeholder='Username'
                        />
                        <input
                            className='rounded-2xl h-9 w-4/5 px-3'
                            type="password"
                            name='password'
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setMatch(false); }}
                            placeholder='Password'
                        />
                        <button type='submit'>Login</button>
                    </form>
                </div>
                <Link to={'/register'}>Register</Link>
            </div>
        </div>
    );
};

export default Login;
