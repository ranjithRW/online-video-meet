import { useVideoRoom } from '../hooks/useVideoRoom';
import { VideoGrid } from './VideoGrid';
import { ControlBar } from './ControlBar';
import { Loader2 } from 'lucide-react';

interface VideoConferenceProps {
  url: string;
  token: string;
}

export const VideoConference = ({ url, token }: VideoConferenceProps) => {
  const {
    room,
    participants,
    isConnecting,
    isConnected,
    error,
    localAudioEnabled,
    localVideoEnabled,
    isScreenSharing,
    connectToRoom,
    disconnectFromRoom,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  } = useVideoRoom(url, token);

  if (!isConnected && !isConnecting && !error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Ready to join?</h1>
            <p className="text-gray-400">Join the video conference room</p>
          </div>
          <button
            onClick={connectToRoom}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Join Meeting
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Connection Error</h2>
            <p className="text-gray-400">{error}</p>
          </div>
          <button
            onClick={connectToRoom}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="text-white text-lg">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-semibold">Video Conference</h2>
                <p className="text-gray-400 text-sm">{participants.length} participants</p>
              </div>
            </div>
          </div>
        </div>

        <VideoGrid participants={participants} localParticipant={room?.localParticipant} />
      </div>

      <ControlBar
        isAudioEnabled={localAudioEnabled}
        isVideoEnabled={localVideoEnabled}
        isScreenSharing={isScreenSharing}
        participantCount={participants.length}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onLeaveCall={disconnectFromRoom}
      />
    </div>
  );
};
