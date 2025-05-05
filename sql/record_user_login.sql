
CREATE OR REPLACE FUNCTION public.record_user_login(user_mobile TEXT)
RETURNS VOID AS $$
DECLARE
  user_id TEXT;
BEGIN
  -- Get the user ID from the mobile number
  SELECT id INTO user_id
  FROM public.user_data
  WHERE mobile_number = user_mobile;
  
  -- You could log this to an audit table if you want to track logins
  -- For now, we'll just make a note in the server logs
  RAISE NOTICE 'User % logged in at %', user_id, now();
  
  -- We can update a last_login field if we add one in the future
  -- UPDATE public.user_data SET last_login = now() WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
