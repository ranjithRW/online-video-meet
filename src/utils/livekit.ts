export const generateMockToken = async (
  roomName: string,
  participantName: string,
  apiKey: string,
  apiSecret: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(apiSecret);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: apiKey,
    sub: participantName,
    exp: now + 3600,
    nbf: now,
    video: {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    },
  };

  const base64urlEncode = (data: Uint8Array): string => {
    const base64 = btoa(String.fromCharCode(...data));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const base64urlEncodeString = (str: string): string => {
    return base64urlEncode(encoder.encode(str));
  };

  const encodedHeader = base64urlEncodeString(JSON.stringify(header));
  const encodedPayload = base64urlEncodeString(JSON.stringify(payload));

  const message = `${encodedHeader}.${encodedPayload}`;
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));

  const encodedSignature = base64urlEncode(new Uint8Array(signature));

  return `${message}.${encodedSignature}`;
};
