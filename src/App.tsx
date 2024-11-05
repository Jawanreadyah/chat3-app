import React, { useEffect } from 'react';
import { useStore } from './store';
import { LoginScreen } from './components/LoginScreen';
import { ChatScreen } from './components/ChatScreen';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  const { isLoggedIn, isLoading } = useStore();

  useEffect(() => {
    // Preload assets
    const preloadImages = [
      'https://images.unsplash.com/photo-1557683316-973673baf926',
      'https://images.unsplash.com/photo-1486520299386-6d106b22014b'
    ];
    preloadImages.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {!isLoggedIn ? <LoginScreen /> : <ChatScreen />}
    </div>
  );
}

export default App;