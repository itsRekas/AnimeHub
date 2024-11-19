import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onSearch, onSort,add }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleSearch = () => {
    if (onSearch) onSearch(searchTerm);
  };

  const handleSort = (sortType) => {
    if (onSort) onSort(sortType);
    setShowSortOptions(false);
  };

  return (
    <div className='flex fixed w-full justify-center items-center h-20 p-6 bg-[url(https://lh3.googleusercontent.com/RUg9YJuY2cPjh5znR5ZLqLJIBrm1CM2JuwCS1XP6g31ZDPa_NR--jR0JAum5qDbl2g5UKgBwM4SHSuyiWqjyd7VhBUI=s1280-w1280-h800)] text-white z-50 shadow-black shadow-2xl'>
      <div className='flex justify-between items-center w-4/5'>
        {/* Logo */}
        <Link to="/" className='hover:opacity-80 transition-opacity'>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'>
            AnimeHub
          </h1>
        </Link>

        {
          !add? 
          <div className='flex items-center w-2/5 relative'>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by username..."
                className='w-full h-10 pl-4 pr-12 rounded-full bg-gray-800 border border-gray-700 
                        text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent'
              />
              <button 
                onClick={handleSearch}
                className='absolute right-3 appearance-none focus:outline-none border-none p-0 m-0 bg-transparent cursor-pointer'
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          :""
        }
        

        {/* Navigation Buttons */}
        <div className='flex items-center gap-4'>
          <Link to="/">
            <button className='px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </button>
          </Link>

          {
            !add ?
            <div className='relative'>
              <button 
                onClick={() => setShowSortOptions(!showSortOptions)}
                className='px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
                </svg>
                Sort
              </button>
              
              {showSortOptions && (
                <div className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5'>
                  <div className='py-1' role='menu'>
                    <button
                      onClick={() => handleSort('latest')}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700'
                    >
                      Latest Posts
                    </button>
                    <button
                      onClick={() => handleSort('oldest')}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700'
                    >
                      Oldest Posts
                    </button>
                    <button
                      onClick={() => handleSort('mostLiked')}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700'
                    >
                      Most Liked
                    </button>
                  </div>
                </div>
              )}
            </div>
            :""
          }
          

          {
            !add?
            <Link to="/add">
              <button className='px-4 py-2 text-black rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Post
              </button>
            </Link>:""
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;