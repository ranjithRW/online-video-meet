import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Settings,
  Users,
  MessageSquare,
  MoreVertical,
  Maximize,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ControlBarProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  participantCount: number;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onLeaveCall: () => void;
}

export const ControlBar = ({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  participantCount,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onLeaveCall,
}: ControlBarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isVideoEnabled && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch(() => {
          if (videoRef.current) videoRef.current.srcObject = null;
        });
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoEnabled]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
          {/* Left section (recording + preview) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* <div className="text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Recording</span>
            </div>
            <div className="text-gray-300 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg">
              00:24:15
            </div> */}

            {/* Local video preview */}
            <div className="ml-2 sm:ml-4">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-700 bg-black"
                style={{ display: isVideoEnabled ? 'block' : 'none' }}
              />
            </div>
          </div>

          {/* Center controls */}
          <div className="flex flex-wrap justify-center sm:justify-center items-center gap-2 sm:gap-3">
            {/* Audio toggle */}
            <button
              onClick={onToggleAudio}
              className={`group relative p-3 sm:p-4 rounded-full transition-all duration-200 ${
                isAudioEnabled
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              title={isAudioEnabled ? 'Mute' : 'Unmute'}
            >
              {isAudioEnabled ? (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </button>

            {/* Video toggle */}
            <button
              onClick={onToggleVideo}
              className={`group relative p-3 sm:p-4 rounded-full transition-all duration-200 ${
                isVideoEnabled
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              title={isVideoEnabled ? 'Stop video' : 'Start video'}
            >
              {isVideoEnabled ? (
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <VideoOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </button>

            {/* Screen share */}
            <button
              onClick={onToggleScreenShare}
              className={`group relative p-3 sm:p-4 rounded-full transition-all duration-200 ${
                isScreenSharing
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              {isScreenSharing ? (
                <MonitorOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </button>

            {/* Participants */}
            <button
              className="group relative p-3 sm:p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Participants"
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              {participantCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-medium">
                  {participantCount}
                </span>
              )}
            </button>

            {/* Chat */}
            <button
              onClick={onToggleChat}
              className="group relative p-3 sm:p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Chat"
            >
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Full screen */}
            {/* <button
              className="group relative p-3 sm:p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Full screen"
            >
              <Maximize className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button> */}

            {/* Leave call */}
            <button
              onClick={onLeaveCall}
              className="group relative p-3 sm:p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200"
              title="Leave call"
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>

          {/* Right side (settings + more) */}
          <div className="flex justify-center sm:justify-end items-center gap-2">
            {/* <button
              className="group relative p-2.5 sm:p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
            <button
              className="group relative p-2.5 sm:p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="More options"
            >
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
