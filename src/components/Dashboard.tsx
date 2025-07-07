import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Subject, Conversation } from '../types';
import SubjectCard from './SubjectCard';
import ChatInterface from './ChatInterface';

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

const Dashboard: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [subjects] = useState<Subject[]>(mockSubjects);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (selectedSubject) {
    return (
      <ChatInterface 
        subject={selectedSubject} 
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao AI Tutors
          </h1>
          <p className="text-gray-600">
            Escolha uma disciplina para começar a estudar com seu professor particular de IA
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <Clock className="h-6 w-6 text-purple-600" />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha uma Disciplina</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onClick={() => handleSubjectSelect(subject)}
              />
            ))}
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
      </div>
    </div>
  );
};

export default Dashboard;