import React, { useState } from 'react';
import { AppView, UserProfile } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ImageGen } from './components/ImageGen';
import { VideoStudio } from './components/VideoStudio';
import { TextEngine } from './components/TextEngine';
import { ThumbnailEngine } from './components/ThumbnailEngine';
import { StoryStudio } from './components/StoryStudio';
import { SketchStudio } from './components/SketchStudio/SketchStudio';
import { ChatBot } from './components/ChatBot';
import { Settings } from './components/Settings';

const AppContent: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Helper to navigate to a view with a selected item
  const navigateToItem = (view: AppView, itemId: string) => {
    setSelectedItemId(itemId);
    setCurrentView(view);
  };

  // Convert Supabase profile to UserProfile format
  const userProfile: UserProfile = {
    name: profile?.full_name || 'Creator',
    avatarUrl: profile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNsFqWF5iQVNoUnwyaSNFSunX3-x1P3ttQm5pyya4GFxDRald1TQRNJ-pm7yRDH_DXIbLa7Gf1SXid866fs9ZRN-8knroGfTH_N_G-SlVwrSyBjqHgpQ-PrQw3wmDociqLcHIV5exvR0KDaFwS86J5lOIJxU8ccJZei2AWW0WnK0tUea-eXfEy3fa3GETpPANrkA7ipZp1c2bEWI1YyoMaea-hPMGkJnYM3lreBtaTxfJVmW5CDhlRaQ-XVzLDSlB-vtrPmzzrtLUI'
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#101622]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#135bec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage />;
  }

  // Show main app if authenticated
  return (
    <div className="flex flex-col h-screen w-full bg-[#101622] text-slate-100 font-display overflow-hidden">
      <Navigation currentView={currentView} setView={setCurrentView} userProfile={userProfile} />

      {/* 
        Main Content Area 
        We use CSS visibility (hidden/block) instead of conditional rendering (switch/case).
        This keeps all components mounted, preserving their state (chat history, generated images, inputs)
        while the user navigates between tools.
      */}
      <div className="flex-1 relative w-full overflow-hidden">

        <div className={`w-full h-full ${currentView === AppView.DASHBOARD ? 'block' : 'hidden'}`}>
          <Dashboard setView={setCurrentView} navigateToItem={navigateToItem} />
        </div>

        <div className={`w-full h-full ${currentView === AppView.IMAGE_GEN ? 'block' : 'hidden'}`}>
          <ImageGen selectedItemId={selectedItemId} onItemLoaded={() => setSelectedItemId(null)} />
        </div>

        <div className={`w-full h-full ${currentView === AppView.VIDEO_STUDIO ? 'block' : 'hidden'}`}>
          <VideoStudio selectedItemId={selectedItemId} onItemLoaded={() => setSelectedItemId(null)} />
        </div>

        <div className={`w-full h-full ${currentView === AppView.TEXT_ENGINE ? 'block' : 'hidden'}`}>
          <TextEngine />
        </div>

        <div className={`w-full h-full ${currentView === AppView.THUMBNAIL_ENGINE ? 'block' : 'hidden'}`}>
          <ThumbnailEngine selectedItemId={selectedItemId} onItemLoaded={() => setSelectedItemId(null)} />
        </div>

        <div className={`w-full h-full ${currentView === AppView.STORY_STUDIO ? 'block' : 'hidden'}`}>
          <StoryStudio />
        </div>

        <div className={`w-full h-full ${currentView === AppView.SKETCH_STUDIO ? 'block' : 'hidden'}`}>
          <SketchStudio />
        </div>

        <div className={`w-full h-full ${currentView === AppView.CHAT_BOT ? 'block' : 'hidden'}`}>
          <ChatBot />
        </div>

        <div className={`w-full h-full ${currentView === AppView.SETTINGS ? 'block' : 'hidden'}`}>
          <Settings userProfile={userProfile} />
        </div>

      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;