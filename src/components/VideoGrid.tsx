import { Participant } from 'livekit-client';
import { ParticipantVideo } from './ParticipantVideo';

interface VideoGridProps {
  participants: Participant[];
  localParticipant?: Participant;
}

export const VideoGrid = ({ participants, localParticipant }: VideoGridProps) => {
  const getGridClass = () => {
    const count = participants.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2 grid-rows-2';
    if (count <= 6) return 'grid-cols-3 grid-rows-2';
    if (count <= 9) return 'grid-cols-3 grid-rows-3';
    return 'grid-cols-4';
  };

  // Ensure localParticipant is always shown as the first tile if present
  const allParticipants = localParticipant
    ? [localParticipant, ...participants.filter((p) => p.identity !== localParticipant.identity)]
    : participants;

  return (
    <div className="flex-1 bg-gray-950 p-4 overflow-auto">
      <div className={`grid ${getGridClass()} gap-4 h-full auto-rows-fr`}>
        {allParticipants.map((participant) => (
          <div key={participant.identity} className="min-h-[200px] pb-20">
            <ParticipantVideo
              participant={participant}
              isLocal={localParticipant?.identity === participant.identity}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
