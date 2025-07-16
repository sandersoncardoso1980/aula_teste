import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Play, FileText, Video, Users, Clock, Star, ChevronRight, Download, ExternalLink } from 'lucide-react';
import { Subject, UserProgress, LearningStyle, KnowledgeLevel } from '../types';

interface SubjectContentProps {
  subject: Subject;
  onBack: () => void;
  onStartChat: () => void;
  progress?: UserProgress;
  learningStyle?: LearningStyle;
  knowledgeLevel?: KnowledgeLevel;
}

interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'exercise' | 'video' | 'reading';
  duration: number;
  completed: boolean;
  resources: Resource[];
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'exercise';
  url: string;
  description: string;
}

const SubjectContent: React.FC<SubjectContentProps> = ({
  subject,
  onBack,
  onStartChat,
  progress,
  learningStyle,
  knowledgeLevel
}) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'modules' | 'resources' | 'bibliography'>('modules');

  // Mock content structure based on subject
  const getModulesForSubject = (subjectName: string): Module[] => {
    const moduleStructures: Record<string, Module[]> = {
      'Matemática': [
        {
          id: '1',
          title: 'Álgebra Básica',
          description: 'Fundamentos de álgebra, equações e inequações',
          estimatedTime: 120,
          difficulty: 'beginner',
          completed: progress?.topics_completed.includes('Álgebra Básica') || false,
          topics: [
            {
              id: '1-1',
              title: 'Operações com Números Reais',
              description: 'Adição, subtração, multiplicação e divisão',
              type: 'lesson',
              duration: 30,
              completed: true,
              resources: [
                { id: '1', title: 'Fundamentos de Matemática - Cap. 1', type: 'pdf', url: '#', description: 'Gelson Iezzi' },
                { id: '2', title: 'Exercícios Práticos', type: 'exercise', url: '#', description: '20 exercícios resolvidos' }
              ]
            },
            {
              id: '1-2',
              title: 'Equações do 1º Grau',
              description: 'Resolução de equações lineares',
              type: 'lesson',
              duration: 45,
              completed: true,
              resources: [
                { id: '3', title: 'Vídeo Explicativo', type: 'video', url: '#', description: 'Resolução passo a passo' },
                { id: '4', title: 'Lista de Exercícios', type: 'exercise', url: '#', description: '15 problemas práticos' }
              ]
            },
            {
              id: '1-3',
              title: 'Sistemas de Equações',
              description: 'Métodos de resolução de sistemas lineares',
              type: 'lesson',
              duration: 60,
              completed: false,
              resources: [
                { id: '5', title: 'Álgebra Linear - David Lay', type: 'pdf', url: '#', description: 'Capítulo sobre sistemas' }
              ]
            }
          ]
        },
        {
          id: '2',
          title: 'Cálculo Diferencial',
          description: 'Limites, derivadas e aplicações',
          estimatedTime: 180,
          difficulty: 'intermediate',
          completed: false,
          topics: [
            {
              id: '2-1',
              title: 'Conceito de Limite',
              description: 'Definição formal e cálculo de limites',
              type: 'lesson',
              duration: 60,
              completed: false,
              resources: [
                { id: '6', title: 'Cálculo - James Stewart', type: 'pdf', url: '#', description: 'Volume 1, Capítulo 2' }
              ]
            },
            {
              id: '2-2',
              title: 'Derivadas',
              description: 'Regras de derivação e aplicações',
              type: 'lesson',
              duration: 90,
              completed: false,
              resources: [
                { id: '7', title: 'Exercícios de Derivação', type: 'exercise', url: '#', description: '30 problemas variados' }
              ]
            }
          ]
        }
      ],
      'Física': [
        {
          id: '1',
          title: 'Mecânica Clássica',
          description: 'Cinemática, dinâmica e estática',
          estimatedTime: 150,
          difficulty: 'beginner',
          completed: false,
          topics: [
            {
              id: '1-1',
              title: 'Movimento Retilíneo',
              description: 'Velocidade, aceleração e equações do movimento',
              type: 'lesson',
              duration: 45,
              completed: false,
              resources: [
                { id: '8', title: 'Física Conceitual - Paul Hewitt', type: 'pdf', url: '#', description: 'Capítulo 3' }
              ]
            },
            {
              id: '1-2',
              title: 'Leis de Newton',
              description: 'As três leis fundamentais da mecânica',
              type: 'lesson',
              duration: 60,
              completed: false,
              resources: [
                { id: '9', title: 'Demonstração Experimental', type: 'video', url: '#', description: 'Experimentos práticos' }
              ]
            }
          ]
        }
      ]
    };

    return moduleStructures[subjectName] || moduleStructures['Matemática'];
  };

  const modules = getModulesForSubject(subject.name);
  const totalTopics = modules.reduce((acc, module) => acc + module.topics.length, 0);
  const completedTopics = modules.reduce((acc, module) => 
    acc + module.topics.filter(topic => topic.completed).length, 0
  );
  const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="h-4 w-4" />;
      case 'exercise': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'reading': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-600" />;
      case 'video': return <Video className="h-4 w-4 text-blue-600" />;
      case 'link': return <ExternalLink className="h-4 w-4 text-green-600" />;
      case 'exercise': return <FileText className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Voltar ao Dashboard"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className={`bg-${subject.color}-100 p-2 rounded-lg`}>
              <BookOpen className={`h-6 w-6 text-${subject.color}-600`} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                📚 {subject.name} - Conteúdo
              </h1>
              <p className="text-sm text-gray-600">
                {subject.description}
              </p>
            </div>
          </div>
          <button
            onClick={onStartChat}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Conversar com Professor IA</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Seu Progresso em {subject.name}</h2>
              <p className="opacity-90">
                {completedTopics} de {totalTopics} tópicos concluídos
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{Math.round(progressPercentage)}%</div>
              <div className="text-sm opacity-75">Completo</div>
            </div>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('modules')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'modules'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📖 Módulos e Tópicos
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'resources'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📁 Recursos Adicionais
              </button>
              <button
                onClick={() => setActiveTab('bibliography')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bibliography'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📚 Bibliografia
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Modules Tab */}
            {activeTab === 'modules' && (
              <div className="space-y-6">
                {modules.map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${module.completed ? 'bg-green-100' : 'bg-gray-200'}`}>
                            {module.completed ? (
                              <Star className="h-5 w-5 text-green-600" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {module.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {module.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {module.estimatedTime} min
                              </span>
                              <span className={`px-2 py-1 rounded-full ${getDifficultyColor(module.difficulty)}`}>
                                {module.difficulty === 'beginner' ? 'Iniciante' : 
                                 module.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                              </span>
                              <span>
                                {module.topics.filter(t => t.completed).length}/{module.topics.length} tópicos
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${
                          selectedModule === module.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>

                    {selectedModule === module.id && (
                      <div className="border-t border-gray-200 bg-white">
                        <div className="p-4 space-y-3">
                          {module.topics.map((topic) => (
                            <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${topic.completed ? 'bg-green-100' : 'bg-blue-100'}`}>
                                  {topic.completed ? (
                                    <Star className="h-4 w-4 text-green-600" />
                                  ) : (
                                    getTypeIcon(topic.type)
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {topic.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {topic.description}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{topic.duration} min</span>
                                    <span>•</span>
                                    <span>{topic.resources.length} recursos</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {topic.completed && (
                                  <span className="text-green-600 text-sm font-medium">Concluído</span>
                                )}
                                <button
                                  onClick={onStartChat}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  Estudar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Video className="h-5 w-5 mr-2 text-blue-600" />
                    Vídeos Educacionais
                  </h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Introdução ao Cálculo', duration: '15 min', views: '1.2k' },
                      { title: 'Derivadas na Prática', duration: '22 min', views: '856' },
                      { title: 'Aplicações de Integrais', duration: '18 min', views: '743' }
                    ].map((video, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Video className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{video.title}</h4>
                            <p className="text-sm text-gray-600">{video.duration} • {video.views} visualizações</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700">
                          <Play className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    Exercícios e Simulados
                  </h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Lista de Álgebra Básica', questions: '25 questões', difficulty: 'Fácil' },
                      { title: 'Simulado de Cálculo I', questions: '40 questões', difficulty: 'Médio' },
                      { title: 'Desafios Avançados', questions: '15 questões', difficulty: 'Difícil' }
                    ].map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-green-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{exercise.title}</h4>
                            <p className="text-sm text-gray-600">{exercise.questions} • {exercise.difficulty}</p>
                          </div>
                        </div>
                        <button className="text-green-600 hover:text-green-700">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bibliography Tab */}
            {activeTab === 'bibliography' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Bibliografia Principal</h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Cálculo Volume 1', author: 'James Stewart', edition: '8ª edição', year: '2016' },
                        { title: 'Álgebra Linear com Aplicações', author: 'David C. Lay', edition: '5ª edição', year: '2018' },
                        { title: 'Fundamentos de Matemática Elementar', author: 'Gelson Iezzi', edition: '11ª edição', year: '2019' }
                      ].map((book, index) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900">{book.title}</h4>
                          <p className="text-gray-700">{book.author}</p>
                          <p className="text-sm text-gray-600">{book.edition} • {book.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Bibliografia Complementar</h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Análise Real', author: 'Elon Lages Lima', edition: '4ª edição', year: '2017' },
                        { title: 'Geometria Analítica', author: 'Paulo Boulos', edition: '3ª edição', year: '2015' },
                        { title: 'Matemática Discreta', author: 'Kenneth Rosen', edition: '7ª edição', year: '2018' }
                      ].map((book, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900">{book.title}</h4>
                          <p className="text-gray-700">{book.author}</p>
                          <p className="text-sm text-gray-600">{book.edition} • {book.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">🔗 Links Úteis</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: 'Khan Academy - Matemática', url: 'https://pt.khanacademy.org/math' },
                      { title: 'Wolfram Alpha', url: 'https://www.wolframalpha.com' },
                      { title: 'GeoGebra', url: 'https://www.geogebra.org' },
                      { title: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu' }
                    ].map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all"
                      >
                        <span className="font-medium text-gray-900">{link.title}</span>
                        <ExternalLink className="h-4 w-4 text-blue-600" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🚀 Pronto para Aprender?</h3>
          <p className="mb-6 opacity-90">
            Converse com seu professor de IA especializado em {subject.name} e tire todas as suas dúvidas!
          </p>
          <button
            onClick={onStartChat}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Play className="h-5 w-5" />
            <span>Iniciar Conversa com Professor IA</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectContent;