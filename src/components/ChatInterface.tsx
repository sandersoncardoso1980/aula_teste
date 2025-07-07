import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Bot, User, BookOpen, Clock, Zap, AlertCircle, Youtube, ExternalLink } from 'lucide-react';
import { Subject, Message } from '../types';
import { generateGeminiResponse, getGeminiStatus } from '../lib/gemini';

interface ChatInterfaceProps {
  subject: Subject;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ subject, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      conversation_id: '1',
      content: `🤗 Oi! Eu sou seu professor particular de ${subject.name}, powered by Google Gemini AI! ${subject.agent_description} 

🌟 Estou aqui para te ajudar de um jeito super divertido e fácil de entender! Vou usar livros incríveis e até vídeos do YouTube para você aprender brincando!

🎯 Pode me fazer qualquer pergunta sobre ${subject.name} que eu vou explicar como se você fosse meu melhor amigo! O que você gostaria de aprender hoje?`,
      is_ai: true,
      created_at: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState(getGeminiStatus());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update API status on component mount
    setApiStatus(getGeminiStatus());
  }, []);

  const extractYouTubeLinks = (content: string): string[] => {
    const youtubeRegex = /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+/g;
    const matches = content.match(youtubeRegex);
    return matches || [];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    // Check API configuration
    if (!apiStatus.hasApiKey) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        conversation_id: '1',
        content: '🤖 Oi! Parece que minha conexão com o Google Gemini não está funcionando. Peça para um adulto verificar se a chave da API está configurada corretamente! 🔧',
        is_ai: true,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      conversation_id: '1',
      content: inputMessage,
      is_ai: false,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Generate AI response using Google Gemini
      const geminiResponse = await generateGeminiResponse(
        currentMessage,
        subject.name,
        subject.agent_description
      );
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: '1',
        content: geminiResponse.content,
        is_ai: true,
        source_book: geminiResponse.sourceBook,
        source_chapter: geminiResponse.sourceChapter,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error generating AI response:', error);
      
      // Child-friendly error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: '1',
        content: `🤗 Opa! Tive um probleminha técnico agora, mas não se preocupe! 

🔧 Erro: ${error.message || 'Problema de conexão com a API'}

💪 Não desista! Tente perguntar novamente em alguns segundinhos. Enquanto isso, que tal pensar em uma pergunta bem legal sobre ${subject.name}? 

🌟 Estou aqui esperando para te ajudar!`,
        is_ai: true,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (message: Message) => {
    const content = message.content;
    const youtubeLinks = extractYouTubeLinks(content);
    
    // Split content to separate text from YouTube links section
    const parts = content.split(/🎬\s*\*\*Vídeos que vão te ajudar:\*\*/);
    const mainContent = parts[0];
    const videoSection = parts[1];

    return (
      <div>
        <div className={`text-sm ${message.is_ai ? 'text-gray-900' : 'text-white'} whitespace-pre-wrap`}>
          {mainContent}
        </div>
        
        {/* YouTube Links Section */}
        {videoSection && youtubeLinks.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center space-x-2 mb-2">
              <Youtube className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-800">Vídeos Recomendados</span>
            </div>
            <div className="space-y-2">
              {youtubeLinks.map((link, index) => {
                const linkText = videoSection.split('\n')[index + 1]?.replace('•', '').trim() || `Vídeo ${index + 1}`;
                const title = linkText.split(' - ')[0] || `Vídeo Educativo ${index + 1}`;
                
                return (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-red-700 hover:text-red-900 hover:bg-red-100 p-2 rounded transition-colors"
                  >
                    <Youtube className="h-3 w-3" />
                    <span className="flex-1">{title}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className={`bg-${subject.color}-100 p-2 rounded-lg`}>
              <BookOpen className={`h-6 w-6 text-${subject.color}-600`} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                🤗 Professor de {subject.name}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="h-3 w-3" />
                <span>Powered by Google Gemini AI</span>
                {!apiStatus.hasApiKey && (
                  <div className="flex items-center space-x-1 text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    <span className="text-xs">API não configurada</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className={`h-2 w-2 rounded-full ${apiStatus.hasApiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{apiStatus.hasApiKey ? '🌟 Online' : '😴 Offline'}</span>
          </div>
        </div>
      </div>

      {/* API Status Warning */}
      {!apiStatus.hasApiKey && (
        <div className="bg-amber-50 border-b border-amber-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm text-amber-800 font-medium">
                🤖 API do Google Gemini não configurada
              </p>
              <p className="text-xs text-amber-700">
                Configure a chave da API no arquivo .env para usar a funcionalidade de IA
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.is_ai ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-3xl flex space-x-3 ${
                  message.is_ai ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.is_ai
                      ? `bg-${subject.color}-100`
                      : 'bg-blue-100'
                  }`}
                >
                  {message.is_ai ? (
                    <Bot className={`h-5 w-5 text-${subject.color}-600`} />
                  ) : (
                    <User className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.is_ai
                      ? 'bg-white shadow-sm border border-gray-100'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {renderMessageContent(message)}
                  
                  {message.is_ai && message.source_book && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <BookOpen className="h-3 w-3" />
                        <span>📚 Fonte: {message.source_book}</span>
                        {message.source_chapter && (
                          <>
                            <span>•</span>
                            <span>{message.source_chapter}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mt-1 text-xs text-gray-400">
                        <Zap className="h-3 w-3" />
                        <span>Google Gemini AI</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-3xl flex space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-${subject.color}-100`}>
                  <Bot className={`h-5 w-5 text-${subject.color}-600`} />
                </div>
                <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">🤔 Pensando na melhor explicação...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`🤗 Faça uma pergunta sobre ${subject.name}... Vou explicar de um jeito super fácil!`}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isTyping || !apiStatus.hasApiKey}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || !apiStatus.hasApiKey}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
            <Zap className="h-3 w-3 mr-1" />
            <span>🌟 Powered by Google Gemini AI</span>
            {apiStatus.hasApiKey && (
              <>
                <span className="mx-2">•</span>
                <span>Modelo: {apiStatus.model}</span>
                <span className="mx-2">•</span>
                <Youtube className="h-3 w-3 mr-1" />
                <span>Com vídeos do YouTube!</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;