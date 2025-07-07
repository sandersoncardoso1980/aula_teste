import React from 'react';
import { BookOpen, MessageCircle, Users, Star, TrendingUp, Clock } from 'lucide-react';
import { Subject, UserProgress } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
  hasAssessment?: boolean;
  progress?: UserProgress;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick, hasAssessment = false, progress }) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return BookOpen;
      case 'MessageCircle':
        return MessageCircle;
      case 'Users':
        return Users;
      default:
        return BookOpen;
    }
  };

  const Icon = getIconComponent(subject.icon);

  const currentLevel = progress ? Math.floor(progress.experience_points / 1000) + 1 : 1;
  const xpProgress = progress ? ((progress.experience_points % 1000) / 1000) * 100 : 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 relative overflow-hidden"
    >
      {/* Assessment Status Indicator */}
      {hasAssessment && (
        <div className="absolute top-3 right-3">
          <div className="bg-green-100 text-green-600 p-1 rounded-full">
            <Star className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Subject Icon */}
      <div className={`bg-${subject.color}-100 p-4 rounded-lg w-fit mb-4`}>
        <Icon className={`h-8 w-8 text-${subject.color}-600`} />
      </div>
      
      {/* Subject Info */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{subject.name}</h3>
      <p className="text-gray-600 mb-4">{subject.description}</p>
      
      {/* Progress Information */}
      {progress && hasAssessment ? (
        <div className="space-y-3">
          {/* Level and XP */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Nível {currentLevel}</span>
            </div>
            <span className="text-sm text-gray-500">{progress.experience_points} XP</span>
          </div>
          
          {/* XP Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-${subject.color}-600 h-2 rounded-full transition-all duration-500`}
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3 text-green-600" />
              <span className="text-gray-600">{progress.topics_completed.length} concluídos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-orange-600" />
              <span className="text-gray-600">{progress.learning_streak} dias</span>
            </div>
          </div>

          {/* Learning Streak */}
          {progress.learning_streak > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <span className="text-orange-600">🔥</span>
                <span className="text-sm font-medium text-orange-800">
                  {progress.learning_streak} dias de sequência!
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Default info for subjects without assessment */}
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>5-10 livros de referência</span>
          </div>
          
          {!hasAssessment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Faça a avaliação diagnóstica
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Personalize sua experiência de aprendizagem
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectCard;