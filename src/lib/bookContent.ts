// Book content retrieval and processing utilities
import { supabase } from './supabase';
import { Book } from '../types';

export interface BookContent {
  id: string;
  title: string;
  author: string;
  content: string;
  relevantSections: string[];
}

/**
 * Fetch books for a specific subject from Supabase
 */
export const getBooksForSubject = async (subjectId: string): Promise<Book[]> => {
  try {
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .eq('subject_id', subjectId);

    if (error) {
      console.error('Error fetching books:', error);
      return [];
    }

    return books || [];
  } catch (error) {
    console.error('Exception fetching books:', error);
    return [];
  }
};

/**
 * Extract content from book file path
 * This is a mock implementation - in production, you would:
 * 1. Read PDF files using libraries like pdf-parse
 * 2. Extract text from various file formats
 * 3. Store processed content in database for faster access
 */
export const extractBookContent = async (filePath: string): Promise<string> => {
  // Mock content based on file path for demonstration
  // In production, this would read actual files
  
  if (filePath.includes('matematica') || filePath.includes('calculo')) {
    return `
    CAPÍTULO 1 - FUNDAMENTOS DE CÁLCULO
    
    O cálculo diferencial e integral é uma das áreas mais importantes da matemática.
    
    1.1 LIMITES
    O conceito de limite é fundamental para o cálculo. Um limite descreve o comportamento de uma função quando a variável independente se aproxima de um determinado valor.
    
    Definição: lim(x→a) f(x) = L significa que f(x) se aproxima de L quando x se aproxima de a.
    
    1.2 DERIVADAS
    A derivada de uma função f(x) em um ponto x = a é definida como:
    f'(a) = lim(h→0) [f(a+h) - f(a)]/h
    
    Regras básicas de derivação:
    - Regra da potência: d/dx(x^n) = n·x^(n-1)
    - Regra da soma: d/dx[f(x) + g(x)] = f'(x) + g'(x)
    - Regra do produto: d/dx[f(x)·g(x)] = f'(x)·g(x) + f(x)·g'(x)
    
    1.3 INTEGRAIS
    A integral é o processo inverso da derivação. A integral indefinida de f(x) é:
    ∫f(x)dx = F(x) + C, onde F'(x) = f(x)
    
    Teorema Fundamental do Cálculo:
    ∫[a,b] f(x)dx = F(b) - F(a)
    `;
  }
  
  if (filePath.includes('fisica') || filePath.includes('mecanica')) {
    return `
    CAPÍTULO 1 - MECÂNICA CLÁSSICA
    
    A mecânica é o ramo da física que estuda o movimento dos corpos e as forças que o causam.
    
    1.1 CINEMÁTICA
    A cinemática descreve o movimento sem considerar suas causas.
    
    Equações do movimento uniformemente acelerado:
    - v = v₀ + at
    - s = v₀t + ½at²
    - v² = v₀² + 2as
    
    1.2 LEIS DE NEWTON
    
    Primeira Lei (Inércia): Um corpo em repouso permanece em repouso, e um corpo em movimento permanece em movimento retilíneo uniforme, a menos que uma força externa atue sobre ele.
    
    Segunda Lei: F = ma
    A força resultante sobre um corpo é igual ao produto de sua massa pela aceleração.
    
    Terceira Lei (Ação e Reação): Para toda ação há uma reação igual e oposta.
    
    1.3 ENERGIA E TRABALHO
    Trabalho: W = F·d·cos(θ)
    Energia Cinética: Ec = ½mv²
    Energia Potencial Gravitacional: Ep = mgh
    
    Princípio da Conservação da Energia:
    Em um sistema isolado, a energia total permanece constante.
    `;
  }
  
  if (filePath.includes('quimica')) {
    return `
    CAPÍTULO 1 - ESTRUTURA ATÔMICA E TABELA PERIÓDICA
    
    A química estuda a composição, estrutura e propriedades da matéria.
    
    1.1 ESTRUTURA ATÔMICA
    O átomo é composto por:
    - Prótons (carga positiva, massa ≈ 1 u)
    - Nêutrons (sem carga, massa ≈ 1 u)
    - Elétrons (carga negativa, massa ≈ 0,0005 u)
    
    Número atômico (Z) = número de prótons
    Número de massa (A) = prótons + nêutrons
    
    1.2 TABELA PERIÓDICA
    Os elementos são organizados por número atômico crescente.
    
    Propriedades periódicas:
    - Raio atômico: diminui da esquerda para direita, aumenta de cima para baixo
    - Energia de ionização: aumenta da esquerda para direita
    - Eletronegatividade: aumenta da esquerda para direita e de baixo para cima
    
    1.3 LIGAÇÕES QUÍMICAS
    - Ligação iônica: transferência de elétrons
    - Ligação covalente: compartilhamento de elétrons
    - Ligação metálica: mar de elétrons
    `;
  }
  
  if (filePath.includes('biologia')) {
    return `
    CAPÍTULO 1 - BIOLOGIA CELULAR
    
    A célula é a unidade básica da vida.
    
    1.1 TIPOS DE CÉLULAS
    
    Células Procarióticas:
    - Sem núcleo definido
    - Material genético disperso no citoplasma
    - Exemplos: bactérias e arqueas
    
    Células Eucarióticas:
    - Núcleo definido por membrana
    - Organelas especializadas
    - Exemplos: células animais e vegetais
    
    1.2 ORGANELAS CELULARES
    
    Núcleo: Controla as atividades celulares, contém DNA
    Mitocôndria: Respiração celular, produção de ATP
    Ribossomos: Síntese de proteínas
    Retículo Endoplasmático: Transporte de substâncias
    Complexo de Golgi: Processamento e empacotamento
    
    1.3 METABOLISMO CELULAR
    
    Respiração Celular:
    C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP
    
    Fotossíntese (plantas):
    6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂
    `;
  }
  
  // Default content for unknown subjects
  return `
  CONTEÚDO EDUCACIONAL
  
  Este é um conteúdo educacional de referência que pode ser usado para responder perguntas sobre diversos tópicos acadêmicos.
  
  O material aborda conceitos fundamentais e aplicações práticas, fornecendo uma base sólida para o aprendizado.
  `;
};

