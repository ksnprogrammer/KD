/*
  # Update handle_new_user function

  This migration updates the `handle_new_user` function to include the `username`
  when creating a new profile entry. It retrieves the username from the
  `raw_user_meta_data` provided during signup.

  1. Modified Functions
     - `handle_new_user()`: Now inserts `username` along with other profile details.

  2. Notes
     - Assumes `username` is passed in `auth.signUp` options under `data: { username: '...' }`.
     - Keeps the COALESCE for `language_preference` to default to 'si'.
*/

-- Update function to include username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, username, language_preference)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username', -- Add username insertion
    COALESCE(new.raw_user_meta_data->>'language_preference', 'si')
  );
  RETURN new;
END;
$$;