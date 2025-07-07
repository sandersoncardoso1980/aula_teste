# AI Tutors - Plataforma SaaS Educacional

Uma plataforma revolucionária de professores particulares com IA, onde cada professor é um agente especializado em sua disciplina específica.

## 🚀 Funcionalidades

### Core Features
- **Professores IA Especializados**: Cada disciplina possui um agente de IA treinado especificamente
- **Chat Inteligente**: Interface estilo ChatGPT para interação natural
- **Bibliografia Acadêmica**: Respostas baseadas em livros universitários com citações
- **Autenticação Completa**: Sistema de login/cadastro via Supabase
- **Dashboard Interativo**: Histórico de conversas e seleção de disciplinas
- **Design Responsivo**: Otimizado para desktop, tablet e mobile

### Disciplinas Disponíveis
- Matemática (Álgebra, Cálculo, Geometria, Estatística)
- Física (Mecânica, Termodinâmica, Eletromagnetismo)
- Química (Geral, Orgânica, Inorgânica)
- Biologia (Celular, Genética, Ecologia)
- História (Geral, do Brasil, Contemporânea)
- Literatura (Brasileira, Portuguesa, Mundial)
- Português (Gramática, Redação, Interpretação)
- Filosofia (Antiga, Moderna, Contemporânea)

## 🛠 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Build Tool**: Vite

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o Supabase:
   - Crie um projeto no [Supabase](https://supabase.com)
   - Obtenha suas chaves de API
   - Clique em "Connect to Supabase" no canto superior direito da aplicação

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🗄 Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas principais:

- `users` - Usuários da plataforma
- `subjects` - Disciplinas disponíveis
- `books` - Livros de referência por disciplina
- `conversations` - Histórico de conversas
- `messages` - Mensagens individuais do chat

## 👥 Usuários de Teste

Para demonstração, utilize as seguintes credenciais:

- **Email**: aluno@teste.com
- **Senha**: senha123

## 🎯 Funcionalidades Futuras

- Integração com APIs de LLM reais (OpenAI, Anthropic)
- Upload e processamento de PDFs
- Funcionalidades de voz e vídeo
- Sistema de assinaturas e pagamentos
- Analytics e relatórios de progresso
- Modo offline para revisões

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Dashboard.tsx
│   ├── ChatInterface.tsx
│   └── ...
├── contexts/           # Contextos React
│   └── AuthContext.tsx
├── lib/               # Utilitários e configurações
│   └── supabase.ts
├── types/             # Definições TypeScript
│   └── index.ts
└── App.tsx            # Componente principal
```

## 🚀 Deploy

O projeto está configurado para deploy fácil em plataformas como:
- Vercel
- Netlify
- Supabase Hosting

## 📝 Licença

Este projeto foi desenvolvido como MVP para demonstração e apresentação a investidores.

## 🤝 Contribuição

Este é um projeto de demonstração. Para sugestões ou melhorias, entre em contato através dos canais disponíveis.

---

**AI Tutors** - Revolucionando a educação com inteligência artificial 🎓