/**
 * Search for relevant content in books based on user question
 */
export const searchRelevantContent = async (
  books: Book[],
  userQuestion: string,
  subjectName: string
): Promise<BookContent[]> => {
  const relevantBooks: BookContent[] = [];
  
  for (const book of books) {
    try {
      // Extract content from book file
      const content = await extractBookContent(book.file_path || '');
      
      // Simple relevance scoring based on keywords
      const questionWords = userQuestion.toLowerCase().split(' ');
      const contentWords = content.toLowerCase();
      
      let relevanceScore = 0;
      const relevantSections: string[] = [];
      
      // Check for keyword matches
      questionWords.forEach(word => {
        if (word.length > 3 && contentWords.includes(word)) {
          relevanceScore++;
        }
      });
      
      // Extract relevant sections (paragraphs containing keywords)
      const paragraphs = content.split('\n\n');
      paragraphs.forEach(paragraph => {
        const hasRelevantKeywords = questionWords.some(word => 
          word.length > 3 && paragraph.toLowerCase().includes(word)
        );
        
        if (hasRelevantKeywords && paragraph.trim().length > 50) {
          relevantSections.push(paragraph.trim());
        }
      });
      
      // If book has relevant content, add it to results
      if (relevanceScore > 0 || relevantSections.length > 0) {
        relevantBooks.push({
          id: book.id,
          title: book.title,
          author: book.author,
          content: content,
          relevantSections: relevantSections.slice(0, 3) // Limit to 3 most relevant sections
        });
      }
    } catch (error) {
      console.error(`Error processing book ${book.title}:`, error);
    }
  }
  
  return relevantBooks;
};

/**
 * Format book content for AI prompt
 */
export const formatBookContentForAI = (bookContents: BookContent[]): string => {
  if (bookContents.length === 0) {
    return 'Nenhum conteúdo específico encontrado nos livros da disciplina.';
  }
  
  let formattedContent = 'CONTEÚDO DOS LIVROS DE REFERÊNCIA:\n\n';
  
  bookContents.forEach((book, index) => {
    formattedContent += `📚 LIVRO ${index + 1}: "${book.title}" - ${book.author}\n`;
    
    if (book.relevantSections.length > 0) {
      formattedContent += 'SEÇÕES RELEVANTES:\n';
      book.relevantSections.forEach((section, sectionIndex) => {
        formattedContent += `${sectionIndex + 1}. ${section}\n\n`;
      });
    } else {
      // If no specific sections, include a summary of the content
      const summary = book.content.substring(0, 500) + '...';
      formattedContent += `RESUMO: ${summary}\n\n`;
    }
    
    formattedContent += '---\n\n';
  });
  
  return formattedContent;
};

/**
 * Get subject name by ID
 */
export const getSubjectName = async (subjectId: string): Promise<string> => {
  try {
    const { data: subject, error } = await supabase
      .from('subjects')
      .select('name')
      .eq('id', subjectId)
      .single();

    if (error) {
      console.error('Error fetching subject:', error);
      return 'Disciplina';
    }

    return subject?.name || 'Disciplina';
  } catch (error) {
    console.error('Exception fetching subject:', error);
    return 'Disciplina';
  }
};