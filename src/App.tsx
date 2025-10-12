import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { MembersDashboard } from './pages/MembersDashboard';
import { MemberForm } from './pages/MemberForm';
import { ArchiveDashboard } from './pages/ArchiveDashboard';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

type ViewType = 'members' | 'form' | 'archive';

const AppContent = () => {
  const [showSignIn, setShowSignIn] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('members');
  const [editMemberId, setEditMemberId] = useState<string | undefined>(undefined);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (user) {
    const handleNavigateToForm = (memberId?: string) => {
      setEditMemberId(memberId);
      setCurrentView('form');
    };

    const handleNavigateToArchive = () => {
      setCurrentView('archive');
    };

    const handleNavigateToMembers = () => {
      setEditMemberId(undefined);
      setCurrentView('members');
    };

    if (currentView === 'form') {
      return (
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 bg-gradient-to-br from-slate-50 via-white to-gray-50">
            <MemberForm
              memberId={editMemberId}
              onNavigateBack={handleNavigateToMembers}
            />
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar
            currentView={currentView}
            onNavigateToMembers={handleNavigateToMembers}
            onNavigateToArchive={handleNavigateToArchive}
          />
          <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-gray-50">
            {currentView === 'archive' ? (
              <ArchiveDashboard onNavigateBack={handleNavigateToMembers} />
            ) : (
              <MembersDashboard
                onNavigateToForm={handleNavigateToForm}
                onNavigateToArchive={handleNavigateToArchive}
              />
            )}
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return showSignIn ? (
    <SignIn onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUp onSwitchToSignIn={() => setShowSignIn(true)} />
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
