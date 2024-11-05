import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Users } from 'lucide-react';
import { useStore } from '../store';

export const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    users,
    username,
    typingUsers,
    sendMessage,
    setTyping,
    logout
  } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      setTyping(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  return (
    <div className="h-screen flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Modern Chat</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Users className="w-6 h-6" />
            </button>
            <button
              onClick={logout}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${
                  msg.user.username === username ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.user.username === username
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <div className="text-sm opacity-75 mb-1">
                    {msg.user.username}
                  </div>
                  <div>{msg.text}</div>
                  <div className="text-xs opacity-50 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        <div className="px-4 h-6 text-gray-400 text-sm">
          {Object.entries(typingUsers)
            .filter(([id, isTyping]) => isTyping)
            .map(([id]) => users.find(u => u.id === id)?.username)
            .filter(name => name !== username)
            .map(name => `${name} is typing...`)
            .join(', ')}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Users Sidebar */}
      <AnimatePresence>
        {showUsers && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="w-64 bg-gray-800 border-l border-gray-700"
          >
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Online Users</h2>
            </div>
            <div className="p-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-2 text-gray-300 mb-2"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};