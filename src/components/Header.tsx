import React from 'react';
import { GraduationCap, User, LogOut, Settings, AlertCircle, UserCog, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSupabaseStatus } from '../lib/supabase';

interface HeaderProps {
  onAuthClick: () => void;
  onAdminClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick, onAdminClick }) => {
  const { user, signOut, userProfile } = useAuth();
  const supabaseStatus = getSupabaseStatus();

  const handleSignOut = async () => {
    await signOut();
  };

  const isAdmin = userProfile?.role === 'admin';

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
                  Olá, {userProfile?.name || user.user_metadata?.name || user.email?.split('@')[0]}
                  {isAdmin && (
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                
                {isAdmin && (
                  <button
                    onClick={onAdminClick}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Conta</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile?.name || user.user_metadata?.name || 'Usuário'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <UserCog className="h-4 w-4" />
                        <span>Trocar Usuário</span>
                      </button>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                </div>
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