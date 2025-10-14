export interface LiveKitConfig {
  url: string;
  token: string;
}

export interface ParticipantInfo {
  identity: string;
  name: string;
  isSpeaking: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
}
