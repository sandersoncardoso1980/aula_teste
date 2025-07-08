import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Clock, ArrowRight, BookOpen, Brain, Target, Settings, User, LogOut, Shield } from 'lucide-react';
import { Subject, Conversation, UserProgress, LearningStyle, KnowledgeLevel, AssessmentResult } from '../types';
import { useAuth } from '../contexts/AuthContext';
import SubjectCard from './SubjectCard';
import ChatInterface from './ChatInterface';
import DiagnosticAssessment from './DiagnosticAssessment';
import ProgressDashboard from './ProgressDashboard';
import AdminPanel from './AdminPanel';

const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Matemática',
    description: 'Álgebra, Cálculo, Geometria e Estatística',
    icon: 'BookOpen',
    color: 'blue',
    agent_description: 'Especialista em matemática com foco em explicações claras e passo a passo.',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Física',
    description: 'Mecânica, Termodinâmica, Eletromagnetismo',
    icon: 'MessageCircle',
    color: 'green',
    agent_description: 'Professor de física com experiência em aplicações práticas e teóricas.',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Química',
    description: 'Química Geral, Orgânica e Inorgânica',
    icon: 'Users',
    color: 'purple',
    agent_description: 'Especialista em química com foco em reações e processos químicos.',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Biologia',
    description: 'Biologia Celular, Genética, Ecologia',
    icon: 'BookOpen',
    color: 'emerald',
    agent_description: 'Professor de biologia com expertise em ciências da vida.',
    created_at: new Date().toISOString()
  }
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    user_id: '1',
    subject_id: '1',
    title: 'Derivadas e Integrais',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    user_id: '1',
    subject_id: '2',
    title: 'Leis de Newton',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock user progress data
