"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const Agent = ({ userName, userId, type }: AgentProps) => {
  const isSpeaking = true;
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

  const messages = [
    "Whats your name?",
    "my name is john doe, nice to meet you!",
  ];

  const lastMessage = messages[messages.length - 1];

  return (
    <>
      <div className="flex sm:flex-row flex-col gap-10 items-center justify-between w-full">
        <div className="flex-center flex-col gap-2 p-7 h-[400px] blue-gradient-dark rounded-lg border-2 border-primary-200/50 flex-1 sm:basis-1/2 w-full">
          <div className="z-10 flex items-center justify-center blue-gradient rounded-full size-[120px] relative">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && (
              <span className="absolute inline-flex size-5/6 animate-ping rounded-full bg-primary-200 opacity-75" />
            )}
          </div>
          <h2 className="text-white text-xl font-semibold mt-4">
            AI Interviewer
          </h2>
        </div>
        <div className="border-gradient p-0.5 rounded-2xl flex-1 sm:basis-1/2 w-full h-[400px] max-md:hidden">
          <div className="flex flex-col gap-2 justify-center items-center p-7 dark-gradient rounded-2xl min-h-full">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h2 className="text-white text-xl font-semibold mt-4">
              {userName}
            </h2>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
              key={lastMessage}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center ">
        {callStatus !== "ACTIVE" ? (
          <button className="relative inline-block px-7 py-3 font-bold text-sm leading-5 text-white transition-colors duration-150 bg-success-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-success-200 hover:bg-success-200 min-w-28 cursor-pointer items-center justify-center overflow-visible">
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="inline-block px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-destructive-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-destructive-200 hover:bg-destructive-200 min-w-28">
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
