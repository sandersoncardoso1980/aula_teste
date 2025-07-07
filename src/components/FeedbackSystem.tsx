import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Star, Brain, Lightbulb, HelpCircle } from 'lucide-react';
import { FeedbackData } from '../types';

interface FeedbackSystemProps {
  messageId: string;
  onFeedback: (feedback: FeedbackData) => void;
  className?: string;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ messageId, onFeedback, className = '' }) => {
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [feedback, setFeedback] = useState<Partial<FeedbackData>>({
    message_id: messageId
  });

  const handleQuickFeedback = (understanding: FeedbackData['user_understanding']) => {
    const quickFeedback: FeedbackData = {
      message_id: messageId,
      user_understanding: understanding,
      difficulty_rating: understanding === 'confused' ? 5 : understanding === 'partial' ? 3 : understanding === 'understood' ? 2 : 1,
      helpfulness_rating: understanding === 'confused' ? 2 : understanding === 'partial' ? 3 : understanding === 'understood' ? 4 : 5,
      preferred_explanation_style: 'simple',
      additional_help_needed: understanding === 'confused' || understanding === 'partial'
    };
    
    onFeedback(quickFeedback);
  };

  const handleDetailedFeedback = () => {
    if (feedback.user_understanding && feedback.difficulty_rating && feedback.helpfulness_rating && feedback.preferred_explanation_style !== undefined) {
      onFeedback(feedback as FeedbackData);
      setShowDetailedFeedback(false);
    }
  };

  const getUnderstandingIcon = (level: string) => {
    switch (level) {
      case 'confused': return '😕';
      case 'partial': return '🤔';
      case 'understood': return '😊';
      case 'mastered': return '🤩';
      default: return '🤔';
    }
  };

  const getUnderstandingColor = (level: string) => {
    switch (level) {
      case 'confused': return 'text-red-600 bg-red-50 border-red-200';
      case 'partial': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'understood': return 'text-green-600 bg-green-50 border-green-200';
      case 'mastered': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (showDetailedFeedback) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <MessageCircle className="h-4 w-4 mr-2" />
          Como foi essa explicação para você?
        </h4>

        {/* Understanding Level */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nível de compreensão:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'confused', label: '😕 Confuso', desc: 'Não entendi' },
              { value: 'partial', label: '🤔 Parcial', desc: 'Entendi um pouco' },
              { value: 'understood', label: '😊 Entendi', desc: 'Ficou claro' },
              { value: 'mastered', label: '🤩 Dominei', desc: 'Entendi perfeitamente' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFeedback(prev => ({ ...prev, user_understanding: option.value as any }))}
                className={`p-3 text-left border rounded-lg transition-all ${
                  feedback.user_understanding === option.value
                    ? getUnderstandingColor(option.value)
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dificuldade da explicação:
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setFeedback(prev => ({ ...prev, difficulty_rating: rating }))}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  feedback.difficulty_rating === rating
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Muito fácil</span>
            <span>Muito difícil</span>
          </div>
        </div>

        {/* Helpfulness Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quão útil foi a resposta:
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setFeedback(prev => ({ ...prev, helpfulness_rating: rating }))}
                className={`transition-all ${
                  feedback.helpfulness_rating && rating <= feedback.helpfulness_rating
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Explanation Style */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Como você prefere que eu explique:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'simple', label: '🎯 Simples', desc: 'Linguagem fácil' },
              { value: 'detailed', label: '📚 Detalhado', desc: 'Mais informações' },
              { value: 'visual', label: '👁️ Visual', desc: 'Com exemplos visuais' },
              { value: 'practical', label: '⚡ Prático', desc: 'Aplicação prática' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFeedback(prev => ({ ...prev, preferred_explanation_style: option.value as any }))}
                className={`p-3 text-left border rounded-lg transition-all ${
                  feedback.preferred_explanation_style === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={feedback.additional_help_needed || false}
              onChange={(e) => setFeedback(prev => ({ ...prev, additional_help_needed: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Preciso de mais ajuda com este tópico
            </span>
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleDetailedFeedback}
            disabled={!feedback.user_understanding || !feedback.difficulty_rating || !feedback.helpfulness_rating || feedback.preferred_explanation_style === undefined}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar Feedback
          </button>
          <button
            onClick={() => setShowDetailedFeedback(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-xs text-gray-500">Esta resposta foi útil?</span>
      
      {/* Quick feedback buttons */}
      <div className="flex space-x-1">
        <button
          onClick={() => handleQuickFeedback('confused')}
          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Não entendi"
        >
          😕
        </button>
        <button
          onClick={() => handleQuickFeedback('partial')}
          className="p-1 text-yellow-500 hover:bg-yellow-50 rounded transition-colors"
          title="Entendi parcialmente"
        >
          🤔
        </button>
        <button
          onClick={() => handleQuickFeedback('understood')}
          className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
          title="Entendi bem"
        >
          😊
        </button>
        <button
          onClick={() => handleQuickFeedback('mastered')}
          className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
          title="Dominei o assunto"
        >
          🤩
        </button>
      </div>

      <div className="border-l border-gray-300 h-4"></div>

      <button
        onClick={() => setShowDetailedFeedback(true)}
        className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
      >
        <MessageCircle className="h-3 w-3" />
        <span>Feedback detalhado</span>
      </button>
    </div>
  );
};

export default FeedbackSystem;