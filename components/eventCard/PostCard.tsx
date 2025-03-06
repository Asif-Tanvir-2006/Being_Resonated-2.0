import React, { useEffect, useRef, useState } from 'react';
import { Users, Clock, Heart, Share2, MessageCircle } from 'lucide-react';
import { CiMenuKebab } from "react-icons/ci"
import { EventPost } from '@/app/becommunity/page';


import { UserPost } from '@/models/UserPost';
import { redirect } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import parse from "html-react-parser";
import { toast } from 'react-toastify';
import { ObjectId } from 'mongoose';
import { TeamPost } from '@/models/TeamPost';
import { FaHeart } from "react-icons/fa";
import { AnimatedTooltip } from '../ui/animated-tooltip';

export type UserPost = {
  _id?: ObjectId; // Optional, generated by MongoDB
  createdBy: ObjectId;
  createdAt?: Date; // Managed by mongoose timestamps
  updatedAt?: Date; // Managed by mongoose timestamps
  caption: string;
  image: string;
  vid:boolean;
  imgThumbnail?: string;
  name: string;
  user: {
    name: string,
    image: string
  }
  date: string;
  likes:  {
      image?: string;
      _id: ObjectId;
      name: string;
    }[];
  isEventPostPost: boolean;
  projectProgress: number;
  from?: {
    _id: ObjectId;
    image: string;
  };
};



type TeamPost = {

_id:ObjectId
  title: string;
  from: string;
  team:{
    image: string;
    _id: string;
    leaders:ObjectId[]
  }

  caption: string;
  image: string;
  imgThumbnail?: string;
 


  likes:  {
    image?: string;
    _id: ObjectId;
    name: string;
  }[];

}

interface PostCardProps {
  post: UserPost | EventPost | TeamPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { caption, image, likes, imgThumbnail } = post;

  const name = 'name' in post ? post.name : '';
  const title = 'title' in post ? post.title : '';
const createdBy='createdBy' in post?post.createdBy:undefined;



  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');

