import React, { useState } from 'react';
import { Users, Clock, Heart, Share2, MessageCircle } from 'lucide-react';
import { EventPost } from '@/app/becommunity/page';
import { ObjectId } from 'mongoose';
import { UserPost } from '@/models/UserPost';
import { redirect } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

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
  from?: {
    _id: ObjectId;
    image: string;
  };
};



type TeamPost = {


  title: string;
  from: {
    _id: ObjectId;
    image: string;
  };

  caption: string;
  image: string;
  imgThumbnail?: string;


  likes: [string];


}

interface PostCardProps {
  post: UserPost | EventPost | TeamPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { caption, image, likes, imgThumbnail } = post;

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

  const {user}=useUser();
  const mongoId=user?.publicMetadata.mongoId;
  console.log(post);

  return (
    <div className="animate-slide-top glass max-w-[600px] mx-auto p-6 rounded-lg shadow space-y-4 mb-4">

      {'user' in post && <div>
        <div className="flex items-start gap-5" onClick={() => redirect(`/profile?id=${post.createdBy.toString()}`)}>
          <img src={post.user.image} className='cursor-pointer w-12 h-12 rounded-full' />

          <div>
            <h2 onClick={() => redirect(`/profile?id=${post.createdBy.toString()}`)} className="font-semibold">{name ? name : title}</h2>
            {/**  <div className="flex items-center text-gray-500 space-x-1">
            <Clock size={16} />
            <span>{new Date(date).toLocaleString()}</span>
          </div>  */}
          </div>
        </div>

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

              // style={{ display: 'none' }} // 

              onLoad={(e) => (e.target as HTMLImageElement).style.opacity = '1'}

              style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }} // Add transition for smooth loading
            />
          </div>


        </div>
       
      
      )  }
       </div>
      }


{'time' in post ? <div>
        <div className="flex items-start gap-5" onClick={() => redirect(`/event/${post?.from}?uid=${mongoId}`)}>
          <img src={post.eventImg?.image} className='cursor-pointer w-12 h-12 rounded-full' />

          <div>
            <h2 onClick={() => redirect(`/event/${post?.from}?uid=${mongoId}`)} className="font-semibold">{post.title}</h2>
            {/**  <div className="flex items-center text-gray-500 space-x-1">
            <Clock size={16} />
            <span>{new Date(date).toLocaleString()}</span>
          </div>  */}
          </div>
        </div>

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

              // style={{ display: 'none' }} // 

              onLoad={(e) => (e.target as HTMLImageElement).style.opacity = '1'}

              style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }} // Add transition for smooth loading
            />
          </div>


        </div>
       
      
      )  }
       </div> : 

<div>
<div className="flex items-start gap-5" onClick={() => redirect(`/team/${post?.from?.toString()}?id=${post?.from?.toString()}`)}>
  <img src={"jbwbu"} className='cursor-pointer w-12 h-12 rounded-full' />

  <div>
    <h2 onClick={() => redirect(`/team/${post?.from?.toString()}?id=${post?.from?.toString()}`)} className="font-semibold">{'title' in post ? post.title : ''}</h2>
    {/**  <div className="flex items-center text-gray-500 space-x-1">
    <Clock size={16} />
    <span>{new Date(date).toLocaleString()}</span>
  </div>  */}
  </div>
</div>

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

      // style={{ display: 'none' }} // 

      onLoad={(e) => (e.target as HTMLImageElement).style.opacity = '1'}

      style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }} // Add transition for smooth loading
    />
  </div>


</div>


)  }
</div>

      }

           </div>
  );
};

export default PostCard;