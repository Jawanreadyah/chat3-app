import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  user: User;
  text: string;
  timestamp: string;
}

interface User {
  id: string;
  username: string;
}

interface ChatStore {
  socket: Socket | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  username: string;
  messages: Message[];
  users: User[];
  typingUsers: { [key: string]: boolean };
  setLoading: (loading: boolean) => void;
  login: (username: string) => void;
  logout: () => void;
  sendMessage: (message: string) => void;
  setTyping: (isTyping: boolean) => void;
}

const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:3000';

export const useStore = create<ChatStore>((set, get) => ({
  socket: null,
  isLoading: true,
  isLoggedIn: false,
  username: '',
  messages: [],
  users: [],
  typingUsers: {},

  setLoading: (loading) => set({ isLoading: loading }),

  login: (username) => {
    const socket = io(SOCKET_URL);
    
    socket.on('connect', () => {
      socket.emit('join', username);
    });

    socket.on('previousMessages', (messages) => {
      set({ messages });
    });

    socket.on('message', (message) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });

    socket.on('userList', (users) => {
      set({ users });
    });

    socket.on('userTyping', ({ user, isTyping }) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [user.id]: isTyping,
        },
      }));
    });

    set({ socket, username, isLoggedIn: true, isLoading: false });
  },

  logout: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({
      socket: null,
      isLoggedIn: false,
      username: '',
      messages: [],
      users: [],
      typingUsers: {},
    });
  },

  sendMessage: (message) => {
    const { socket } = get();
    if (socket) {
      socket.emit('message', message);
    }
  },

  setTyping: (isTyping) => {
    const { socket } = get();
    if (socket) {
      socket.emit('typing', isTyping);
    }
  },
}));