const createMockProgress = (subjectId: string): UserProgress => ({
  id: `progress-${subjectId}`,
  user_id: '1',
  subject_id: subjectId,
  current_level: Math.floor(Math.random() * 10) + 1,
  experience_points: Math.floor(Math.random() * 5000) + 1000,
  topics_completed: ['Álgebra Básica', 'Equações Lineares', 'Funções'],
  topics_in_progress: ['Derivadas', 'Integrais'],
  learning_streak: Math.floor(Math.random() * 30) + 1,
  last_activity: new Date().toISOString(),
  achievements: [
    {
      id: '1',
      name: 'Primeira Conquista',
      description: 'Completou o primeiro tópico',
      icon: '🎯',
      type: 'completion',
      earned_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Sequência de 7 dias',
      description: 'Estudou por 7 dias consecutivos',
      icon: '🔥',
      type: 'streak',
      earned_at: new Date().toISOString()
    }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

const mockLearningStyle: LearningStyle = {
  visual: 40,
  auditory: 25,
  kinesthetic: 20,
  reading_writing: 15,
  dominant_style: 'visual'
};

const mockKnowledgeLevel: KnowledgeLevel = {
  overall: 'intermediate',
  topics: {
    'Álgebra Básica': 'advanced',
    'Cálculo': 'intermediate',
    'Geometria': 'beginner'
  },
  confidence_score: 75
};

const Dashboard: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showAssessment, setShowAssessment] = useState<Subject | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [subjects] = useState<Subject[]>(mockSubjects);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [learningStyles, setLearningStyles] = useState<Record<string, LearningStyle>>({});
  const [knowledgeLevels, setKnowledgeLevels] = useState<Record<string, KnowledgeLevel>>({});
  const [showProgressDashboard, setShowProgressDashboard] = useState<string | null>(null);
  
  const { user, userProfile, signOut } = useAuth();

  // Initialize mock data
  useEffect(() => {
    const progressData: Record<string, UserProgress> = {};
    const styleData: Record<string, LearningStyle> = {};
    const levelData: Record<string, KnowledgeLevel> = {};

    subjects.forEach(subject => {
      progressData[subject.id] = createMockProgress(subject.id);
      styleData[subject.id] = mockLearningStyle;
      levelData[subject.id] = mockKnowledgeLevel;
    });

    setUserProgress(progressData);
    setLearningStyles(styleData);
    setKnowledgeLevels(levelData);
  }, [subjects]);

  const handleSubjectSelect = (subject: Subject) => {
    // Check if user has completed assessment for this subject
    const hasAssessment = learningStyles[subject.id] && knowledgeLevels[subject.id];
    
    if (!hasAssessment) {
      setShowAssessment(subject);
    } else {
      setSelectedSubject(subject);
    }
  };

  const handleAssessmentComplete = (
    subject: Subject,
    result: AssessmentResult,
    learningStyle: LearningStyle,
    knowledgeLevel: KnowledgeLevel
  ) => {
    // Save assessment results
    setLearningStyles(prev => ({ ...prev, [subject.id]: learningStyle }));
    setKnowledgeLevels(prev => ({ ...prev, [subject.id]: knowledgeLevel }));
    
    // Create initial progress based on assessment
    const initialProgress: UserProgress = {
      id: `progress-${subject.id}`,
      user_id: '1',
      subject_id: subject.id,
      current_level: result.recommended_level === 'beginner' ? 1 : result.recommended_level === 'intermediate' ? 3 : 5,
      experience_points: Math.floor(result.score * 10),
      topics_completed: [],
      topics_in_progress: Object.keys(result.topic_scores),
      learning_streak: 1,
      last_activity: new Date().toISOString(),
      achievements: [
        {
          id: `assessment-${subject.id}`,
          name: 'Avaliação Concluída',
          description: `Completou a avaliação diagnóstica de ${subject.name}`,
          icon: '🎯',
          type: 'completion',
          earned_at: new Date().toISOString()
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUserProgress(prev => ({ ...prev, [subject.id]: initialProgress }));
    setShowAssessment(null);
    setSelectedSubject(subject);
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
    setShowProgressDashboard(null);
    setShowAdminPanel(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSwitchUser = () => {
    window.location.reload();
  };

  const isAdmin = userProfile?.role === 'admin';

  // Show admin panel if requested
  if (showAdminPanel && isAdmin) {
    return <AdminPanel onBack={handleBackToDashboard} />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Show assessment if needed
  if (showAssessment) {
    return (
      <DiagnosticAssessment
        subject={showAssessment}
        onComplete={(result, learningStyle, knowledgeLevel) => 
          handleAssessmentComplete(showAssessment, result, learningStyle, knowledgeLevel)
        }
        onSkip={() => {
          // Set default values and proceed
          setLearningStyles(prev => ({ ...prev, [showAssessment.id]: mockLearningStyle }));
          setKnowledgeLevels(prev => ({ ...prev, [showAssessment.id]: mockKnowledgeLevel }));
          setShowAssessment(null);
          setSelectedSubject(showAssessment);
        }}
      />
    );
  }

  // Show progress dashboard if selected
  if (showProgressDashboard && userProgress[showProgressDashboard] && learningStyles[showProgressDashboard] && knowledgeLevels[showProgressDashboard]) {
    const subject = subjects.find(s => s.id === showProgressDashboard);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Voltar ao Dashboard
            </button>
          </div>
          <ProgressDashboard
            progress={userProgress[showProgressDashboard]}
            learningStyle={learningStyles[showProgressDashboard]}
            knowledgeLevel={knowledgeLevels[showProgressDashboard]}
            subjectName={subject?.name || 'Disciplina'}
          />
        </div>
      </div>
    );
  }

  // Show chat interface if subject is selected
  if (selectedSubject) {
    return (
      <ChatInterface 
        subject={selectedSubject} 
        onBack={handleBackToDashboard}
        userProgress={userProgress[selectedSubject.id]}
        learningStyle={learningStyles[selectedSubject.id]}
        knowledgeLevel={knowledgeLevels[selectedSubject.id]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI Tutors</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {userProfile?.name || user?.user_metadata?.name || user?.email?.split('@')[0]}
                {isAdmin && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    Admin
                  </span>
                )}
              </span>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Conta</span>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile?.name || user?.user_metadata?.name || 'Usuário'}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {isAdmin ? '🛡️ Administrador' : '👨‍🎓 Estudante'}
                        </p>
                      </div>
                      
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setShowAdminPanel(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center space-x-2"
                        >
                          <Shield className="h-4 w-4" />
                          <span>Painel Admin</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          handleSwitchUser();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Trocar Usuário</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          handleSignOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎓 Bem-vindo ao AI Tutors{isAdmin ? ' - Painel Administrativo' : ''}
          </h1>
          <p className="text-gray-600">
            {isAdmin 
              ? 'Gerencie o sistema e escolha uma disciplina para estudar'
              : 'Escolha uma disciplina para começar a estudar com seu professor particular de IA personalizado'
            }
          </p>
        </div>

        {/* Admin Quick Actions */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">
                    🛡️ Ferramentas de Administrador
                  </h3>
                  <p className="text-purple-700">
                    Gerencie livros, disciplinas e conteúdo do sistema
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminPanel(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Shield className="h-5 w-5" />
                <span>Abrir Painel Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
                <p className="text-gray-600">Conversas Ativas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
                <p className="text-gray-600">Disciplinas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(learningStyles).length}
                </p>
                <p className="text-gray-600">Avaliações</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-gray-600">Disponível</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Escolha uma Disciplina</h2>
            {isAdmin && (
              <button
                onClick={() => setShowAdminPanel(true)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Gerenciar Disciplinas</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => {
              const hasAssessment = learningStyles[subject.id] && knowledgeLevels[subject.id];
              const progress = userProgress[subject.id];
              
              return (
                <div key={subject.id} className="relative">
                  <SubjectCard
                    subject={subject}
                    onClick={() => handleSubjectSelect(subject)}
                    hasAssessment={hasAssessment}
                    progress={progress}
                  />
                  
                  {hasAssessment && progress && (
                    <button
                      onClick={() => setShowProgressDashboard(subject.id)}
                      className="absolute top-2 right-2 bg-white bg-opacity-90 p-2 rounded-lg shadow-sm hover:bg-opacity-100 transition-all"
                      title="Ver progresso detalhado"
                    >
                      <Target className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Conversations */}
        {conversations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Conversas Recentes</h2>
            <div className="space-y-4">
              {conversations.map((conversation) => {
                const subject = subjects.find(s => s.id === conversation.subject_id);
                return (
                  <div
                    key={conversation.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => subject && handleSubjectSelect(subject)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`bg-${subject?.color}-100 p-2 rounded-lg`}>
                        <MessageSquare className={`h-5 w-5 text-${subject?.color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{conversation.title}</h3>
                        <p className="text-sm text-gray-600">{subject?.name} • {formatDate(conversation.updated_at)}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Assessment Reminder */}
        {subjects.some(s => !learningStyles[s.id]) && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900">
                  🎯 Complete sua Avaliação Diagnóstica
                </h3>
                <p className="text-blue-700">
                  Faça nossa avaliação rápida para personalizar sua experiência de aprendizagem. 
                  Descobriremos seu estilo de aprendizagem e nível de conhecimento!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;