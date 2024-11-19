import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar';
import { supabase } from '../../supabase';
import Post from './Post';

const Home = ({user, setUser}) => {
    const [posts, setPosts] = useState(null);
    const [filteredPosts, setFilteredPosts] = useState(null);
    const navigate = useNavigate();

    const getPosts = async () => {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            return;
        }
        setPosts(data);
        setFilteredPosts(data);
    };

    useEffect(() => {
        if(!user) {
            navigate('/login');
        } else {
            getPosts();
        }
    }, [user, navigate]);

    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredPosts(posts);
            return;
        }

        const filtered = posts.filter(post => 
            post.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
    };
      
    const handleSort = (sortType) => {
        if (!filteredPosts) return;

        let sorted = [...filteredPosts];
        switch(sortType) {
            case 'latest':
                sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'mostLiked':
                sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
                break;
            default:
                return;
        }
        setFilteredPosts(sorted);
    };

    return (
        <div className='flex flex-col w-full min-h-screen'>
            <Navbar onSearch={handleSearch} onSort={handleSort} />
            <div className='flex flex-1 flex-col items-center px-4 sm:px-6 lg:px-8'>
                <div className='w-full max-w-7xl min-h-screen mt-20 pt-10 shadow-2xl shadow-black flex flex-col items-center gap-y-10'>
                    {!filteredPosts && (
                        <div className='flex items-center justify-center w-full p-8'>
                            <div className='text-gray-500 text-lg animate-pulse'>
                                Loading...
                            </div>
                        </div>
                    )}

                    {filteredPosts?.length === 0 && (
                        <div className='flex flex-col items-center justify-center w-full p-8'>
                            <div className='text-gray-500 text-lg text-center'>
                                No posts found
                            </div>
                        </div>
                    )}

                    {filteredPosts?.length > 0 && (
                        <div className='w-full flex flex-col items-center gap-y-10 px-4 sm:px-6 lg:px-8'>
                            {filteredPosts.map((post, index) => (
                                <div 
                                    key={post.id || index}
                                    className='w-full max-w-2xl transition-all duration-300 ease-in-out'
                                >
                                    <Post post={post} user={user} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home