import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import SubjectsSection from './components/SubjectsSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';

const AppContent: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando aplicação...</p>
          <p className="mt-2 text-sm text-gray-500">Inicializando sistema de autenticação</p>
        </div>
      </div>
    );
  }

  // Show admin panel if requested
  if (showAdminPanel && userProfile?.role === 'admin') {
    return <AdminPanel onBack={() => setShowAdminPanel(false)} />;
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onAuthClick={() => setIsAuthModalOpen(true)}
        onAdminClick={() => setShowAdminPanel(true)}
      />
      <Hero onGetStarted={() => setIsAuthModalOpen(true)} />
      <SubjectsSection />
      <Footer />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
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