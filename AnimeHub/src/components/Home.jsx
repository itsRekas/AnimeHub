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
            .order('created_at', { ascending: false }); // Default to latest posts

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
            setFilteredPosts(posts); // Reset to all posts if search is empty
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
        <div className='flex flex-col w-full h-full'>
            <Navbar onSearch={handleSearch} onSort={handleSort} />
            <div className='flex flex-1 flex-col items-center'>
                <div className='w-3/5 min-h-full mt-20 pt-10 shadow-2xl shadow-black flex flex-col items-center gap-y-10'>
                    {filteredPosts ? (
                        filteredPosts.length > 0 ? (
                            filteredPosts.map((post, index) => (
                                <div 
                                    className='flex flex-col items-center w-4/5' 
                                    key={post.id || index}
                                >
                                    <Post post={post} user={user} />
                                </div>
                            ))
                        ) : (
                            <div className='text-gray-500 text-lg'>
                                No posts found
                            </div>
                        )
                    ) : (
                        <div className='text-gray-500 text-lg'>
                            Loading...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home