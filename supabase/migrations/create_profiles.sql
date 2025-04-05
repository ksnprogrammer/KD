/*
  # Create user profiles table

  This table stores public user profile data linked to the authentication user.

  1. New Tables
     - `profiles`
       - `id` (uuid, primary key, references auth.users.id) - User ID from Supabase Auth.
       - `updated_at` (timestamp with time zone) - Tracks the last update time.
       - `username` (text, unique) - Public username for the user.
       - `full_name` (text) - User's full name.
       - `avatar_url` (text) - URL for the user's avatar image.
       - `level` (integer, default 1) - Current level of the knight character.
       - `wisdom_gems` (integer, default 0) - Currency earned through learning.
       - `gold_coins` (integer, default 0) - Currency earned through challenges/rewards.
       - `language_preference` (text, default 'si') - Preferred language ('si', 'ta', 'en').

  2. Security
     - Enable RLS on `profiles` table.
     - Policy: Allow users to read all profiles.
     - Policy: Allow users to insert their own profile.
     - Policy: Allow users to update their own profile.

  3. Functions
     - `handle_new_user()`: Triggered on new user creation in `auth.users` to automatically create a corresponding profile entry.

  4. Triggers
     - `on_auth_user_created`: Executes `handle_new_user` after a new user is inserted into `auth.users`.
*/

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  level integer DEFAULT 1 NOT NULL CHECK (level > 0),
  wisdom_gems integer DEFAULT 0 NOT NULL CHECK (wisdom_gems >= 0),
  gold_coins integer DEFAULT 0 NOT NULL CHECK (gold_coins >= 0),
  language_preference text DEFAULT 'si' NOT NULL CHECK (language_preference IN ('si', 'ta', 'en')),

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 2. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

-- Set up Storage!
-- Coming soon

-- 4. Function to create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, language_preference)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'language_preference', 'si') -- Default to 'si' if not provided
  );
  RETURN new;
END;
$$;

-- 5. Trigger to call the function after user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Optional: Add comments to columns for clarity
COMMENT ON COLUMN profiles.level IS 'Current level of the knight character';
COMMENT ON COLUMN profiles.wisdom_gems IS 'Currency earned through learning tasks';
COMMENT ON COLUMN profiles.gold_coins IS 'Currency earned through challenges and rewards';
COMMENT ON COLUMN profiles.language_preference IS 'User preferred language (si, ta, en)';