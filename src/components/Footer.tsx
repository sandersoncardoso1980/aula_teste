import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, Github, Twitter, Linkedin, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">AI Tutors</h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Revolucionando a educação com professores particulares de IA especializados, 
              disponíveis 24/7 para ajudar você a alcançar seus objetivos acadêmicos.
            </p>
            
            {/* Gemini AI Badge */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 mb-6 max-w-sm">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Powered by Google Gemini AI</span>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                Tecnologia de IA de última geração para educação personalizada
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">Disciplinas</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Recursos</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Preços</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@aitutors.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+55 11 99999-9999</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AI Tutors. Todos os direitos reservados. Powered by Google Gemini AI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;