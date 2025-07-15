import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Search, Filter, Calendar, Clock, User, Bot } from 'lucide-react';
import { Conversation, Subject } from '../types';

interface ConversationHistoryProps {
  conversations: Conversation[];
  subjects: Subject[];
  onBack: () => void;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  subjects,
  onBack,
  onSelectConversation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'subject'>('recent');

  // Mock conversation details for demonstration
  const conversationDetails = conversations.map(conv => ({
    ...conv,
    messageCount: Math.floor(Math.random() * 20) + 5,
    lastMessage: `Última mensagem sobre ${subjects.find(s => s.id === conv.subject_id)?.name}...`,
    duration: `${Math.floor(Math.random() * 45) + 5} min`
  }));

  const filteredConversations = conversationDetails
    .filter(conv => {
      const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subjects.find(s => s.id === conv.subject_id)?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || conv.subject_id === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'oldest':
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        case 'subject':
          const subjectA = subjects.find(s => s.id === a.subject_id)?.name || '';
          const subjectB = subjects.find(s => s.id === b.subject_id)?.name || '';
          return subjectA.localeCompare(subjectB);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
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
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="bg-blue-100 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                📚 Histórico de Conversas
              </h1>
              <p className="text-sm text-gray-600">
                Revise suas conversas anteriores e continue de onde parou
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredConversations.length} conversas encontradas
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título ou disciplina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Subject Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas as disciplinas</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigas</option>
                <option value="subject">Por disciplina</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma conversa encontrada
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedSubject !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece uma nova conversa com um professor de IA'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => {
              const subject = subjects.find(s => s.id === conversation.subject_id);
              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`bg-${subject?.color}-100 p-2 rounded-lg`}>
                          <MessageSquare className={`h-5 w-5 text-${subject?.color}-600`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {conversation.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <span className={`w-2 h-2 bg-${subject?.color}-500 rounded-full mr-2`}></span>
                              {subject?.name}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {conversation.duration}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {conversation.messageCount} mensagens
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {conversation.lastMessage}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            Você
                          </span>
                          <span className="flex items-center">
                            <Bot className="h-3 w-3 mr-1" />
                            Professor IA
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(conversation.updated_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {filteredConversations.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Resumo das Conversas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredConversations.length}
                </div>
                <div className="text-sm text-gray-600">Total de Conversas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredConversations.reduce((acc, conv) => acc + conv.messageCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Mensagens Trocadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(filteredConversations.map(conv => conv.subject_id)).size}
                </div>
                <div className="text-sm text-gray-600">Disciplinas Estudadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(filteredConversations.reduce((acc, conv) => 
                    acc + parseInt(conv.duration), 0) / filteredConversations.length) || 0}
                </div>
                <div className="text-sm text-gray-600">Tempo Médio (min)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;