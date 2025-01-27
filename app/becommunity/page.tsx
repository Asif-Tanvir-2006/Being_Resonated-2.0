'use client'

import SimPeopleWithSuspense from "@/components/commonPeople/SimPeople"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { ObjectId } from 'mongodb';
import Downbar from "@/components/Downbar/Downbar";
import EventCard from "@/components/eventCard/EventCard";
import PostCard from "@/components/eventCard/PostCard";
import { UserPost } from "@/components/eventCard/PostCard";
;
import SubHeader from "@/components/SubHeader/SubHeader"
import "./becommunity.css";
import { IoIosSend } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import { useEdgeStore } from "@/lib/edgestore";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SingleImageDropzone } from "@/components/singledropZone/SingleImageDropZone";
import { Divide } from "lucide-react";


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
  from: string;
  isEventPost: boolean;
  projectProgress: number;

}

const BeCommunity = () => {

  const [eventPosts, setEventPosts] = useState<EventPost[]>([]);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [render, setRender] = useState<"posts" | "events" | "users">("posts");

  const { user, isLoaded } = useUser();
  const mongoId = user?.publicMetadata?.mongoId
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") {
      return;
    }
    const fetchPosts = async () => {
      const eventRes = await fetch("/api/eventpost", { method: "GET" });
      const userRes = await fetch("/api/userpost", { method: "GET" })

      const eventData: [] = await eventRes.json();
      const userData: [] = await userRes.json();

      console.log("eventdata", eventData)
      setEventPosts(eventData);

      console.log("Userpostdata", userData)
      setUserPosts(userData);
    }
    fetchPosts();

  }, [isLoaded]);

  useEffect(() => {
    const finalPosts = [...eventPosts, ...userPosts];
    finalPosts.sort((a, b) => (a?.createdAt ?? 0) > (b?.createdAt ?? 0) ? -1 : 1);
  }, [])


  console.log("eventposts", eventPosts)
  return (<div className="bg relative min-h-screen border-2">

    <SubHeader />

    <div className="relative">

      <div className="cbecomn:hidden tabglass cphone:text-base cphone:gap-12 tabs mt-32 flex text-xl gap-20 border-2 w-fit mx-auto px-3 rounded-lg justify-center">

        <span onClick={() => setRender("events")} className={`${render === "events" ? "active" : ""} relative px-2 pt-3 pb-3 cursor-pointer tab`}>Events
          <div className="absolute anbd"></div>
        </span>
        <span onClick={() => setRender("posts")} className={`${render === "posts" ? "active" : ""}  relative px-2 pt-3 pb-3 cursor-pointer tab`}>Posts
          <div className="absolute anbd"></div>
        </span>
        <span onClick={() => setRender("users")} className={`${render === "users" ? "active" : ""}  relative px-2 pt-3 pb-3 cursor-pointer tab`}>Users
          <div className="absolute anbd"></div>
        </span>

      </div>




      <div className="cbecomn:mt-32 h-fit justify-between cbecom:justify-center flex gap-3 p-5 cphone:px-2">

        {render === "events" ? <div className="w-[500px] glass rounded-2xl h-fit min-w-[300px] mt-3 cbecomn:hidden">
          <h1 className="text-center p-3 text-cyan-200 font-semibold text-base">Upcoming Events</h1>
          <EventCard uId={mongoId as string} />
        </div> : null}

        <div className="glass rounded-2xl h-fit min-w-[300px] mt-3 cbecom:hidden">
          <h1 className="text-center p-3 text-cyan-200 font-semibold text-base">Upcoming Events</h1>
          <EventCard uId={mongoId as string} />
        </div>



        {render === "posts" ? <div className="posts mt-3 cbecomn:hidden">
          <div className="">
            <WhatsOnYourMind></WhatsOnYourMind>
            {eventPosts.map((eventPost) => (
              <div className="" key={eventPost._id?.toString()}>
                <PostCard post={eventPost} />
              </div>

            ))}
            {userPosts.map((userPost) => (
              <div className="" key={userPost._id?.toString()}>
                <PostCard post={userPost} />
              </div>
            ))}
          </div>
        </div> : null}

        <div className="posts mt-3 cbecom:hidden">
          <div className="">
            <WhatsOnYourMind></WhatsOnYourMind>
            {eventPosts.map((eventPost) => (
              <div className="" key={eventPost._id?.toString()}>
                <PostCard post={eventPost} />
              </div>

            ))}
            {userPosts.map((userPost) => (
              <div className="" key={userPost._id?.toString()}>
                <PostCard post={userPost} />
              </div>
            ))}
          </div>
        </div>






        {render === "users" ? <div>
          <div className="h-fit max-w-[400px] w-[400px] becomphone:w-full mt-3 glass rounded-2xl cbecomn:hidden">
            <SimPeopleWithSuspense />
          </div>
        </div> : null}

        <div className="h-fit min-w-[350px] mt-3 glass rounded-2xl cbecom:hidden">
          <SimPeopleWithSuspense />
        </div>

      </div>
    </div>

    <Downbar />
  </div>
  )
}

const WhatsOnYourMind = () => {
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const [caption, setCaption] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const { user, isLoaded } = useUser();
  const [mongoId, setMongoId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>("")

  useEffect(() => {
    if (user) {
      setMongoId(user.publicMetadata.mongoId as string)
      setUserName(user.fullName)
    }
  }, [isLoaded, user])

  const handlePost = () => {
    console.log("clicked");

    const post = async () => {
      if (file) {
        const response = await edgestore.mypublicImages.upload({
          file,
          onProgressChange: (progress) => {
            setProgress(progress);
          },
        });

        if (response.url) {
          const res = await fetch(`/api/userpost`, {
            method: "POST",
            body: JSON.stringify({ image: response.url, caption, createdBy: user?.publicMetadata.mongoId, name: userName }),
          })
          if (res.ok) {
            toast.success("Posted successfully")
          }
        }
      }
    }

    console.log("before");

    post();
    console.log("posted");
  }

  return (<div className="glass rounded-xl w-full p-4 max-w-[600px] mx-auto mb-10 h-fit flex flex-col gap-5">
    <textarea value={caption} onChange={(e: any) => setCaption(e.target.value)} placeholder="What's on your mind ?" className="placeholder:opacity-80 text-cyan-300 rounded-[2rem] py-3 px-4 w-full bg-transparent border-2 border-cyan-600"></textarea>
    <div className="flex justify-between p-2">
      <div className="flex">
        <Dialog>
          <DialogTrigger asChild>
            <FaImage className="cursor-pointer w-7 h-7 ml-2 fill-cyan-500 hover:fill-cyan-300"></FaImage>
          </DialogTrigger>
          <DialogContent className="bg-slate-950 opacity-75">
            <DialogTitle>Select Image</DialogTitle>
            <div className="flex justify-center">
              <SingleImageDropzone width={200}
                height={200}
                value={file}
                onChange={(file) => {
                  setFile(file);
                }}></SingleImageDropzone>
            </div>
          </DialogContent>
        </Dialog>

      </div>
      <button onClick={handlePost} className="hover:border-cyan-400 hover:text-cyan-200 p-2 w-fit flex gap-3 items-center self-end px-5 border-2 border-cyan-600 rounded-lg">
        <IoIosSend className="fill-cyan-600 mt-[1px]"></IoIosSend>
        <span className="text-cyan-400 text-lg">Post</span>
      </button>
    </div>

  </div >)
}


export default BeCommunity