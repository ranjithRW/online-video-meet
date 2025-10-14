import { useState } from 'react';
import { VideoConference } from './components/VideoConference';
import { JoinRoom } from './components/JoinRoom';
import { generateMockToken } from './utils/livekit';

function App() {
  const [token, setToken] = useState<string>('');
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string>('');

  const handleJoinRoom = async (name: string, room: string) => {
    setIsJoining(true);
    setError('');

    try {
      const livekitUrl = import.meta.env.VITE_LIVEKIT_URL;
      const apiKey = import.meta.env.VITE_LIVEKIT_API_KEY;
      const apiSecret = import.meta.env.VITE_LIVEKIT_API_SECRET;

      if (!livekitUrl || !apiKey || !apiSecret) {
        setError('Missing LiveKit configuration');
        setIsJoining(false);
        return;
      }

      const generatedToken = await generateMockToken(
        `room-${room}`,
        name,
        apiKey,
        apiSecret
      );

      setToken(generatedToken);
      setRoomNumber(room);
      setUserName(name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
      console.error('Error joining room:', err);
    } finally {
      setIsJoining(false);
    }
  };

  if (isJoining) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-lg">Joining room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
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
            <h2 className="text-2xl font-bold text-white">Error</h2>
            <p className="text-gray-400">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return <JoinRoom onJoin={handleJoinRoom} />;
  }

  const livekitUrl = import.meta.env.VITE_LIVEKIT_URL;

  return <VideoConference url={livekitUrl} token={token} />;
}

export default App;
