import React, { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom';

const Post = ({ post, user }) => {
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(likes.includes(user.username));
  
  const navigate = useNavigate();

  const parsedComments = post.comments.map(comment => JSON.parse(comment));

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

  const formatPostDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (newComment.trim()) {
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
        setNewComment('');
      }
    }
  };

  const handlePost = () => {
    navigate(`/post/${post.id}`);
  };

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
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

  return (
    <div onClick={handlePost} className='w-4/5 min-h-[500px] shadow-black shadow-2xl rounded-3xl flex flex-col items-center box-border pt-5 cursor-pointer bg-gray-800 text-white'>
      <div className='flex w-4/5 flex-col'>
        <div className='flex items-center gap-x-2'>
          <h2 className='font-bold text-xl'>@{post.username}</h2>
          <span className='text-sm text-gray-400'>• {formatPostDate(post.created_at)}</span>
        </div>
      </div>
      <img className='flex w-4/5 mb-4 shadow-2xl shadow-black rounded-lg' src={post.imageurl} alt="post" />
      <p className='flex w-4/5 self-center mb-6'>{post.say}</p>
      
      <div className='w-4/5 flex justify-between items-center mb-4'>
        <button 
          onClick={handleLikeToggle}
          className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center ${
            isLiked ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {isLiked ? 'Liked' : 'Like'}
        </button>
        <span className='text-lg font-bold'>{likes.length} likes</span>
      </div>
      
      <div className='w-4/5 border-t border-gray-600 pt-4' onClick={(e) => e.stopPropagation()}>
        {parsedComments.length > 0 && (
          <div className='mb-4'>
            <div className='flex justify-between items-start mb-2'>
              <div className='flex'>
                <p className='font-bold mr-2'>{parsedComments[0].user}:</p>
                <p>{parsedComments[0].text}</p>
              </div>
              <p className='text-sm text-gray-400'>{formatDate(parsedComments[0].date)}</p>
            </div>
            {parsedComments.length > 1 && (
              <button 
                onClick={handlePost}
                className='text-gray-400 hover:text-gray-300'
              >
                View all {parsedComments.length} comments
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className='mb-4'>
          <textarea
            className='w-full p-2 border rounded-3xl bg-gray-700 text-white'
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          ></textarea>
          <button 
            type="submit"
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  )
}

export default Post