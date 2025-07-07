import React from 'react';
import { Brain, Sparkles, BookOpen, Users, Zap } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Powered by Google Gemini AI
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Professores Particulares
            <span className="text-blue-600 block">Powered by AI</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Tenha acesso a professores especializados em IA, cada um expert em sua disciplina. 
            Aprenda com base em livros acadêmicos de qualidade, disponível 24/7.
          </p>

          {/* Gemini AI Highlight */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Google Gemini AI</h3>
                <p className="text-gray-600">Inteligência Artificial de última geração</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              Nossa plataforma utiliza o Google Gemini, um dos modelos de IA mais avançados do mundo, 
              para oferecer respostas precisas e contextualizadas baseadas em bibliografia acadêmica de qualidade.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={onGetStarted}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Começar Agora
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
              Ver Demonstração
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">IA Especializada</h3>
            <p className="text-gray-600">
              Cada professor é treinado especificamente em sua disciplina com base em livros acadêmicos renomados usando Google Gemini.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Bibliografia Acadêmica</h3>
            <p className="text-gray-600">
              Respostas baseadas em livros universitários e referências de qualidade, com citações precisas e contextualizadas.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Disponível 24/7</h3>
            <p className="text-gray-600">
              Tire suas dúvidas a qualquer hora, em qualquer lugar. Seu professor particular com IA nunca dorme.
            </p>
          </div>
        </div>

        {/* Technology Showcase */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold">Tecnologia Google Gemini</h3>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Utilizamos a mais avançada tecnologia de inteligência artificial do Google para proporcionar 
            uma experiência de aprendizado personalizada e eficiente, com respostas contextualizadas e precisas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;