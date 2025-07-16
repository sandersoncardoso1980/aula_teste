import React, { useState, useEffect } from 'react';
import { Brain, Clock, Target, TrendingUp, ArrowRight, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { Subject, DiagnosticQuestion, AssessmentResult, LearningStyle, KnowledgeLevel } from '../types';

interface DiagnosticAssessmentProps {
  subject: Subject;
  onComplete: (result: AssessmentResult, learningStyle: LearningStyle, knowledgeLevel: KnowledgeLevel) => void;
  onSkip: () => void;
  onBack?: () => void;
}

const DiagnosticAssessment: React.FC<DiagnosticAssessmentProps> = ({ subject, onComplete, onSkip, onBack }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'learning-style' | 'knowledge-test' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [learningStyleAnswers, setLearningStyleAnswers] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Mock diagnostic questions for different subjects
  const getQuestionsForSubject = (subjectName: string): DiagnosticQuestion[] => {
    const questionSets: Record<string, DiagnosticQuestion[]> = {
      'Matemática': [
        {
          id: '1',
          question: 'Qual é o resultado de 2x + 5 = 15?',
          options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 20'],
          correct_answer: 0,
          difficulty_level: 'beginner',
          topic: 'Álgebra Básica',
          explanation: 'Para resolver: 2x + 5 = 15, subtraímos 5 de ambos os lados: 2x = 10, depois dividimos por 2: x = 5'
        },
        {
          id: '2',
          question: 'Qual é a derivada de f(x) = x²?',
          options: ['2x', 'x', '2', 'x²'],
          correct_answer: 0,
          difficulty_level: 'intermediate',
          topic: 'Cálculo',
          explanation: 'A derivada de x² é 2x, usando a regra da potência: d/dx(xⁿ) = n·xⁿ⁻¹'
        },
        {
          id: '3',
          question: 'Qual é o valor de sen(π/2)?',
          options: ['0', '1', '-1', '√2/2'],
          correct_answer: 1,
          difficulty_level: 'intermediate',
          topic: 'Trigonometria',
          explanation: 'sen(π/2) = sen(90°) = 1, pois é o valor máximo da função seno'
        }
      ],
      'Física': [
        {
          id: '1',
          question: 'Qual é a unidade de força no Sistema Internacional?',
          options: ['Joule', 'Newton', 'Watt', 'Pascal'],
          correct_answer: 1,
          difficulty_level: 'beginner',
          topic: 'Mecânica',
          explanation: 'A unidade de força no SI é o Newton (N), definida como kg⋅m/s²'
        },
        {
          id: '2',
          question: 'Se um objeto cai livremente, qual é sua aceleração?',
          options: ['0 m/s²', '9,8 m/s²', '10 m/s²', 'Depende da massa'],
          correct_answer: 1,
          difficulty_level: 'beginner',
          topic: 'Cinemática',
          explanation: 'A aceleração da gravidade na Terra é aproximadamente 9,8 m/s², independente da massa'
        },
        {
          id: '3',
          question: 'Qual lei descreve a relação F = ma?',
          options: ['1ª Lei de Newton', '2ª Lei de Newton', '3ª Lei de Newton', 'Lei da Gravitação'],
          correct_answer: 1,
          difficulty_level: 'intermediate',
          topic: 'Dinâmica',
          explanation: 'A 2ª Lei de Newton estabelece que F = ma, relacionando força, massa e aceleração'
        }
      ],
      'Química': [
        {
          id: '1',
          question: 'Qual é o símbolo químico do ouro?',
          options: ['Go', 'Au', 'Or', 'Ag'],
          correct_answer: 1,
          difficulty_level: 'beginner',
          topic: 'Tabela Periódica',
          explanation: 'O símbolo do ouro é Au, derivado do latim "aurum"'
        },
        {
          id: '2',
          question: 'Quantos elétrons tem um átomo neutro de carbono?',
          options: ['4', '6', '8', '12'],
          correct_answer: 1,
          difficulty_level: 'beginner',
          topic: 'Estrutura Atômica',
          explanation: 'O carbono tem número atômico 6, logo tem 6 prótons e 6 elétrons quando neutro'
        },
        {
          id: '3',
          question: 'Qual é o pH de uma solução neutra?',
          options: ['0', '7', '14', '1'],
          correct_answer: 1,
          difficulty_level: 'intermediate',
          topic: 'Ácidos e Bases',
          explanation: 'Uma solução neutra tem pH = 7, onde [H⁺] = [OH⁻]'
        }
      ],
      'Biologia': [
        {
          id: '1',
          question: 'Qual organela é responsável pela respiração celular?',
          options: ['Núcleo', 'Mitocôndria', 'Ribossomo', 'Vacúolo'],
          correct_answer: 1,
          difficulty_level: 'beginner',
          topic: 'Citologia',
          explanation: 'A mitocôndria é a organela responsável pela respiração celular e produção de ATP'
        },
        {
          id: '2',
          question: 'Qual é a molécula que carrega informação genética?',
          options: ['RNA', 'DNA', 'Proteína', 'Lipídio'],
          correct_answer: 1,
          difficulty_level: 'beginner',
          topic: 'Genética',
          explanation: 'O DNA (ácido desoxirribonucleico) é a molécula que armazena a informação genética'
        },
        {
          id: '3',
          question: 'Qual processo converte CO₂ em glicose nas plantas?',
          options: ['Respiração', 'Fotossíntese', 'Fermentação', 'Digestão'],
          correct_answer: 1,
          difficulty_level: 'intermediate',
          topic: 'Fisiologia Vegetal',
          explanation: 'A fotossíntese converte CO₂ e H₂O em glicose usando energia luminosa'
        }
      ]
    };

    return questionSets[subjectName] || questionSets['Matemática'];
  };

  // Learning style questions
  const learningStyleQuestions = [
    {
      id: 'ls1',
      question: 'Como você prefere receber explicações?',
      options: [
        'Através de diagramas e imagens',
        'Ouvindo explicações detalhadas',
        'Fazendo exercícios práticos',
        'Lendo textos e anotações'
      ]
    },
    {
      id: 'ls2',
      question: 'Quando estuda, você prefere:',
      options: [
        'Ver vídeos e gráficos coloridos',
        'Escutar podcasts ou áudios',
        'Fazer experimentos ou atividades',
        'Ler livros e fazer resumos'
      ]
    },
    {
      id: 'ls3',
      question: 'Para memorizar algo novo, você:',
      options: [
        'Cria mapas mentais visuais',
        'Repete em voz alta',
        'Pratica fazendo exercícios',
        'Escreve várias vezes'
      ]
    },
    {
      id: 'ls4',
      question: 'Em uma aula, você aprende melhor quando:',
      options: [
        'O professor usa slides e imagens',
        'O professor explica falando',
        'Há atividades práticas',
        'Você pode tomar notas detalhadas'
      ]
    }
  ];

  const questions = getQuestionsForSubject(subject.name);

  useEffect(() => {
    if (currentStep === 'knowledge-test' && currentQuestionIndex === 0) {
      setStartTime(Date.now());
    }
  }, [currentStep, currentQuestionIndex]);

  useEffect(() => {
    if (currentStep === 'knowledge-test') {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep, startTime]);

  const handleLearningStyleAnswer = (questionId: string, answerIndex: number) => {
    setLearningStyleAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleKnowledgeAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const calculateLearningStyle = (): LearningStyle => {
    const scores = { visual: 0, auditory: 0, kinesthetic: 0, reading_writing: 0 };
    
    Object.values(learningStyleAnswers).forEach(answer => {
      switch (answer) {
        case 0: scores.visual += 25; break;
        case 1: scores.auditory += 25; break;
        case 2: scores.kinesthetic += 25; break;
        case 3: scores.reading_writing += 25; break;
      }
    });

    const dominant = Object.entries(scores).reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b)[0] as keyof typeof scores;

    return {
      visual: scores.visual,
      auditory: scores.auditory,
      kinesthetic: scores.kinesthetic,
      reading_writing: scores.reading_writing,
      dominant_style: dominant
    };
  };

  const calculateResults = (): { result: AssessmentResult; knowledgeLevel: KnowledgeLevel } => {
    const correctAnswers = questions.filter(q => answers[q.id] === q.correct_answer).length;
    const score = (correctAnswers / questions.length) * 100;
    
    const topicScores: Record<string, number> = {};
    questions.forEach(q => {
      if (!topicScores[q.topic]) topicScores[q.topic] = 0;
      if (answers[q.id] === q.correct_answer) {
        topicScores[q.topic] += 100;
      }
    });

    // Normalize topic scores
    Object.keys(topicScores).forEach(topic => {
      const topicQuestions = questions.filter(q => q.topic === topic).length;
      topicScores[topic] = topicScores[topic] / topicQuestions;
    });

    let recommendedLevel: 'beginner' | 'intermediate' | 'advanced';
    if (score >= 80) recommendedLevel = 'advanced';
    else if (score >= 60) recommendedLevel = 'intermediate';
    else recommendedLevel = 'beginner';

    const result: AssessmentResult = {
      score,
      total_questions: questions.length,
      correct_answers: correctAnswers,
      time_taken: timeElapsed,
      topic_scores: topicScores,
      recommended_level: recommendedLevel
    };

    const knowledgeLevel: KnowledgeLevel = {
      overall: recommendedLevel,
      topics: Object.fromEntries(
        Object.entries(topicScores).map(([topic, score]) => [
          topic,
          score >= 80 ? 'advanced' : score >= 60 ? 'intermediate' : 'beginner'
        ])
      ),
      confidence_score: score
    };

    return { result, knowledgeLevel };
  };

  const nextStep = () => {
    if (currentStep === 'intro') {
      setCurrentStep('learning-style');
    } else if (currentStep === 'learning-style') {
      setCurrentStep('knowledge-test');
    } else if (currentStep === 'knowledge-test') {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setCurrentStep('results');
      }
    }
  };

  const completeAssessment = () => {
    const learningStyle = calculateLearningStyle();
    const { result, knowledgeLevel } = calculateResults();
    onComplete(result, learningStyle, knowledgeLevel);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return '👁️';
      case 'auditory': return '👂';
      case 'kinesthetic': return '✋';
      case 'reading_writing': return '📝';
      default: return '🧠';
    }
  };

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className={`bg-${subject.color}-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center`}>
              <Brain className={`h-10 w-10 text-${subject.color}-600`} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎯 Avaliação Diagnóstica
            </h1>
            <h2 className="text-xl text-gray-700 mb-4">{subject.name}</h2>
            <p className="text-gray-600 leading-relaxed">
              Vamos descobrir seu estilo de aprendizagem e nível de conhecimento para personalizar 
              sua experiência educacional! Este teste rápido nos ajudará a criar o melhor plano de estudos para você.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center mb-3">
                <Target className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Estilo de Aprendizagem</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Identificaremos se você aprende melhor de forma visual, auditiva, cinestésica ou através de leitura.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center mb-3">
                <BarChart3 className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-900">Nível de Conhecimento</h3>
              </div>
              <p className="text-green-700 text-sm">
                Avaliaremos seus conhecimentos prévios para recomendar o nível ideal de dificuldade.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-amber-800 font-medium">Tempo estimado: 5-8 minutos</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={nextStep}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Começar Avaliação
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            <button
              onClick={onSkip}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Pular
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'learning-style') {
    const currentQuestion = learningStyleQuestions[currentQuestionIndex] || learningStyleQuestions[0];
    const progress = ((Object.keys(learningStyleAnswers).length) / learningStyleQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">🎨 Estilo de Aprendizagem</h1>
              <span className="text-sm text-gray-500">
                {Object.keys(learningStyleAnswers).length + 1} de {learningStyleQuestions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleLearningStyleAnswer(currentQuestion.id, index);
                    setTimeout(() => {
                      if (Object.keys(learningStyleAnswers).length + 1 === learningStyleQuestions.length) {
                        nextStep();
                      } else {
                        setCurrentQuestionIndex(prev => prev + 1);
                      }
                    }, 300);
                  }}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-4 group-hover:border-blue-500 transition-colors"></div>
                    <span className="text-gray-700 group-hover:text-blue-700">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'knowledge-test') {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">🧠 Teste de Conhecimento</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(timeElapsed)}
                </div>
                <span>{currentQuestionIndex + 1} de {questions.length}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(currentQuestion.difficulty_level)}`}>
                {currentQuestion.difficulty_level === 'beginner' ? 'Iniciante' : 
                 currentQuestion.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </span>
              <span className="ml-3 text-sm text-gray-500">{currentQuestion.topic}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleKnowledgeAnswer(currentQuestion.id, index);
                    setTimeout(nextStep, 300);
                  }}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-4 group-hover:border-blue-500 transition-colors flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <span className="text-gray-700 group-hover:text-blue-700">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    const learningStyle = calculateLearningStyle();
    const { result, knowledgeLevel } = calculateResults();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Avaliação Concluída!
            </h1>
            <p className="text-gray-600">
              Agora sabemos como personalizar sua experiência de aprendizagem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Learning Style Results */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                {getStyleIcon(learningStyle.dominant_style)} Seu Estilo de Aprendizagem
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">👁️ Visual</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${learningStyle.visual}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">{learningStyle.visual}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">👂 Auditivo</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${learningStyle.auditory}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">{learningStyle.auditory}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">✋ Cinestésico</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${learningStyle.kinesthetic}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">{learningStyle.kinesthetic}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">📝 Leitura/Escrita</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${learningStyle.reading_writing}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">{learningStyle.reading_writing}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Estilo Dominante:</strong> {
                    learningStyle.dominant_style === 'visual' ? 'Visual - Você aprende melhor com imagens e diagramas' :
                    learningStyle.dominant_style === 'auditory' ? 'Auditivo - Você aprende melhor ouvindo explicações' :
                    learningStyle.dominant_style === 'kinesthetic' ? 'Cinestésico - Você aprende melhor fazendo atividades práticas' :
                    'Leitura/Escrita - Você aprende melhor lendo e escrevendo'
                  }
                </p>
              </div>
            </div>

            {/* Knowledge Level Results */}
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2" />
                Nível de Conhecimento
              </h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-700 font-medium">Pontuação Geral</span>
                  <span className="text-2xl font-bold text-green-600">{Math.round(result.score)}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Acertos</span>
                  <span className="font-medium">{result.correct_answers}/{result.total_questions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Tempo Total</span>
                  <span className="font-medium">{formatTime(result.time_taken)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Nível Recomendado</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(result.recommended_level)}`}>
                    {result.recommended_level === 'beginner' ? 'Iniciante' : 
                     result.recommended_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-green-800 mb-2">Desempenho por Tópico:</h4>
                <div className="space-y-2">
                  {Object.entries(result.topic_scores).map(([topic, score]) => (
                    <div key={topic} className="flex justify-between items-center text-sm">
                      <span className="text-green-700">{topic}</span>
                      <span className="font-medium">{Math.round(score)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-semibold mb-2">🚀 Pronto para Começar!</h3>
            <p className="mb-4 opacity-90">
              Vamos personalizar sua experiência de aprendizagem com base nos seus resultados
            </p>
            <button
              onClick={completeAssessment}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Iniciar Aprendizagem Personalizada
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DiagnosticAssessment;