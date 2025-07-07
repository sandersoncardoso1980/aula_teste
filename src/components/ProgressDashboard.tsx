import React from 'react';
import { TrendingUp, Target, Clock, Award, BookOpen, Zap, Star, Calendar } from 'lucide-react';
import { UserProgress, Achievement, LearningStyle, KnowledgeLevel } from '../types';

interface ProgressDashboardProps {
  progress: UserProgress;
  learningStyle: LearningStyle;
  knowledgeLevel: KnowledgeLevel;
  subjectName: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  progress, 
  learningStyle, 
  knowledgeLevel, 
  subjectName 
}) => {
  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return '👁️';
      case 'auditory': return '👂';
      case 'kinesthetic': return '✋';
      case 'reading_writing': return '📝';
      default: return '🧠';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'streak': return '🔥';
      case 'completion': return '✅';
      case 'mastery': return '🎯';
      case 'speed': return '⚡';
      case 'consistency': return '📈';
      default: return '🏆';
    }
  };

  const currentLevel = Math.floor(progress.experience_points / 1000) + 1;
  const xpForNextLevel = (currentLevel * 1000) - progress.experience_points;
  const xpProgress = ((progress.experience_points % 1000) / 1000) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
          Seu Progresso em {subjectName}
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-500">Último acesso</div>
          <div className="text-sm font-medium text-gray-700">
            {new Date(progress.last_activity).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Level and XP */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Star className="h-6 w-6" />
            <span className="text-sm opacity-90">Nível</span>
          </div>
          <div className="text-2xl font-bold">{currentLevel}</div>
          <div className="text-xs opacity-75">{xpForNextLevel} XP para próximo nível</div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-6 w-6 text-green-600" />
            <span className="text-sm text-green-700">XP Total</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{progress.experience_points.toLocaleString()}</div>
          <div className="text-xs text-green-600">Pontos de experiência</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-6 w-6 text-orange-600" />
            <span className="text-sm text-orange-700">Sequência</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{progress.learning_streak}</div>
          <div className="text-xs text-orange-600">dias consecutivos</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="text-sm text-purple-700">Tópicos</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{progress.topics_completed.length}</div>
          <div className="text-xs text-purple-600">concluídos</div>
        </div>
      </div>

      {/* Learning Style and Knowledge Level */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            {getStyleIcon(learningStyle.dominant_style)} Estilo de Aprendizagem
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">👁️ Visual</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${learningStyle.visual}%` }}
                  ></div>
                </div>
                <span className="text-xs text-blue-600 font-medium w-8">{learningStyle.visual}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">👂 Auditivo</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${learningStyle.auditory}%` }}
                  ></div>
                </div>
                <span className="text-xs text-blue-600 font-medium w-8">{learningStyle.auditory}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">✋ Prático</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${learningStyle.kinesthetic}%` }}
                  ></div>
                </div>
                <span className="text-xs text-blue-600 font-medium w-8">{learningStyle.kinesthetic}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">📝 Leitura</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${learningStyle.reading_writing}%` }}
                  ></div>
                </div>
                <span className="text-xs text-blue-600 font-medium w-8">{learningStyle.reading_writing}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Nível de Conhecimento
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Nível Geral</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(knowledgeLevel.overall)}`}>
                {knowledgeLevel.overall === 'beginner' ? 'Iniciante' : 
                 knowledgeLevel.overall === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">Confiança</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${knowledgeLevel.confidence_score}%` }}
                  ></div>
                </div>
                <span className="text-sm text-green-600 font-medium">{Math.round(knowledgeLevel.confidence_score)}%</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-800 mb-2">Por Tópico:</h4>
              <div className="space-y-1">
                {Object.entries(knowledgeLevel.topics).map(([topic, level]) => (
                  <div key={topic} className="flex justify-between items-center text-sm">
                    <span className="text-green-700">{topic}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getLevelColor(level)}`}>
                      {level === 'beginner' ? 'Iniciante' : 
                       level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {progress.achievements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-600" />
            Conquistas Recentes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {progress.achievements.slice(-4).map((achievement) => (
              <div key={achievement.id} className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">{getAchievementIcon(achievement.type)}</div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{achievement.name}</h4>
                <p className="text-xs text-gray-600">{achievement.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(achievement.earned_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics Progress */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso dos Tópicos</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Tópicos Concluídos ({progress.topics_completed.length})
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {progress.topics_completed.map((topic, index) => (
                <div key={index} className="text-sm text-green-700 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {topic}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Em Progresso ({progress.topics_in_progress.length})
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {progress.topics_in_progress.map((topic, index) => (
                <div key={index} className="text-sm text-blue-700 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;