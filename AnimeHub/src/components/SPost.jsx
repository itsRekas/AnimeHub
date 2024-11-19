import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { supabase } from '../../supabase'
import { useNavigate, useParams } from 'react-router-dom'

const SPost = ({user}) => {
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [showLikes, setShowLikes] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        navigate('/login');
    }
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', slug)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        navigate('/');
        return;
      }

      setPost(data);
      setLikes(data.likes || []);
      setIsLiked(data.likes?.includes(user.username));
      setComments(data.comments.map(comment => JSON.parse(comment)));
      setEditedText(data.say);
    };

    fetchPost();
  }, [slug, user?.username, navigate]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLikeToggle = async () => {
    if (!post) return;

    const updatedLikes = isLiked
      ? likes.filter(username => username !== user.username)
      : [...likes, user.username];
    
    const { error } = await supabase
      .from('posts')
      .update({ likes: updatedLikes })
      .eq('id', post.id);

    if (error) {
      console.error('Error updating likes:', error);
    } else {
      setLikes(updatedLikes);
      setIsLiked(!isLiked);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!post || !newComment.trim()) return;

    const newCommentObj = JSON.stringify({
      date: Date.now(),
      text: newComment,
      user: user.username
    });
    const updatedComments = [...post.comments, newCommentObj];
    
    const { error } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('id', post.id);

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setComments([...comments, JSON.parse(newCommentObj)]);
      setNewComment('');
    }
  };

  const handleUpdatePost = async () => {
    if (!post) return;

    const { error } = await supabase
      .from('posts')
      .update({ say: editedText })
      .eq('id', post.id);

    if (error) {
      console.error('Error updating post:', error);
    } else {
      setIsEditing(false);
      setPost({ ...post, say: editedText });
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id);

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      navigate('/');
    }
  };

  if (!post) return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
    </div>
  );

  return (
    <div className='flex flex-col w-full min-h-screen  text-white'>
      <Navbar add={true}/>
      <div className='flex flex-1 flex-col items-center px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-4xl min-h-full mt-20 pt-5 sm:pt-10 shadow-xl flex flex-col items-center gap-y-5 sm:gap-y-10'>
          <div className='w-full sm:w-[90%] md:w-4/5 flex flex-col gap-y-4 bg-[rgba(0,0,0,0.2)] rounded-3xl'>
            {/* Header with username and options */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-2'>
            <h2 className='text-lg font-bold text-black sm:text-xl sm:text-white'>@{post.username}</h2>
              {user.username === post.username && (
                <div className='flex gap-x-2 sm:gap-x-4'>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className='px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded text-sm sm:text-base hover:bg-blue-600'
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  <button 
                    onClick={handleDeletePost}
                    className='px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded text-sm sm:text-base hover:bg-red-600'
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Post image */}
            <img 
              src={post.imageurl} 
              alt="post" 
              className=' self-center w-4/5 rounded-lg shadow-xl object-cover max-h-[600px]' 
            />

            {/* Post text */}
            {isEditing ? (
              <div className='flex flex-col gap-y-2'>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className='w-full p-2 border rounded bg-gray-700 text-white'
                  rows="3"
                />
                <button 
                  onClick={handleUpdatePost}
                  className='px-3 py-1 sm:px-4 sm:py-2 bg-green-500 text-white rounded text-sm sm:text-base hover:bg-green-600'
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <p className='text-sm sm:text-lg'>{post.say}</p>
            )}

            {/* Likes section */}
            <div className='flex items-center gap-x-4'>
              <button 
                onClick={handleLikeToggle}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full focus:outline-none focus:ring-2 
                           focus:ring-opacity-50 flex items-center text-sm sm:text-base
                           ${isLiked ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {isLiked ? 'Liked' : 'Like'}
              </button>
              <button 
                onClick={() => setShowLikes(!showLikes)}
                className='text-sm sm:text-base text-blue-500 hover:underline'
              >
                {likes.length} likes
              </button>
            </div>

            {/* Likes modal */}
            {showLikes && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                <div className='bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[80vh] overflow-y-auto'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg sm:text-xl font-bold text-white'>Likes</h3>
                    <button 
                      onClick={() => setShowLikes(false)}
                      className='text-gray-400 hover:text-gray-200 text-xl sm:text-2xl'
                    >
                      ×
                    </button>
                  </div>
                  {likes.map((username, index) => (
                    <div key={index} className='py-2 border-b border-gray-700 text-white'>
                      @{username}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments section */}
            <div className='mt-4 space-y-3'>
              {comments.map((comment, index) => (
                <div key={index} className='flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-700'>
                  <div className='flex gap-x-2 mb-1 sm:mb-0'>
                    <span className='font-bold text-sm sm:text-base'>{comment.user}:</span>
                    <span className='text-sm sm:text-base'>{comment.text}</span>
                  </div>
                  <span className='text-xs sm:text-sm text-gray-400'>
                    {formatDate(comment.date)}
                  </span>
                </div>
              ))}
            </div>

            {/* Add comment form */}
            <form onSubmit={handleCommentSubmit} className='mt-4 flex flex-col items-center'>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className='w-4/5 self-center p-2 border rounded-3xl bg-gray-700 text-white text-sm sm:text-base'
                rows="3"
              />
              <button 
                type="submit"
                className='mt-2 px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-full text-sm sm:text-base hover:bg-blue-600'
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SPost