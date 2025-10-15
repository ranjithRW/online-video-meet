import { useEffect, useRef, useState } from 'react';
import { Participant, Track, LocalParticipant } from 'livekit-client';
import { Mic, MicOff, User } from 'lucide-react';

interface ParticipantVideoProps {
  participant: Participant;
  isLocal?: boolean;
}

export const ParticipantVideo = ({ participant, isLocal = false }: ParticipantVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const handleTrackSubscribed = (track: any) => {
      if (track.kind === Track.Kind.Video && videoRef.current) {
        track.attach(videoRef.current);
        setHasVideo(true);
      } else if (track.kind === Track.Kind.Audio && audioRef.current && !isLocal) {
        track.attach(audioRef.current);
      }
    };

    const handleTrackUnsubscribed = (track: any) => {
      if (track.kind === Track.Kind.Video) {
        track.detach();
        setHasVideo(false);
      } else if (track.kind === Track.Kind.Audio) {
        track.detach();
      }
    };

    const handleTrackMuted = (publication: any) => {
      if (publication.kind === Track.Kind.Audio) {
        setIsMuted(true);
      } else if (publication.kind === Track.Kind.Video) {
        setHasVideo(false);
      }
    };

    const handleTrackUnmuted = (publication: any) => {
      if (publication.kind === Track.Kind.Audio) {
        setIsMuted(false);
      } else if (publication.kind === Track.Kind.Video) {
        setHasVideo(true);
      }
    };

    const handleIsSpeakingChanged = (speaking: boolean) => {
      setIsSpeaking(speaking);
    };

    participant.videoTrackPublications.forEach((publication) => {
      if (publication.track) {
        handleTrackSubscribed(publication.track);
      }
      setHasVideo(!publication.isMuted);
    });

    participant.audioTrackPublications.forEach((publication) => {
      if (publication.track) {
        handleTrackSubscribed(publication.track);
      }
      setIsMuted(publication.isMuted);
    });

    participant.on('trackSubscribed', handleTrackSubscribed);
    participant.on('trackUnsubscribed', handleTrackUnsubscribed);
    participant.on('trackMuted', handleTrackMuted);
    participant.on('trackUnmuted', handleTrackUnmuted);
    participant.on('isSpeakingChanged', handleIsSpeakingChanged);

    // Handle local participant publish/unpublish so local camera shows in tile
    if (participant instanceof LocalParticipant) {
      const handleLocalTrackPublished = (publication: any) => {
        if (publication?.track && publication.kind === Track.Kind.Video && videoRef.current) {
          publication.track.attach(videoRef.current);
          setHasVideo(true);
        }
        if (publication?.kind === Track.Kind.Audio) {
          setIsMuted(false);
        }
      };

      const handleLocalTrackUnpublished = (publication: any) => {
        if (publication?.track && publication.kind === Track.Kind.Video) {
          publication.track.detach();
          setHasVideo(false);
        }
        if (publication?.kind === Track.Kind.Audio) {
          setIsMuted(true);
        }
      };

      participant.on('localTrackPublished', handleLocalTrackPublished);
      participant.on('localTrackUnpublished', handleLocalTrackUnpublished);

      // Cleanup for local participant listeners
      return () => {
        participant.off('trackSubscribed', handleTrackSubscribed);
        participant.off('trackUnsubscribed', handleTrackUnsubscribed);
        participant.off('trackMuted', handleTrackMuted);
        participant.off('trackUnmuted', handleTrackUnmuted);
        participant.off('isSpeakingChanged', handleIsSpeakingChanged);
        participant.off('localTrackPublished', handleLocalTrackPublished);
        participant.off('localTrackUnpublished', handleLocalTrackUnpublished);

        participant.videoTrackPublications.forEach((publication) => {
          if (publication.track) {
            publication.track.detach();
          }
        });

        participant.audioTrackPublications.forEach((publication) => {
          if (publication.track) {
            publication.track.detach();
          }
        });
      };
    }

    return () => {
      participant.off('trackSubscribed', handleTrackSubscribed);
      participant.off('trackUnsubscribed', handleTrackUnsubscribed);
      participant.off('trackMuted', handleTrackMuted);
      participant.off('trackUnmuted', handleTrackUnmuted);
      participant.off('isSpeakingChanged', handleIsSpeakingChanged);

      participant.videoTrackPublications.forEach((publication) => {
        if (publication.track) {
          publication.track.detach();
        }
      });

      participant.audioTrackPublications.forEach((publication) => {
        if (publication.track) {
          publication.track.detach();
        }
      });
    };
  }, [participant, isLocal]);

  const participantName = participant.name || participant.identity;

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${hasVideo ? 'block' : 'hidden'}`}
      />
      <audio ref={audioRef} autoPlay playsInline />

      {!hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>
      )}

      <div
        className={`absolute inset-0 border-2 rounded-lg transition-all ${
          isSpeaking ? 'border-green-500' : 'border-transparent'
        }`}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium truncate">
            {participantName} {isLocal && '(You)'}
          </span>
          {/* <div className="flex items-center gap-2">
            {isMuted ? (
              <div className="bg-red-500 rounded-full p-1.5">
                <MicOff className="w-3.5 h-3.5 text-white" />
              </div>
            ) : (
              <div className="bg-gray-700/80 rounded-full p-1.5">
                <Mic className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};
