import React from 'react';
import { Calculator, Atom, Dna, FlaskConical, Globe, BookOpen, Languages, Palette } from 'lucide-react';

const subjects = [
  {
    name: 'Matemática',
    description: 'Álgebra, Cálculo, Geometria, Estatística',
    icon: Calculator,
    color: 'blue',
    books: ['Cálculo - James Stewart', 'Álgebra Linear - David Lay', 'Fundamentos de Matemática - Gelson Iezzi']
  },
  {
    name: 'Física',
    description: 'Mecânica, Termodinâmica, Eletromagnetismo',
    icon: Atom,
    color: 'green',
    books: ['Física Conceitual - Paul Hewitt', 'Fundamentos de Física - Halliday', 'Física para Cientistas - Serway']
  },
  {
    name: 'Química',
    description: 'Química Geral, Orgânica, Inorgânica',
    icon: FlaskConical,
    color: 'purple',
    books: ['Química Geral - Petrucci', 'Química Orgânica - Solomons', 'Atkins - Físico-Química']
  },
  {
    name: 'Biologia',
    description: 'Biologia Celular, Genética, Ecologia',
    icon: Dna,
    color: 'emerald',
    books: ['Biologia Celular - Lodish', 'Campbell - Biologia', 'Bioquímica - Lehninger']
  },
  {
    name: 'História',
    description: 'História Geral, do Brasil, Contemporânea',
    icon: Globe,
    color: 'orange',
    books: ['História Geral - José Jobson', 'História do Brasil - Boris Fausto', 'História Contemporânea - Hobsbawm']
  },
  {
    name: 'Literatura',
    description: 'Literatura Brasileira, Portuguesa, Mundial',
    icon: BookOpen,
    color: 'rose',
    books: ['Literatura Brasileira - Alfredo Bosi', 'História da Literatura - Massaud Moisés', 'Teoria Literária - Terry Eagleton']
  },
  {
    name: 'Português',
    description: 'Gramática, Redação, Interpretação',
    icon: Languages,
    color: 'indigo',
    books: ['Gramática - Evanildo Bechara', 'Redação - João Bosco Medeiros', 'Interpretação - William Roberto Cereja']
  },
  {
    name: 'Filosofia',
    description: 'Filosofia Antiga, Moderna, Contemporânea',
    icon: Palette,
    color: 'amber',
    books: ['História da Filosofia - Reale & Antiseri', 'Filosofia - Marilena Chauí', 'Introdução à Filosofia - Danilo Marcondes']
  }
];

const SubjectsSection: React.FC = () => {
  return (
    <section id="subjects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos Professores Especializados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada professor de IA é treinado especificamente em sua disciplina com base em livros acadêmicos renomados e referências de qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {subjects.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`bg-${subject.color}-100 p-4 rounded-xl w-fit mb-4`}>
                  <Icon className={`h-8 w-8 text-${subject.color}-600`} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {subject.name}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {subject.description}
                </p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Bibliografia:</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {subject.books.map((book, bookIndex) => (
                      <li key={bookIndex} className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{book}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;