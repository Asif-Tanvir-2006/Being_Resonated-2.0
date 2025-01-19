'use client'

import SimPeopleWithSuspense from "@/components/commonPeople/SimPeople"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { ObjectId } from 'mongodb';
import Downbar from "@/components/Downbar/Downbar";
import EventCard from "@/components/eventCard/EventCard";
import PostCard from "@/components/eventCard/PostCard";
import { UserPost } from "@/components/eventCard/PostCard";


export interface EventPost {
  _id?: ObjectId; // Optional, generated by MongoDB
  title: string;
  caption?: string;
  image: string;
  likes?: number; // Default value is 0
  location: string;
  date: Date;
  time: string;
  createdBy: ObjectId;
  createdAt?: Date; // Managed by mongoose timestamps
  updatedAt?: Date; // Managed by mongoose timestamps

  
  
  from:string;


  

  isEventPost: boolean;
  projectProgress: number;
 
}




const BeCommunity = () => {

  const [eventPosts,setEventPosts]=useState<EventPost[]>([]);

  const [userPosts,setUserPosts]=useState<UserPost[]>([]);


  const {user,isLoaded}=useUser();
  useEffect(() => {
    if(!isLoaded || typeof window === "undefined"){
      return;
    }
    const fetchPosts=async()=>{
      const eventRes=await fetch("/api/eventpost",{method:"GET"});
        const userRes=await fetch("/api/userpost",{method:"GET"})

      const eventData:[]=await eventRes.json();
      const userData:[]=await userRes.json();

      console.log("eventdata",eventData)
      setEventPosts(eventData);
      
      console.log("Userpostdata",userData)
      setUserPosts(userData);
    }
    fetchPosts();
    
  }, [isLoaded]);


  console.log("eventposts",eventPosts)
  return (
    <div className="w-[100vw] h-auto relative">
           <div className="absolute left-[5%] right-[75%] top-5  h-[60vh]  bg-[#484444] rounded-2xl overflow-y-scroll ">
            <h1>Upcoming Events</h1>
            <EventCard />
           </div>

            <div className="absolute left-[28%] right-[28%] top-5 h-auto gap-1  bg-[#484444] rounded-2xl">
              <h1>Community Posts</h1> 

              <div className="">

               {eventPosts.map((eventPost)=>(
                <div className="" key={eventPost._id?.toString()}>
                  <PostCard  post={eventPost}/>
                </div>
                
               ))}

{userPosts.map((userPost)=>(
                <div className="" key={userPost._id?.toString()}>
                  <PostCard  post={userPost}/>
                </div>
                
               ))}

        
                
              </div>

              </div>

              <div className="absolute left-[75%] right-[5%] overflow-y-scroll top-5 h-[70vh] bg-[#484444] rounded-2xl">
            <SimPeopleWithSuspense/>

              </div>
              <Downbar/>
    </div>
  )
}

export default BeCommunity