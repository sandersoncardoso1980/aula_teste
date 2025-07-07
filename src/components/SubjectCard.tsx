import React from 'react';
import { BookOpen, MessageCircle, Users } from 'lucide-react';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
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

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
    >
      <div className={`bg-${subject.color}-100 p-4 rounded-lg w-fit mb-4`}>
        <Icon className={`h-8 w-8 text-${subject.color}-600`} />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{subject.name}</h3>
      <p className="text-gray-600 mb-4">{subject.description}</p>
      
      <div className="flex items-center text-sm text-gray-500">
        <BookOpen className="h-4 w-4 mr-1" />
        <span>5-10 livros de referência</span>
      </div>
    </div>
  );
};

export default SubjectCard;