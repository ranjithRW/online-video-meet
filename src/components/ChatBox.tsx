import React, { useState, useRef, useEffect } from 'react';

interface Message {
  user: string;
  text: string;
}

interface ChatBoxProps {
  userName: string;
  messages: Message[];
  onSend: (msg: string) => void;
  onClose: () => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ userName, messages, onSend, onClose }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 flex flex-col z-50 shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
        <span className="text-white font-semibold">Chat</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.user === userName ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-gray-400 mb-1">{msg.user}</span>
            <div className={`px-3 py-2 rounded-lg ${msg.user === userName ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'}`}>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-gray-800 bg-gray-950 flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
};
