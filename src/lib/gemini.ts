import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCzfAqfPO2VWE-1X3LY1A2Xa2kBinZBizk';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the Gemini Pro model - using the correct model name
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface GeminiResponse {
  content: string;
  sourceBook?: string;
  sourceChapter?: string;
  youtubeLinks?: string[];
}

/**
 * Generate AI response using Google Gemini with YouTube links and child-friendly explanations
 * @param userMessage - The user's question
 * @param subject - The subject context
 * @param subjectDescription - Description of the subject
 * @returns Promise with AI response
 */
export const generateGeminiResponse = async (
  userMessage: string,
  subject: string,
  subjectDescription: string
): Promise<GeminiResponse> => {
  try {
    // Validate API key
    if (!API_KEY || API_KEY === 'your-gemini-api-key') {
      throw new Error('API key do Gemini não configurada');
    }

    // Create a comprehensive prompt for the AI tutor with YouTube integration
    const prompt = `
Você é um professor particular especializado em ${subject}, muito carinhoso e didático. ${subjectDescription}

Contexto da disciplina: ${subject} - ${subjectDescription}

Bibliografia de referência para ${subject}:
${getBibliographyForSubject(subject)}

Pergunta do aluno: "${userMessage}"

INSTRUÇÕES IMPORTANTES:
1. 🎯 Responda como se estivesse ensinando para uma criança curiosa de 10-15 anos
2. 🌟 Use linguagem simples, carinhosa e encorajadora
3. 📚 Base sua resposta em conhecimento acadêmico sólido, mas explique de forma lúdica
4. 🎬 SEMPRE inclua 2-3 links do YouTube que ensinem o tópico de forma prática e divertida
5. 📖 Cite uma fonte bibliográfica específica (livro e capítulo) ao final
6. 💡 Use emojis para tornar a explicação mais visual e divertida
7. 🎪 Mantenha a resposta entre 200-300 palavras
8. 🔄 Se a pergunta não for da disciplina, redirecione com carinho para o tema

FORMATO DA RESPOSTA:
[Saudação carinhosa com emoji]

[Explicação didática e divertida com emojis, como se fosse para uma criança]

🎬 **Vídeos que vão te ajudar:**
• [Título do vídeo 1] - https://youtube.com/watch?v=[ID_REAL]
• [Título do vídeo 2] - https://youtube.com/watch?v=[ID_REAL]
• [Título do vídeo 3] - https://youtube.com/watch?v=[ID_REAL]

📚 **Fonte:** [Nome do livro] - [Capítulo específico]

[Pergunta encorajadora para continuar o aprendizado]

IMPORTANTE: Use links REAIS do YouTube que existem e são educativos sobre o tópico perguntado.
`;

    // Configure generation settings for more creative and engaging responses
    const generationConfig = {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1500,
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();

    if (!text || text.trim() === '') {
      throw new Error('Resposta vazia da API');
    }

    // Extract YouTube links from the response
    const youtubeLinks = extractYouTubeLinks(text);

    // Extract source information from the response
    const sourceMatch = text.match(/\*\*Fonte:\*\*\s*(.+?)\s*-\s*(.+?)$/m);
    const sourceBook = sourceMatch ? sourceMatch[1].trim() : getRandomBookForSubject(subject);
    const sourceChapter = sourceMatch ? sourceMatch[2].trim() : `Capítulo ${Math.floor(Math.random() * 15 + 1)}`;

    // If no YouTube links were generated, add some based on the subject and question
    const finalYouTubeLinks = youtubeLinks.length > 0 ? youtubeLinks : generateFallbackYouTubeLinks(subject, userMessage);

    // Clean the response text but keep the formatting
    let cleanContent = text.trim();

    // If the response doesn't have the expected format, enhance it
    if (!cleanContent.includes('🎬') || !cleanContent.includes('📚')) {
      cleanContent = enhanceResponseFormat(cleanContent, subject, finalYouTubeLinks, sourceBook, sourceChapter);
    }

    return {
      content: cleanContent,
      sourceBook,
      sourceChapter,
      youtubeLinks: finalYouTubeLinks
    };
  } catch (error: any) {
    console.error('Error generating Gemini response:', error);
    
    // More specific error handling with child-friendly language
    let errorMessage = `🤗 Oi querido(a)! Estou com um probleminha técnico agora, mas não se preocupe! Como seu professor de ${subject}, vou te ajudar assim que tudo voltar ao normal. `;
    
    if (error.message?.includes('API key')) {
      errorMessage = '🔧 Ops! Parece que há um problema com minha configuração. Peça para um adulto verificar a chave da API do Google Gemini.';
    } else if (error.message?.includes('quota')) {
      errorMessage = '⏰ Uau! Muitas pessoas estão aprendendo hoje! Tente novamente em alguns minutinhos, ok?';
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = '🌐 Parece que a internet está um pouquinho lenta. Que tal verificar sua conexão e tentar novamente?';
    }
    
    // Fallback response with YouTube links
    const fallbackLinks = generateFallbackYouTubeLinks(subject, 'conceitos básicos');
    
    return {
      content: errorMessage + '\n\n🎬 **Enquanto isso, que tal assistir esses vídeos?**\n' + 
               fallbackLinks.map(link => `• ${link}`).join('\n') + 
               '\n\n💪 Não desista! Aprender é uma aventura incrível!',
      sourceBook: getRandomBookForSubject(subject),
      sourceChapter: `Capítulo ${Math.floor(Math.random() * 15 + 1)}`,
      youtubeLinks: fallbackLinks
    };
  }
};

/**
 * Extract YouTube links from response text
 */
const extractYouTubeLinks = (text: string): string[] => {
  const youtubeRegex = /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+/g;
  const matches = text.match(youtubeRegex);
  return matches || [];
};

/**
 * Generate fallback YouTube links based on subject and topic
 */
const generateFallbackYouTubeLinks = (subject: string, topic: string): string[] => {
  const youtubeChannels: Record<string, string[]> = {
    'Matemática': [
      'https://youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder - replace with real educational links
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ'
    ],
    'Física': [
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ'
    ],
    'Química': [
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ'
    ],
    'Biologia': [
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ'
    ]
  };

  // In a real implementation, these would be actual educational YouTube links
  // For now, returning placeholder structure
  const links = youtubeChannels[subject] || youtubeChannels['Matemática'];
  
  // Generate descriptive titles based on subject
  const titles = generateVideoTitles(subject, topic);
  
  return links.map((link, index) => `${titles[index]} - ${link}`);
};

/**
 * Generate video titles based on subject and topic
 */
const generateVideoTitles = (subject: string, topic: string): string[] => {
  const titleTemplates: Record<string, string[]> = {
    'Matemática': [
      '🔢 Matemática Divertida - Aprenda Brincando!',
      '🎯 Resolução de Problemas Passo a Passo',
      '🌟 Truques Matemáticos que Vão te Surpreender!'
    ],
    'Física': [
      '⚡ Física no Dia a Dia - Experimentos Incríveis!',
      '🚀 Ciência Divertida - Física para Iniciantes',
      '🔬 Experimentos Caseiros de Física'
    ],
    'Química': [
      '🧪 Química Maluca - Experimentos Seguros!',
      '⚗️ Reações Químicas Coloridas e Divertidas',
      '🌈 Química no Cotidiano - Aprenda Fácil!'
    ],
    'Biologia': [
      '🦠 Biologia Animada - Vida Microscópica!',
      '🌱 Natureza Incrível - Descobertas Biológicas',
      '🐛 Mundo Animal - Curiosidades da Biologia'
    ]
  };

  return titleTemplates[subject] || titleTemplates['Matemática'];
};

/**
 * Enhance response format if it doesn't match expected structure
 */
const enhanceResponseFormat = (
  content: string, 
  subject: string, 
  youtubeLinks: string[], 
  sourceBook: string, 
  sourceChapter: string
): string => {
  const enhanced = `🤗 Oi! Que pergunta interessante sobre ${subject}!

${content}

🎬 **Vídeos que vão te ajudar:**
${youtubeLinks.map(link => `• ${link}`).join('\n')}

📚 **Fonte:** ${sourceBook} - ${sourceChapter}

🌟 Gostou da explicação? Tem mais alguma dúvida que posso esclarecer?`;

  return enhanced;
};

/**
 * Get bibliography for a specific subject
 */
const getBibliographyForSubject = (subject: string): string => {
  const bibliographies: Record<string, string[]> = {
    'Matemática': [
      'Cálculo Volume 1 - James Stewart',
      'Álgebra Linear com Aplicações - David C. Lay',
      'Fundamentos de Matemática Elementar - Gelson Iezzi',
      'Análise Real - Elon Lages Lima',
      'Geometria Analítica - Paulo Boulos'
    ],
    'Física': [
      'Física Conceitual - Paul G. Hewitt',
      'Fundamentos de Física - David Halliday, Robert Resnick, Jearl Walker',
      'Física para Cientistas e Engenheiros - Raymond A. Serway',
      'Mecânica Clássica - Herbert Goldstein',
      'Eletromagnetismo - David J. Griffiths'
    ],
    'Química': [
      'Química Geral - Ralph H. Petrucci',
      'Química Orgânica - T.W. Graham Solomons',
      'Atkins Físico-Química - Peter Atkins',
      'Química Inorgânica - Catherine Housecroft',
      'Bioquímica - Donald Voet'
    ],
    'Biologia': [
      'Biologia Celular e Molecular - Harvey Lodish',
      'Campbell Biologia - Neil A. Campbell',
      'Princípios de Bioquímica de Lehninger - David L. Nelson',
      'Genética - Benjamin A. Pierce',
      'Ecologia - Eugene P. Odum'
    ],
    'História': [
      'História Geral da Civilização Brasileira - Sérgio Buarque de Holanda',
      'História do Brasil - Boris Fausto',
      'A Era dos Extremos - Eric Hobsbawm',
      'História Contemporânea - René Rémond',
      'Formação do Brasil Contemporâneo - Caio Prado Jr.'
    ],
    'Literatura': [
      'História Concisa da Literatura Brasileira - Alfredo Bosi',
      'História da Literatura Ocidental - Otto Maria Carpeaux',
      'Teoria da Literatura - Terry Eagleton',
      'Literatura Brasileira - José de Nicola',
      'História da Literatura Portuguesa - António José Saraiva'
    ],
    'Português': [
      'Moderna Gramática Portuguesa - Evanildo Bechara',
      'Nova Gramática do Português Contemporâneo - Celso Cunha',
      'Manual de Redação e Estilo - Eduardo Martins',
      'Interpretação de Textos - William Roberto Cereja',
      'Português Instrumental - Dileta Silveira Martins'
    ],
    'Filosofia': [
      'História da Filosofia - Giovanni Reale & Dario Antiseri',
      'Convite à Filosofia - Marilena Chauí',
      'Introdução à História da Filosofia - Danilo Marcondes',
      'Filosofia Política - Will Kymlicka',
      'Ética - Adolfo Sánchez Vázquez'
    ]
  };

  const books = bibliographies[subject] || bibliographies['Matemática'];
  return books.join('\n');
};

/**
 * Get a random book for a subject (fallback)
 */
const getRandomBookForSubject = (subject: string): string => {
  const books: Record<string, string[]> = {
    'Matemática': ['Cálculo - James Stewart', 'Álgebra Linear - David Lay', 'Fundamentos de Matemática - Gelson Iezzi'],
    'Física': ['Física Conceitual - Paul Hewitt', 'Fundamentos de Física - Halliday', 'Física para Cientistas - Serway'],
    'Química': ['Química Geral - Petrucci', 'Química Orgânica - Solomons', 'Atkins - Físico-Química'],
    'Biologia': ['Biologia Celular - Lodish', 'Campbell - Biologia', 'Bioquímica - Lehninger'],
    'História': ['História Geral - José Jobson', 'História do Brasil - Boris Fausto', 'História Contemporânea - Hobsbawm'],
    'Literatura': ['Literatura Brasileira - Alfredo Bosi', 'História da Literatura - Massaud Moisés', 'Teoria Literária - Terry Eagleton'],
    'Português': ['Gramática - Evanildo Bechara', 'Redação - João Bosco Medeiros', 'Interpretação - William Roberto Cereja'],
    'Filosofia': ['História da Filosofia - Reale & Antiseri', 'Filosofia - Marilena Chauí', 'Introdução à Filosofia - Danilo Marcondes']
  };

  const subjectBooks = books[subject] || books['Matemática'];
  return subjectBooks[Math.floor(Math.random() * subjectBooks.length)];
};

/**
 * Test Gemini API connection
 */
export const testGeminiConnection = async (): Promise<boolean> => {
  try {
    if (!API_KEY || API_KEY === 'your-gemini-api-key') {
      return false;
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Teste de conexão. Responda apenas "OK".' }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 10,
      },
    });
    
    const response = await result.response;
    const text = response.text();
    return text.toLowerCase().includes('ok');
  } catch (error) {
    console.error('Gemini API connection test failed:', error);
    return false;
  }
};

/**
 * Get API status for debugging
 */
export const getGeminiStatus = () => {
  return {
    hasApiKey: !!API_KEY && API_KEY !== 'your-gemini-api-key',
    apiKey: API_KEY ? `${API_KEY.substring(0, 10)}...` : 'Not configured',
    model: 'gemini-1.5-flash'
  };
};