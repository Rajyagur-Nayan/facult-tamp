"use client";

import React, { useEffect, useState } from "react";
import { Mic, X } from "lucide-react";
import Vapi from "@vapi-ai/web";

// Initialize Vapi
export const vapi = new Vapi(process.env.NEXT_PUBLIC_WEB_TOKEN!);

export enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  CONNECTING = "CONNECTING",
}

interface AgentProps {
  userName?: string;
  userId?: string;
  type?: string;
}

const FacultyBot = ({}: AgentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error(error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      const workflowToken = process.env.NEXT_PUBLIC_WORKFLOW_TOKEN!;
      if (!workflowToken) {
        console.error("Workflow token is missing!");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      // Pass token as first argument, options as second
      await vapi.start(workflowToken, {});

      setCallStatus(CallStatus.ACTIVE);
    } catch (error) {
      console.error("Faculty workflow start failed:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleEndCall = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const isCallInactiveAndFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      {/* Floating Voice Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-transform transform hover:scale-110"
      >
        <Mic className="w-6 h-6" />
      </button>

      {/* Mini Voice Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-gray-900 text-white rounded-2xl shadow-2xl p-4 z-50 animate-in slide-in-from-bottom">
          {/* Header with close */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Faculty Bot</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Faculty Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-blue-400 relative flex items-center justify-center bg-blue-700">
              {isSpeaking && (
                <span className="absolute w-full h-full rounded-full animate-ping bg-blue-400 opacity-30" />
              )}
              <Mic className="w-8 h-8 text-white relative z-10" />
            </div>
            <p className="text-sm mt-2 opacity-70">
              {callStatus === "ACTIVE"
                ? "Speaking..."
                : "Ready to guide your learning"}
            </p>
          </div>

          {/* Call Controls */}
          <div className="flex justify-center">
            {callStatus !== CallStatus.ACTIVE ? (
              <button
                type="button"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow transition-transform hover:scale-105"
                onClick={handleCall}
              >
                {isCallInactiveAndFinished ? "Start Session" : "Connecting..."}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEndCall}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow transition-transform hover:scale-105"
              >
                End Session
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FacultyBot;
