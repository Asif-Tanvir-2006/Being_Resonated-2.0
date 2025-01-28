import React, { useState } from 'react';
import { Users, Clock, Heart, Share2, MessageCircle } from 'lucide-react';
import { EventPost } from '@/app/becommunity/page';
import { ObjectId } from 'mongoose';
import { UserPost } from '@/models/UserPost';
import { redirect } from 'next/navigation';

export type UserPost = {
  _id?: ObjectId; // Optional, generated by MongoDB
  createdBy: ObjectId;
  createdAt?: Date; // Managed by mongoose timestamps
  updatedAt?: Date; // Managed by mongoose timestamps
  caption: string;
  image: string;
  imgThumbnail?: string;
  name: string;
  user: {
    name: string,
    image: string
  }
  date: string;
  likes: [string];
  isEventPostPost: boolean;
  projectProgress: number;
};



type TeamPost = {


  title: string;
  from: string;

  caption: string;
  image: string;
  imgThumbnail?: string;


  likes: [string];


};

interface PostCardProps {
  post: UserPost | EventPost | TeamPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { caption, image, likes,imgThumbnail } = post;

  const name = 'name' in post ? post.name : '';
  const title = 'title' in post ? post.title : '';
  const projectProgress = 'projectProgress' in post ? post.projectProgress : 0;
  const isEventPost: boolean = 'isEventPost' in post ? (post as EventPost).isEventPost : false;
  const [liked, setLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    console.log('Shared!');
  };

  const handleComment = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentSubmit = () => {
    console.log('Comment:', comment);
    // Clear the comment box after submission
    setComment('');
    setShowCommentBox(false);
  };
  console.log(post);
  console.log("thumbnail",imgThumbnail)
  return (
    <div className="glass max-w-[600px] mx-auto p-6 rounded-lg shadow space-y-4 mb-4">

      {'user' in post &&
        <div className="flex items-start gap-5" onClick={() => redirect(`/profile?id=${post.createdBy.toString()}`)}>
          <img src={post.user.image} className='cursor-pointer w-12 h-12 rounded-full' />

          <div>
            <h2 onClick={() => redirect(`/profile?id=${post.createdBy.toString()}`)} className="font-semibold">{name ? name : title}</h2>
            {/**  <div className="flex items-center text-gray-500 space-x-1">
            <Clock size={16} />
            <span>{new Date(date).toLocaleString()}</span>
          </div>  */}
          </div>
        </div>}

      <p>{caption}</p>

      {image && (
        <div className="relative w-full flex justify-center">
        <div
  className="w-full h-70 overflow-hidden rounded-lg"
  style={{ backgroundImage: `url(${imgThumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <img
    src={image}
    alt="Post Image"
    className="w-full h-full object-cover"
    loading="lazy"
    onLoad={(e) => (e.target as HTMLImageElement).style.opacity = '1'}
    style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }} // Add transition for smooth loading
  />
</div>


        </div>
      )}

      {isEventPost && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Project Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${projectProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center pt-4 border-t">
        <button onClick={handleLike} className="flex items-center gap-2 text-gray-500 hover:text-red-500">
          <Heart size={20} fill={liked ? 'red' : 'none'} stroke={liked ? 'red' : 'currentColor'} />
        </button>
        {/**  <button onClick={handleComment} className="flex items-center gap-2 text-gray-500 hover:text-blue-500">
          <MessageCircle size={20} />
          <span>Comment</span>
        </button>
        <button onClick={handleShare} className="flex items-center gap-2 text-gray-500 hover:text-blue-500">
          <Share2 size={20} />
          <span>Share</span>
        </button>   */}
      </div>

      {showCommentBox && (
        <div className="pt-4">
          <textarea
            className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;