CREATE TABLE IF NOT EXISTS public.user_rating_feedback (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  details text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_rating_feedback_email
  ON public.user_rating_feedback(email);
