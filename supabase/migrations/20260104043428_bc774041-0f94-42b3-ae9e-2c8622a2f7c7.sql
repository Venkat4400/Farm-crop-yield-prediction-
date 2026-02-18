-- Alter table to accommodate new dataset format
-- Make columns nullable that won't be in the new dataset
ALTER TABLE public.crop_yield_data 
  ALTER COLUMN temperature DROP NOT NULL,
  ALTER COLUMN humidity DROP NOT NULL,
  ALTER COLUMN soil_type DROP NOT NULL,
  ALTER COLUMN region DROP NOT NULL;

-- Add new columns for the comprehensive dataset
ALTER TABLE public.crop_yield_data
  ADD COLUMN IF NOT EXISTS production numeric,
  ADD COLUMN IF NOT EXISTS pesticide numeric,
  ADD COLUMN IF NOT EXISTS annual_rainfall numeric;

-- Update rainfall column to use annual_rainfall for consistency
-- Delete all existing data to replace with new dataset
DELETE FROM public.crop_yield_data;