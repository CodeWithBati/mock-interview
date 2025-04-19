"use client";

import { interviewer } from "@/constants";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const Agent = ({
  userName,
  userId,
  type,
  questions,
  interviewId,
}: AgentProps) => {
  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  // const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.log("error: ", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    try {
      const { success, id } = {
        success: true,
        id: "feedback-id",
      };

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("error on saving");
        router.push("/");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push(`/`);
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, userId, type]);

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);

      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            username: userName,
            userid: userId,
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      setCallStatus(CallStatus.FINISHED);
      vapi.stop();
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const lastestMessage = messages[messages.length - 1]?.content;

  const isCallFinishedOrInActive =
    callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE;

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
              key={lastestMessage}
            >
              {lastestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center ">
        {callStatus !== "ACTIVE" ? (
          <button
            className="relative inline-block px-7 py-3 font-bold text-sm leading-5 text-white transition-colors duration-150 bg-success-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-success-200 hover:bg-success-200 min-w-28 cursor-pointer items-center justify-center overflow-visible"
            onClick={handleCall}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {isCallFinishedOrInActive ? "Call" : ". . ."}
            </span>
          </button>
        ) : (
          <button
            className="inline-block px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-destructive-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-destructive-200 hover:bg-destructive-200 min-w-28"
            onClick={handleDisconnect}
          >
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
