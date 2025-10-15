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
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-white text-sm font-medium px-3 py-2 bg-gray-800 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Recording</span>
            </div>
            <div className="text-gray-300 text-sm px-3 py-2 bg-gray-800 rounded-lg">
              00:24:15
            </div>
            {/* Local video preview */}
            <div className="ml-4">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-16 h-16 rounded-lg object-cover border border-gray-700 bg-black"
                style={{ display: isVideoEnabled ? 'block' : 'none' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleAudio}
              className={`group relative p-4 rounded-full transition-all duration-200 ${
                isAudioEnabled
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              title={isAudioEnabled ? 'Mute' : 'Unmute'}
            >
              {isAudioEnabled ? (
                <Mic className="w-6 h-6 text-white" />
              ) : (
                <MicOff className="w-6 h-6 text-white" />
              )}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isAudioEnabled ? 'Mute' : 'Unmute'}
              </span>
            </button>

            <button
              onClick={onToggleVideo}
              className={`group relative p-4 rounded-full transition-all duration-200 ${
                isVideoEnabled
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              title={isVideoEnabled ? 'Stop video' : 'Start video'}
            >
              {isVideoEnabled ? (
                <Video className="w-6 h-6 text-white" />
              ) : (
                <VideoOff className="w-6 h-6 text-white" />
              )}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isVideoEnabled ? 'Stop video' : 'Start video'}
              </span>
            </button>

            <button
              onClick={onToggleScreenShare}
              className={`group relative p-4 rounded-full transition-all duration-200 ${
                isScreenSharing
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              {isScreenSharing ? (
                <MonitorOff className="w-6 h-6 text-white" />
              ) : (
                <Monitor className="w-6 h-6 text-white" />
              )}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isScreenSharing ? 'Stop sharing' : 'Share screen'}
              </span>
            </button>

            <div className="w-px h-8 bg-gray-700 mx-1"></div>

            <button
              className="group relative p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Participants"
            >
              <Users className="w-6 h-6 text-white" />
              {participantCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {participantCount}
                </span>
              )}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Participants
              </span>
            </button>

            <button
              onClick={onToggleChat}
              className="group relative p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Chat"
            >
              <MessageSquare className="w-6 h-6 text-white" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Chat
              </span>
            </button>

            <button
              className="group relative p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Full screen"
            >
              <Maximize className="w-6 h-6 text-white" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Full screen
              </span>
            </button>

            <div className="w-px h-8 bg-gray-700 mx-1"></div>

            <button
              onClick={onLeaveCall}
              className="group relative p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200"
              title="Leave call"
            >
              <PhoneOff className="w-6 h-6 text-white" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Leave call
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="group relative p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-white" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Settings
              </span>
            </button>
            <button
              className="group relative p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200"
              title="More options"
            >
              <MoreVertical className="w-5 h-5 text-white" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                More
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
