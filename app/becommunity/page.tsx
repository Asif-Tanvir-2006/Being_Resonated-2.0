'use client'

import SimPeopleWithSuspense from "@/components/commonPeople/SimPeople"

import { useEffect, useState } from "react"
import { ObjectId } from 'mongodb';

import EventCard from "@/components/eventCard/EventCard";
import PostCard from "@/components/eventCard/PostCard";
import { UserPost } from "@/components/eventCard/PostCard";
;

import "./becommunity.css";

import Layout from "@/components/customLayouts/Layout";
import WhatsOnUserMind from "@/components/WhatsOnYourMInd/WhatsOnUserMind";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoadingAnimation from "@/components/loadingAnimation/loadingAnimation";


export interface EventPost {
  _id?: ObjectId; // Optional, generated by MongoDB
  title: string;
  caption?: string;
  image: string;
  eventImg: {
    image: string;
  };
  imgThumbnail?: string;
  likes?: number; // Default value is 0
  location: string;
  date: Date;
  time: string;
  createdBy: ObjectId;
  createdAt?: Date; // Managed by mongoose timestamps
  updatedAt?: Date; // Managed by mongoose timestamps
  from: ObjectId;
  isEventPost: boolean;
  projectProgress: number;

}

const BeCommunity = () => {

  const [eventPosts, setEventPosts] = useState<EventPost[]>([]);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [teamPosts, setTeamPosts] = useState<any[]>([]);
  const [render, setRender] = useState<"posts" | "events" | "users">("posts");


  const [finalPosts, setFinalPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const mongoId = searchParams.get("id")

  useEffect(() => {

    const fetchPosts = async () => {
      setPostsLoading(true);
      const eventRes = await fetch("/api/eventpost", { method: "GET" });
      const userRes = await fetch("/api/userpost", { method: "GET" })
      const teamRes = await fetch("/api/teampost", { method: "GET" })

      const eventData: [] = await eventRes.json();
      const userData: [] = await userRes.json();
      const teamData: [] = await teamRes.json()

      setEventPosts(eventData);

      setTeamPosts(teamData);

      setUserPosts(userData);

      setPostsLoading(false);
    }
    fetchPosts();

  }, []);

  useEffect(() => {
    if (!eventPosts || !userPosts) return;
    const finalPosts = [...eventPosts, ...userPosts, ...teamPosts];
    finalPosts.sort((a, b) => (a?.createdAt ?? 0) > (b?.createdAt ?? 0) ? -1 : 1);
    setFinalPosts(finalPosts);
  }, [eventPosts, userPosts])




  return (
    <Layout>
      <div className="bg bec relative min-h-screen">



        <div className="relative">

          <div className="cbecomn:hidden tabglass cphone:text-base cphone:gap-12 tabs  flex text-xl gap-20 border-2 w-fit mx-auto px-3 rounded-lg justify-center">

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




          <div className=" h-fit justify-between cbecom:justify-center flex gap-3 p-5 cphone:px-2">

            {render === "events" ? <div className="w-[500px] glass rounded-2xl h-fit min-w-[300px] mt-3 cbecomn:hidden">
              <h1 className="text-center p-3 text-cyan-200 font-semibold text-base">Upcoming Events</h1>
              <EventCard uId={mongoId as string} />
            </div> : null}

            <div className="glass rounded-2xl h-fit min-w-[300px] mt-3 cbecom:hidden">
              <h1 className="text-center p-3 text-cyan-200 font-semibold text-base">Upcoming Events</h1>
              <EventCard uId={mongoId as string} />
            </div>



            {render === "posts" ? <div className="posts w-full mt-3 cbecomn:hidden">
              <div className="">
                <WhatsOnUserMind></WhatsOnUserMind>
                {/**  eventPosts.map((eventPost) => (
                  <div className="" key={eventPost._id?.toString()}>
                    <PostCard post={eventPost} />
                  </div>

                ))  */}

                {postsLoading && <div>
                  <LoadingAnimation></LoadingAnimation>
                </div>}

                {finalPosts.map((post) => (
                  <div className="" key={post._id?.toString()}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </div> : null}

            <div className="posts mt-3 w-full cbecom:hidden">
              <div className="">
                <WhatsOnUserMind></WhatsOnUserMind>
                {/**eventPosts.map((eventPost) => (
                  <div className="" key={eventPost._id?.toString()}>
                    <PostCard post={eventPost} />
                  </div>

                ))*/}

                {postsLoading && <div>
                  <LoadingAnimation></LoadingAnimation>
                </div>}

                {finalPosts.map((userPost) => (
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


      </div>
    </Layout>
  )
}


const BeCommunityWithSuspense = () => (
  <Suspense fallback={<div>Loding</div>}> <BeCommunity /></Suspense>
)

export default BeCommunityWithSuspense;


