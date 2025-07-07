/*
  # Create AI Tutors Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `role` (text, default 'student')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `color` (text)
      - `agent_description` (text)
      - `created_at` (timestamp)
    
    - `books`
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `subject_id` (uuid, foreign key)
      - `file_path` (text)
      - `created_at` (timestamp)
    
    - `conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `subject_id` (uuid, foreign key)
      - `title` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `content` (text)
      - `is_ai` (boolean)
      - `source_book` (text)
      - `source_chapter` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for user data access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'BookOpen',
  color text NOT NULL DEFAULT 'blue',
  agent_description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  file_path text,
  created_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_ai boolean DEFAULT false,
  source_book text,
  source_chapter text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Subjects policies (public read)
CREATE POLICY "Anyone can read subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Books policies (public read)
CREATE POLICY "Anyone can read books"
  ON books
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify books"
  ON books
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Conversations policies
CREATE POLICY "Users can read own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON conversations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can read messages from own conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default subjects
INSERT INTO subjects (name, description, icon, color, agent_description) VALUES
  ('Matemática', 'Álgebra, Cálculo, Geometria e Estatística', 'BookOpen', 'blue', 'Especialista em matemática com foco em explicações claras e passo a passo, baseado em livros acadêmicos renomados.'),
  ('Física', 'Mecânica, Termodinâmica, Eletromagnetismo', 'MessageCircle', 'green', 'Professor de física com experiência em aplicações práticas e teóricas, consultando referências acadêmicas de qualidade.'),
  ('Química', 'Química Geral, Orgânica e Inorgânica', 'Users', 'purple', 'Especialista em química com foco em reações e processos químicos, baseado em livros universitários.'),
  ('Biologia', 'Biologia Celular, Genética, Ecologia', 'BookOpen', 'emerald', 'Professor de biologia com expertise em ciências da vida, consultando bibliografia científica atualizada.');

-- Insert sample books
INSERT INTO books (title, author, subject_id) VALUES
  ('Cálculo Volume 1', 'James Stewart', (SELECT id FROM subjects WHERE name = 'Matemática')),
  ('Álgebra Linear com Aplicações', 'David C. Lay', (SELECT id FROM subjects WHERE name = 'Matemática')),
  ('Fundamentos de Matemática Elementar', 'Gelson Iezzi', (SELECT id FROM subjects WHERE name = 'Matemática')),
  ('Física Conceitual', 'Paul G. Hewitt', (SELECT id FROM subjects WHERE name = 'Física')),
  ('Fundamentos de Física', 'David Halliday', (SELECT id FROM subjects WHERE name = 'Física')),
  ('Física para Cientistas e Engenheiros', 'Raymond A. Serway', (SELECT id FROM subjects WHERE name = 'Física')),
  ('Química Geral', 'Ralph H. Petrucci', (SELECT id FROM subjects WHERE name = 'Química')),
  ('Química Orgânica', 'T.W. Graham Solomons', (SELECT id FROM subjects WHERE name = 'Química')),
  ('Atkins Físico-Química', 'Peter Atkins', (SELECT id FROM subjects WHERE name = 'Química')),
  ('Biologia Celular e Molecular', 'Harvey Lodish', (SELECT id FROM subjects WHERE name = 'Biologia')),
  ('Campbell Biologia', 'Neil A. Campbell', (SELECT id FROM subjects WHERE name = 'Biologia')),
  ('Princípios de Bioquímica de Lehninger', 'David L. Nelson', (SELECT id FROM subjects WHERE name = 'Biologia'));