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

  if (!post) return <div>Loading...</div>;

  return (
    <div className='flex flex-col w-full h-full'>
      <Navbar add={true}/>
      <div className='flex flex-1 flex-col items-center'>
        <div className='w-3/5 min-h-full mt-20 pt-10 shadow-xl flex flex-col items-center gap-y-10'>
          <div className='w-4/5 flex flex-col gap-y-4'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-bold'>@{post.username}</h2>
              {user.username === post.username && (
                <div className='flex gap-x-4'>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  <button 
                    onClick={handleDeletePost}
                    className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <img 
              src={post.imageurl} 
              alt="post" 
              className='w-full rounded-lg shadow-xl'
            />

            {isEditing ? (
              <div className='flex flex-col gap-y-2'>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className='w-full p-2 border rounded'
                  rows="3"
                />
                <button 
                  onClick={handleUpdatePost}
                  className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <p className='text-lg'>{post.say}</p>
            )}

            <div className='flex items-center gap-x-4'>
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
              <button 
                onClick={() => setShowLikes(!showLikes)}
                className='text-blue-500 hover:underline'
              >
                {likes.length} likes
              </button>
            </div>

            {showLikes && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-black rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-xl font-bold'>Likes</h3>
                    <button 
                      onClick={() => setShowLikes(false)}
                      className='text-gray-500 hover:text-gray-700'
                    >
                      ×
                    </button>
                  </div>
                  {likes.map((username, index) => (
                    <div key={index} className='py-2 border-b'>
                      @{username}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='mt-4'>
              {comments.map((comment, index) => (
                <div key={index} className='flex justify-between items-start py-2 border-b'>
                  <div className='flex gap-x-2'>
                    <span className='font-bold'>{comment.user}:</span>
                    <span>{comment.text}</span>
                  </div>
                  <span className='text-sm text-gray-500'>
                    {formatDate(comment.date)}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className='mt-4'>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className='w-full p-2 border rounded'
                rows="3"
              />
              <button 
                type="submit"
                className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
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