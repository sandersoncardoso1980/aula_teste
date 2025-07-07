import React from 'react';
import { GraduationCap, User, LogOut, Settings, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSupabaseStatus } from '../lib/supabase';

interface HeaderProps {
  onAuthClick: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick, onProfileClick }) => {
  const { user, signOut } = useAuth();
  const supabaseStatus = getSupabaseStatus();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">AI Tutors</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Recursos
            </a>
            <a href="#subjects" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Disciplinas
            </a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Sobre
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Supabase Status Indicator */}
            {!supabaseStatus.isConfigured && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700 hidden sm:inline">
                  Configure Supabase
                </span>
              </div>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Olá, {user.user_metadata?.name || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={onProfileClick}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Perfil</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;