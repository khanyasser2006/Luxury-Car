import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import EngineeringPage from './pages/EngineeringPage';
import ReviewsPage from './pages/ReviewsPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import Footer from './components/Footer';
import TestDriveModal from './components/TestDriveModal';
import SEO from './components/SEO';
import { CMSProvider } from './context/CMSContext';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'cars' | 'engineering' | 'reviews' | 'auth' | 'admin'
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [modalPreselected, setModalPreselected] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('veloce_current_user')) || null;
    } catch {
      return null;
    }
  });

  // Sync state with URL hash on mount and hashchange for browser history navigation
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#/cars') || hash === '#cars') {
        setCurrentView('cars');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.startsWith('#/engineering') || hash === '#engineering') {
        setCurrentView('engineering');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.startsWith('#/reviews') || hash === '#reviews') {
        setCurrentView('reviews');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.startsWith('#/auth') || hash === '#auth' || hash.startsWith('#/login') || hash.startsWith('#/register')) {
        setCurrentView('auth');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.startsWith('#/admin') || hash === '#admin' || hash.startsWith('#/cms') || hash === '#cms') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentView('home');
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const handleNavigate = (view, carIndex = 0) => {
    if (view === 'cars') {
      setSelectedCarIndex(carIndex);
      setCurrentView('cars');
      window.location.hash = '#/cars';
    } else if (view === 'engineering') {
      setCurrentView('engineering');
      window.location.hash = '#/engineering';
    } else if (view === 'reviews') {
      setCurrentView('reviews');
      window.location.hash = '#/reviews';
    } else if (view === 'auth') {
      setCurrentView('auth');
      window.location.hash = '#/auth';
    } else if (view === 'admin') {
      setCurrentView('admin');
      window.location.hash = '#/admin';
    } else {
      setCurrentView('home');
      window.location.hash = '#/';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('veloce_current_user', JSON.stringify(user));
    handleNavigate('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('veloce_current_user');
  };

  const handleOpenModal = (preselected = null) => {
    setModalPreselected(preselected);
    setTestDriveModalOpen(true);
  };

  const handleCloseModal = () => {
    setTestDriveModalOpen(false);
  };

  return (
    <CMSProvider>
      <SEO currentView={currentView} />
      <div className="min-h-screen bg-[#020F06] text-[#F5FAF7] relative selection:bg-[#FA353F] selection:text-[#020F06] antialiased font-sans">
        <Navbar
          currentView={currentView}
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onOpenTestDriveModal={() => handleOpenModal()}
          audioMuted={audioMuted}
          setAudioMuted={setAudioMuted}
        />

        <main>
          {currentView === 'home' && (
            <HomePage
              onOpenTestDriveModal={handleOpenModal}
              onNavigateToCars={(carIdx = 0) => handleNavigate('cars', carIdx)}
              onNavigateToEngineering={() => handleNavigate('engineering')}
              onNavigateToReviews={() => handleNavigate('reviews')}
            />
          )}

          {currentView === 'cars' && (
            <CarsPage
              initialCarIndex={selectedCarIndex}
              onOpenTestDriveModal={handleOpenModal}
              onNavigateToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'engineering' && (
            <EngineeringPage
              onOpenTestDriveModal={handleOpenModal}
              onNavigateToHome={() => handleNavigate('home')}
              onNavigateToCars={(carIdx = 0) => handleNavigate('cars', carIdx)}
            />
          )}

          {currentView === 'reviews' && (
            <ReviewsPage
              onOpenTestDriveModal={handleOpenModal}
              onNavigateToHome={() => handleNavigate('home')}
              onNavigateToCars={(carIdx = 0) => handleNavigate('cars', carIdx)}
            />
          )}

          {currentView === 'auth' && (
            <AuthPage
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onNavigateToHome={() => handleNavigate('home')}
              onNavigateToCars={(carIdx = 0) => handleNavigate('cars', carIdx)}
              onNavigateToAdmin={() => handleNavigate('admin')}
            />
          )}

          {currentView === 'admin' && (
            <AdminPage onNavigate={handleNavigate} />
          )}
        </main>

        {currentView !== 'auth' && currentView !== 'admin' && (
          <Footer
            onOpenTestDriveModal={() => handleOpenModal()}
            onNavigate={handleNavigate}
          />
        )}

        <TestDriveModal
          isOpen={testDriveModalOpen}
          onClose={handleCloseModal}
          preselectedData={modalPreselected}
        />
      </div>
    </CMSProvider>
  );
}
