import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

const Add = ({user, setUser}) => {
  const [posturl, setPosturl] = useState("");
  const [say, setSay] = useState("");
  const [urlerror, setUrlerror] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setSay(e.target.value);
    
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleUrlChange = (e) => {
    setPosturl(e.target.value);
    setUrlerror(false);
  };

  const handlePost = async () => {
    if (posturl === "") {
      setUrlerror(true);
    } else {
      const data = {
        username: user.username,
        imageurl: posturl,
        say: say,
        likes: [],
        comments: [],
      }
      const { response: newUser, error: insertError } = await supabase.from('posts').insert(data).select().single();
      setPosturl("");
      setSay("");
      if (insertError) {
        console.error('Error inserting user:', insertError);
        return;
      }
      navigate('/');
    }
  };

  return (
    <div className='flex flex-col w-full min-h-screen'>
      <Navbar add={true}/>
      <div className='flex flex-1 flex-col items-center px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-4xl min-h-full mt-20 pt-10 shadow-xl flex flex-col gap-5 justify-center items-center'>
          <div className='w-full max-w-[500px] min-h-[500px] bg-black rounded-3xl shadow-2xl 
                         flex flex-col p-4 sm:p-5 items-center justify-around gap-4 sm:gap-5 mx-4'>
            <div className='w-full max-w-[384px] min-h-80'>
              {posturl ? (
                <img
                  src={posturl}
                  alt="Invalid Url"
                  className="w-full h-60 sm:h-80 object-cover rounded-lg"
                />
              ) : (
                <div className='flex items-center justify-center w-full h-60 sm:h-80 border-2 border-gray-700 rounded-lg'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-1/3 sm:w-2/5 h-1/3 sm:h-2/5 text-gray-400"
                    viewBox="0 0 128 128"
                  >
                    <path d="M64 6.05C49.15 6.05 34.3 11.7 23 23 0.4 45.6 0.4 82.4 23 105 34.3 116.3 49.2 122 64 122s29.7-5.7 41-17c22.6-22.6 22.6-59.4 0-82C93.7 11.7 78.85 6.05 64 6.05zm0 5.95c13.3 0 26.6 5.1 36.8 15.2 20.2 20.3 20.2 53.3 0 73.6-20.3 20.3-53.3 20.3-73.5 0-20.3-20.3-20.3-53.3 0-73.5C37.4 17.1 50.7 12 64 12zm0 30c-1.7 0-3 1.3-3 3v16H45c-1.7 0-3 1.3-3 3s1.3 3 3 3h16v16c0 1.7 1.3 3 3 3s3-1.3 3-3V67h16c1.7 0 3-1.3 3-3s-1.3-3-3-3H67V45c0-1.7-1.3-3-3-3z" 
                      fill="white" 
                    />
                  </svg>
                </div>
              )}
              <div className='w-full min-h-5 text-left mt-4 px-4'>
                {urlerror && <p className='text-red-600 text-sm sm:text-base'>Enter Valid URL</p>}
                <p className='w-full text-white text-sm sm:text-base'>{say || "What's up"}</p>
              </div>
            </div>
            
            <input 
              className='rounded-xl h-10 px-4 w-full max-w-[384px] bg-gray-800 text-white 
                         placeholder-gray-400 border border-gray-700 focus:outline-none 
                         focus:border-blue-500 text-sm sm:text-base'
              type="text" 
              placeholder='PostUrl' 
              value={posturl} 
              name='posturl' 
              onChange={handleUrlChange}
            />

            <textarea
              ref={textareaRef}
              className="w-full max-w-[384px] px-4 py-2 rounded-xl resize-none overflow-hidden 
                         bg-gray-800 text-white placeholder-gray-400 border border-gray-700 
                         focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              placeholder="What do you wanna say?"
              value={say}
              name="say"
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          <button 
            onClick={handlePost}
            className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     transition-colors duration-200 text-sm sm:text-base mb-6'
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default Add