  const [isOverflowing, setIsOverflowing] = useState<boolean>(true);
  const textRef = useRef(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const renderContent = (content: string) => {
    const modifiedHtml = content.replace(/<p><\/p>/g, '<p>&nbsp;</p>');
    return parse(modifiedHtml);
  }

  useEffect(() => {
    if (textRef.current) {
      const { scrollHeight, clientHeight } = textRef.current;
      setIsOverflowing(scrollHeight > clientHeight); // If true, show "Read More"
    }
  }, [textRef.current]);



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

  const { user } = useUser();
  const mongoId = user?.publicMetadata.mongoId;
  const [modal,setModal]=useState<boolean>(false);

  const [userPostOwner,setUserPostOwner]=useState<boolean>(false);
  const [teamPostOwner,setTeamPostOwner]=useState<boolean>(false);

  const [teamLeaders,setTeamLeaders]=useState<ObjectId[]>([])
  const [postLikeCount, setPostLikeCount] = useState<number>(0);

  useEffect(() => {
    if (post) {
      if ( 'eventImg' in post) {
         setTeamLeaders(post.eventImg.leaders || []);
      } else if ('team' in post) {
        setTeamLeaders(post.team.leaders || []);
      }

      if ('user' in post) {
        setUserPostOwner(createdBy === mongoId);
      } else if (teamLeaders.length > 0) {
        const isLeader = teamLeaders.some((leader) => leader.toString() === mongoId);
        if (isLeader) {
          setTeamPostOwner(true);
        }
      }

      //post likes
      if(post.likes){
        setPostLikeCount(post.likes.length);
        const isLiked = post?.likes.some((like) => like?._id?.toString() === mongoId);
        setIsLiked(isLiked);
      }


    }
  }, [post]);

  


  const userPostDeleteHandler=(id:string)=>{
    console.log(id,"postId")
    const del=async ()=>{
     const res=await fetch(`/api/userpost?id=${id}`,{ 

      method:"DELETE",
      

     })
     if(res.ok){
      toast.success("Post deleted Successfully")
    
     }
    }
    del();
  }

  const teamPostDeleteHandler=(id:string)=>{
   
    const del=async ()=>{
     const res=await fetch(`/api/teampost?id=${id}`,{ 

      method:"DELETE",
      

     })
     if(res.ok){
      toast.success("Post deleted Successfully")
    
     }
    }
    del();
  }

  const eventPostDeleteHandler=(id:string)=>{
    
    const del=async ()=>{
     const res=await fetch(`/api/eventpost?id=${id}`,{ 

      method:"DELETE",
      

     })
     if(res.ok){
      toast.success("Post deleted Successfully")
    
     }
    }
    if(createdBy)del();
  }

  const handleLikeClick =()=>{
    if (isLiked) {
      setIsLiked(false);
      setPostLikeCount(postLikeCount-1);
      const updatedLikes = post?.likes?.filter((like) => like._id.toString() !== mongoId);
      post.likes = updatedLikes || [];
      const fetchedLikes = updatedLikes?.map((like) => like._id.toString()) || [];
      handleLikeFetching(fetchedLikes);
      
    
  }
    else {

      setIsLiked(true);
      setPostLikeCount(postLikeCount+1);
      const newlike={_id: mongoId as ObjectId , name: user?.username as string,image:user?.imageUrl as string};
      const updatedLikes =post?.likes? [...post.likes,newlike]:[newlike];
      post.likes = updatedLikes ;
      const fetchedLikes = updatedLikes?.map((like) => like._id.toString()) || [];
      handleLikeFetching(fetchedLikes);
    
    }
  }

  const handleLikeFetching = async (updatedLikes:string[]) => {
    if('user' in post){
      fetch(`/api/userpost?id=${post._id}`, {
        method: 'PUT',
        body: JSON.stringify({ likes: updatedLikes }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }else if('time' in post){
      fetch(`/api/eventpost?id=${post._id}`, {
        method: 'PUT',
        body: JSON.stringify({ likes: updatedLikes }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }else{
      fetch(`/api/teampost?id=${post._id}`, {
        method: 'PUT',
        body: JSON.stringify({likes: updatedLikes}),
        headers: {
          'Content-Type': 'application/json',
        },
    })
  }
}

  return (
    <div className="animate-slide-top glass max-w-[600px] mx-auto p-6 rounded-lg shadow space-y-4 mb-4">

      {'user' in post ? <div>
        <div className="border-b-2 mx-1 border-gray-600 pb-4 flex flex-row items-start justify-normal gap-5" >
          <img src={post.user.image} className='cursor-pointer w-10 h-10 rounded-full' onClick={() => redirect(`/profile?id=${post.createdBy.toString()}`)}/>

          <div className='flex flex-row justify-between items-center w-[80%]'>
            <button onClick={() => redirect(`/profile?id=${post.createdBy.toString()}`)} className="text-green-300 cursor-pointer font-semibold capitalize" >{name ? name : title}</button>
         {userPostOwner &&  <div className="flex items-center text-gray-500 space-x-1 ml-10" onClick={()=>setModal(!modal)}>
           <CiMenuKebab />
           {
            modal && <div className="fixed top-[10%]   w-[40%]">
              <button onClick={()=>{
                console.log("clicked");
             if(post._id)userPostDeleteHandler(post._id.toString());
                
                }} className='bg-red-500 rounded-lg text-white px-4 py-2'>Delete</button>
               
            </div>
           }
          </div>  }
          </div>
        </div>

        {caption !== undefined ? <div ref={textRef} className={`${isOverflowing ? "line-clamp-3" : ""} relative px-1 py-5 overflow-hidden`}>
          {renderContent(caption)}
        </div> : null}
        {isOverflowing && <div onClick={() => setIsOverflowing(false)} className='text-blue text-center text-blue-500 cursor-pointer hover:text-blue-400 mt-2 mb-2'>Read More</div>}



        {image && (
          <div className="relative w-full flex justify-center">
            <div
              className="w-full h-70 overflow-hidden rounded-lg"
              style={{ backgroundImage: `url(${imgThumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {post.vid?
               <div className="flex justify-center items-center">
               <div className="relative w-full max-w-3xl aspect-video">
                 <video className="w-full h-full object-cover rounded-lg shadow-lg" controls>
                   <source src={image} type="video/mp4" />
                   Your browser does not support the video tag.
                 </video>
               </div>
             </div>
              :
              <img
              src={image}
              alt="Post Image"
              className="w-full h-full object-cover"
              loading="lazy"
              onLoad={(e) => (e.target as HTMLImageElement).style.opacity = '1'}

              style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }} // Add transition for smooth loading
            />
              

            }
              
            </div>


          </div>


        )}
      </div>
        :


        'time' in post ? <div>
          <div className="border-b-2 mx-1 border-gray-600 pb-4 flex flex-row items-start justify-normal gap-5" >
            <img src={post.eventImg?.image} className='cursor-pointer w-10 h-10 rounded-full' onClick={() => redirect(`/event/${post?.from}?uid=${mongoId}`)}/>

            <div className='flex flex-row justify-between items-center w-[80%]'>
              <button onClick={() => redirect(`/event/${post?.from}?uid=${mongoId}`)} className="text-purple-300 cursor-pointer font-semibold">{post.title}</button>
             {teamPostOwner &&  <div className="flex items-center text-gray-500 space-x-1" onClick={()=>setModal(!modal)}>
               <CiMenuKebab />
           {
            modal && <div className="fixed top-[10%]   w-[40%]">
              <button onClick={()=>{
               
             if(post._id)eventPostDeleteHandler(post._id.toString());
                
                }} className='bg-red-500 rounded-lg text-white px-4 py-2'>Delete</button>
               
            </div>
           }
            
          </div>  }
            </div>
          </div>

          {caption !== undefined ? <div ref={textRef} className={`${isOverflowing ? "line-clamp-3" : ""} relative px-1 py-5 overflow-hidden`}>
            {renderContent(caption)}
          </div> : null}
          {isOverflowing && <div onClick={() => setIsOverflowing(false)} className='text-blue text-center text-blue-500 cursor-pointer hover:text-blue-400 mt-2 mb-2'>Read More</div>}


          {image && (
            <div className="relative w-full flex justify-center">
              <div
                className="w-full h-70 overflow-hidden rounded-lg"
                style={{ backgroundImage: `url(${imgThumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
           {post.vid?  <div className="flex justify-center items-center">
  <div className="relative w-full max-w-3xl aspect-video">
    <video className="w-full h-full object-cover rounded-lg shadow-lg" controls>
      <source src={image} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</div>

   : 
   <img
                  src={image}
                  alt="Post Image"
                  className="w-full h-full object-cover"
                  loading="lazy"

                  // style={{ display: 'none' }} // 

                  onLoad={(e) => (e.target as HTMLImageElement).style.opacity = '1'}

                  style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }} // Add transition for smooth loading
                />}

                  

              </div>


            </div>


          )}
        </div> :

          <div>
            <div className="border-b-2 mx-1 border-gray-600 pb-4 flex flex-row items-start justify-normal gap-5" >
              <img src={post?.team?.image} className='cursor-pointer w-10 h-10 rounded-full' onClick={() => redirect(`/team/${post?.from?.toString()}?id=${post?.from?.toString()}`)}/>

              <div className='flex flex-row justify-between items-center w-[80%]'>
                <button onClick={() => redirect(`/team/${post?.from?.toString()}?id=${post?.from?.toString()}`)} className="text-yellow-300 cursor-pointer font-semibold">{'title' in post ? post.title : ''}</button>

             {teamPostOwner &&   <div className="flex items-center text-gray-500 space-x-1" onClick={()=>setModal(!modal)}>
                <CiMenuKebab />
           {
            modal && <div className="fixed top-[10%]   w-[40%]">
              <button onClick={()=>{
              
             if(post._id)teamPostDeleteHandler(post._id.toString());
                
                }} className='bg-red-500 rounded-lg text-white px-4 py-2'>Delete</button>
               
            </div>
           }
    
  </div>}
              </div>
            </div>

            {caption !== undefined ? <div ref={textRef} className={`${isOverflowing ? "line-clamp-3" : ""} relative px-1 py-5 overflow-hidden`}>
              {renderContent(caption)}
            </div> : null}
            {isOverflowing && <div onClick={() => setIsOverflowing(false)} className='text-blue text-center text-blue-500 cursor-pointer hover:text-blue-400 mt-2 mb-2'>Read More</div>}


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


            )}
          </div>
          
      }

      <div className='border-t-2 border-gray-600 pt-3 flex items-center gap-2'>
        <FaHeart className={`${isLiked ? "fill-[#40acbf]" : "fill-[#5b6a76]"} h-8 w-8 cursor-pointer text-2xl`} onClick={handleLikeClick}></FaHeart>
        <span className='mt-[-1px] text-gray-400'>{postLikeCount}</span> 

        <AnimatedTooltip items={post?.likes?.map((like, index) => ({
          id: index,
          name: like.name,
          image: like.image || ''
        })) || []} />
      </div>

    </div>
  );
};

export default PostCard;