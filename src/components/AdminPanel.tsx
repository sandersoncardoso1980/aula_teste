import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload, BookOpen, FileText, Trash2, Download, Search, Filter, Plus, AlertCircle, CheckCircle, X, Users, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { Subject, Book } from '../types';
import { supabase, getSupabaseStatus } from '../lib/supabase';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'subjects' | 'upload' | 'users' | 'analytics'>('overview');
  const [books, setBooks] = useState<Book[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for new book
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    subject_id: '',
    file: null as File | null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Check if Supabase is configured
      const supabaseStatus = getSupabaseStatus();
      if (!supabaseStatus.isConfigured) {
        // Use mock data when Supabase is not configured
        setSubjects([
          { id: '1', name: 'Matemática', description: 'Álgebra, Cálculo, Geometria', icon: 'Calculator', color: 'blue', agent_description: 'Professor de matemática', created_at: new Date().toISOString() },
          { id: '2', name: 'Física', description: 'Mecânica, Termodinâmica', icon: 'Atom', color: 'green', agent_description: 'Professor de física', created_at: new Date().toISOString() },
          { id: '3', name: 'Química', description: 'Química Geral, Orgânica', icon: 'Flask', color: 'purple', agent_description: 'Professor de química', created_at: new Date().toISOString() },
          { id: '4', name: 'Biologia', description: 'Biologia Celular, Genética', icon: 'Dna', color: 'emerald', agent_description: 'Professor de biologia', created_at: new Date().toISOString() }
        ]);
        setBooks([
          { id: '1', title: 'Cálculo Volume 1', author: 'James Stewart', subject_id: '1', file_path: '/books/calculo.pdf', created_at: new Date().toISOString() },
          { id: '2', title: 'Física Conceitual', author: 'Paul Hewitt', subject_id: '2', file_path: '/books/fisica.pdf', created_at: new Date().toISOString() },
          { id: '3', title: 'Química Geral', author: 'Petrucci', subject_id: '3', file_path: '/books/quimica.pdf', created_at: new Date().toISOString() }
        ]);
        setUsers([
          { id: '1', email: 'aluno@teste.com', name: 'Aluno Teste', role: 'student', created_at: new Date().toISOString() },
          { id: '2', email: 'admin@teste.com', name: 'Admin Teste', role: 'admin', created_at: new Date().toISOString() }
        ]);
        setConversations([
          { id: '1', title: 'Derivadas e Integrais', user_id: '1', subject_id: '1', created_at: new Date().toISOString() },
          { id: '2', title: 'Leis de Newton', user_id: '1', subject_id: '2', created_at: new Date().toISOString() }
        ]);
        setLoading(false);
        return;
      }

      // Load subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (subjectsError) throw subjectsError;
      setSubjects(subjectsData || []);

      // Load books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select(`
          *,
          subjects (
            name,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;
      setBooks(booksData || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      setUploadMessage('Erro ao carregar dados: ' + error.message);
      setUploadStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBook.file || !newBook.title || !newBook.author || !newBook.subject_id) {
      setUploadMessage('Por favor, preencha todos os campos e selecione um arquivo');
      setUploadStatus('error');
      return;
    }

    // Check if Supabase is configured
    const supabaseStatus = getSupabaseStatus();
    if (!supabaseStatus.isConfigured) {
      setUploadMessage('Funcionalidade de upload requer configuração do Supabase');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = newBook.file.name.split('.').pop();
      const fileName = `${Date.now()}-${newBook.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `books/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, newBook.file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          }
        });

      if (uploadError) throw uploadError;

      // Insert book record into database
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .insert([
          {
            title: newBook.title,
            author: newBook.author,
            subject_id: newBook.subject_id,
            file_path: uploadData.path
          }
        ])
        .select()
        .single();

      if (bookError) throw bookError;

      setUploadStatus('success');
      setUploadMessage('Livro carregado com sucesso!');
      
      // Reset form
      setNewBook({
        title: '',
        author: '',
        subject_id: '',
        file: null
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Reload data
      loadData();

      // Clear status after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 3000);

    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
      setUploadMessage('Erro ao carregar arquivo: ' + error.message);
    }
  };

  const handleDeleteBook = async (bookId: string, filePath: string) => {
    if (!confirm('Tem certeza que deseja excluir este livro?')) return;

    // Check if Supabase is configured
    const supabaseStatus = getSupabaseStatus();
    if (!supabaseStatus.isConfigured) {
      setUploadMessage('Funcionalidade de exclusão requer configuração do Supabase');
      setUploadStatus('error');
      return;
    }

    try {
      // Delete file from storage
      if (filePath) {
        await supabase.storage
          .from('documents')
          .remove([filePath]);
      }

      // Delete book record
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      setUploadMessage('Livro excluído com sucesso!');
      setUploadStatus('success');
      loadData();

      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 3000);

    } catch (error: any) {
      console.error('Error deleting book:', error);
      setUploadMessage('Erro ao excluir livro: ' + error.message);
      setUploadStatus('error');
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || book.subject_id === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <div className="bg-purple-100 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                🛡️ Painel Administrativo
              </h1>
              <p className="text-sm text-gray-600">
                Gerenciar sistema, usuários e conteúdo educacional
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {getSupabaseStatus().isConfigured ? '🟢 Sistema Online' : '🟡 Modo Demo'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {uploadMessage && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            uploadStatus === 'success' ? 'bg-green-50 border border-green-200' :
            uploadStatus === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            {uploadStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {uploadStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            <span className={`text-sm font-medium ${
              uploadStatus === 'success' ? 'text-green-800' :
              uploadStatus === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {uploadMessage}
            </span>
            <button
              onClick={() => {
                setUploadStatus('idle');
                setUploadMessage('');
              }}
              className="ml-auto"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📊 Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('books')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'books'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📚 Livros ({books.length})
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ⬆️ Upload de Livros
              </button>
              <button
                onClick={() => setActiveTab('subjects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'subjects'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🎯 Disciplinas ({subjects.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                👥 Usuários ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📈 Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-600">{books.length}</span>
                    </div>
                    <h3 className="font-semibold text-blue-900">Livros</h3>
                    <p className="text-sm text-blue-700">Total de livros no sistema</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <Settings className="h-8 w-8 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">{subjects.length}</span>
                    </div>
                    <h3 className="font-semibold text-green-900">Disciplinas</h3>
                    <p className="text-sm text-green-700">Disciplinas disponíveis</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="h-8 w-8 text-purple-600" />
                      <span className="text-2xl font-bold text-purple-600">{users.length}</span>
                    </div>
                    <h3 className="font-semibold text-purple-900">Usuários</h3>
                    <p className="text-sm text-purple-700">Usuários registrados</p>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <MessageSquare className="h-8 w-8 text-orange-600" />
                      <span className="text-2xl font-bold text-orange-600">{conversations.length}</span>
                    </div>
                    <h3 className="font-semibold text-orange-900">Conversas</h3>
                    <p className="text-sm text-orange-700">Conversas ativas</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Livros por Disciplina</h3>
                    <div className="space-y-3">
                      {subjects.map(subject => {
                        const subjectBooks = books.filter(book => book.subject_id === subject.id);
                        return (
                          <div key={subject.id} className="flex justify-between items-center">
                            <span className="text-gray-700">{subject.name}</span>
                            <span className="font-medium text-gray-900">{subjectBooks.length} livros</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Usuários por Tipo</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">👨‍🎓 Estudantes</span>
                        <span className="font-medium text-gray-900">
                          {users.filter(user => user.role === 'student').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">🛡️ Administradores</span>
                        <span className="font-medium text-gray-900">
                          {users.filter(user => user.role === 'admin').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Books Tab */}
            {activeTab === 'books' && (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por título ou autor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">Todas as disciplinas</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Books Grid */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando livros...</p>
                  </div>
                ) : filteredBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum livro encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBooks.map((book: any) => (
                      <div key={book.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`bg-${book.subjects?.color || 'blue'}-100 p-2 rounded-lg`}>
                            <FileText className={`h-5 w-5 text-${book.subjects?.color || 'blue'}-600`} />
                          </div>
                          <button
                            onClick={() => handleDeleteBook(book.id, book.file_path)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          por {book.author}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          {book.subjects?.name || 'Disciplina não encontrada'}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {new Date(book.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          {book.file_path && (
                            <button
                              onClick={() => {
                                // In a real implementation, you'd generate a signed URL
                                console.log('Download:', book.file_path);
                              }}
                              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                            >
                              <Download className="h-3 w-3" />
                              <span>Download</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <Upload className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Upload de Livros PDF
                  </h2>
                  <p className="text-gray-600">
                    Adicione livros em PDF para enriquecer a base de conhecimento da IA
                  </p>
                </div>

                <form onSubmit={handleFileUpload} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Livro
                    </label>
                    <input
                      type="text"
                      value={newBook.title}
                      onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: Cálculo Volume 1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Autor
                    </label>
                    <input
                      type="text"
                      value={newBook.author}
                      onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: James Stewart"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disciplina
                    </label>
                    <select
                      value={newBook.subject_id}
                      onChange={(e) => setNewBook(prev => ({ ...prev, subject_id: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione uma disciplina</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arquivo PDF
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewBook(prev => ({ ...prev, file }));
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                        required
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {newBook.file ? newBook.file.name : 'Clique para selecionar um arquivo PDF'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Máximo 50MB
                        </p>
                      </label>
                    </div>
                  </div>

                  {uploadStatus === 'uploading' && (
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Enviando...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploadStatus === 'uploading'}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadStatus === 'uploading' ? 'Enviando...' : 'Fazer Upload do Livro'}
                  </button>
                </form>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Gerenciar Usuários</h2>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Novo Usuário</span>
                  </button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data de Cadastro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                              }`}>
                                {user.role === 'admin' ? '🛡️' : '👨‍🎓'}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? 'Administrador' : 'Estudante'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-purple-600 hover:text-purple-900 mr-3">
                              Editar
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">📈 Analytics e Relatórios</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Uso por Disciplina</h3>
                    <div className="space-y-4">
                      {subjects.map(subject => {
                        const subjectConversations = conversations.filter(conv => conv.subject_id === subject.id);
                        const percentage = conversations.length > 0 ? (subjectConversations.length / conversations.length) * 100 : 0;
                        return (
                          <div key={subject.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{subject.name}</span>
                              <span className="text-gray-900 font-medium">{subjectConversations.length} conversas</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-${subject.color}-600 h-2 rounded-full`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Métricas Gerais</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Taxa de Engajamento</span>
                        <span className="font-medium text-green-600">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Tempo Médio por Sessão</span>
                        <span className="font-medium text-blue-600">12 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Satisfação dos Usuários</span>
                        <span className="font-medium text-purple-600">4.8/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Conversas por Dia</span>
                        <span className="font-medium text-orange-600">24</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">📈 Crescimento do Sistema</h3>
                  <p className="text-gray-600 mb-4">
                    O sistema está crescendo consistentemente com novos usuários e maior engajamento.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">+15%</div>
                      <div className="text-sm text-gray-600">Novos usuários</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">+28%</div>
                      <div className="text-sm text-gray-600">Conversas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">+12%</div>
                      <div className="text-sm text-gray-600">Tempo de uso</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subjects Tab */}
            {activeTab === 'subjects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Gerenciar Disciplinas</h2>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Nova Disciplina</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map(subject => (
                    <div key={subject.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className={`bg-${subject.color}-100 p-3 rounded-lg w-fit mb-3`}>
                        <BookOpen className={`h-6 w-6 text-${subject.color}-600`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {subject.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{books.filter(book => book.subject_id === subject.id).length} livros</span>
                        <div className="flex space-x-2">
                          <button className="text-purple-600 hover:text-purple-700">Editar</button>
                          <button className="text-red-600 hover:text-red-700">Excluir</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;