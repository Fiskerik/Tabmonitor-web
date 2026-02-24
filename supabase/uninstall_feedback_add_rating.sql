-- Add optional 1-5 rating for uninstall feedback
ALTER TABLE public.uninstall_feedback
ADD COLUMN IF NOT EXISTS rating smallint;

-- Keep ratings in expected range when present
ALTER TABLE public.uninstall_feedback
ADD CONSTRAINT uninstall_feedback_rating_range
CHECK (rating IS NULL OR rating BETWEEN 1 AND 5);
