'use client'

import SimPeopleWithSuspense from "@/components/commonPeople/SimPeople"

import { redirect } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

const BeCommunity = () => {
const {userId}=useAuth();
  if(!userId){
    redirect('/login');
 }
  return (
    <div className="w-[100vw] h-auto relative">
           <div className="absolute left-[10%] right-[10%] top-5  h-[15vh] w-[80%] bg-[#484444] rounded-2xl">
            <h1>Evnets and updates</h1>
           </div>

            <div className="absolute left-[10%] right-[40%] top-[20vh] h-[70vh]  bg-[#484444] rounded-2xl">
              <h1>Community Posts</h1> 
              </div>

              <div className="absolute left-[65%] right-[10%] overflow-y-scroll top-[20vh] h-[70vh] bg-[#484444] rounded-2xl">
            {/*  <SimPeopleWithSuspense/>
*/}
              </div>
    </div>
  )
}

export default BeCommunity