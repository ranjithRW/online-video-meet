import { useState, useEffect, useCallback } from 'react';
import {
  Room,
  RoomEvent,
  Track,
  RemoteTrack,
  RemoteTrackPublication,
  Participant,
  LocalParticipant,
  RemoteParticipant,
} from 'livekit-client';

export const useVideoRoom = (url: string, token: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const connectToRoom = useCallback(async () => {
    if (!url || !token) {
      setError('Missing URL or token');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      newRoom
        .on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
          setParticipants((prev) => [...prev, participant]);
        })
        .on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
          setParticipants((prev) => prev.filter((p) => p.identity !== participant.identity));
        })
        .on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
          if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
            setParticipants((prev) => [...prev.filter((p) => p.identity !== participant.identity), participant]);
          }
        })
        .on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
          setParticipants((prev) => [...prev.filter((p) => p.identity !== participant.identity), participant]);
        })
        .on(RoomEvent.LocalTrackPublished, () => {
          if (newRoom.localParticipant) {
            setParticipants((prev) => {
              const filtered = prev.filter((p) => p.identity !== newRoom.localParticipant.identity);
              return [newRoom.localParticipant, ...filtered];
            });
          }
        })
        .on(RoomEvent.Disconnected, () => {
          setIsConnected(false);
          setParticipants([]);
        });

      await newRoom.connect(url, token);
      setRoom(newRoom);
      setIsConnected(true);

      if (newRoom.localParticipant) {
        setParticipants([newRoom.localParticipant, ...Array.from(newRoom.remoteParticipants.values())]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      console.error('Error connecting to room:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [url, token]);

  const disconnectFromRoom = useCallback(() => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setIsConnected(false);
      setParticipants([]);
    }
  }, [room]);

  const toggleAudio = useCallback(async () => {
    if (room?.localParticipant) {
      const enabled = !localAudioEnabled;
      await room.localParticipant.setMicrophoneEnabled(enabled);
      setLocalAudioEnabled(enabled);
    }
  }, [room, localAudioEnabled]);

  const toggleVideo = useCallback(async () => {
    if (room?.localParticipant) {
      const enabled = !localVideoEnabled;
      await room.localParticipant.setCameraEnabled(enabled);
      setLocalVideoEnabled(enabled);
    }
  }, [room, localVideoEnabled]);

  const toggleScreenShare = useCallback(async () => {
    if (room?.localParticipant) {
      if (isScreenSharing) {
        await room.localParticipant.setScreenShareEnabled(false);
        setIsScreenSharing(false);
      } else {
        await room.localParticipant.setScreenShareEnabled(true);
        setIsScreenSharing(true);
      }
    }
  }, [room, isScreenSharing]);

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  return {
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
  };
};
