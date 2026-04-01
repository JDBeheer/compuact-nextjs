-- Migration 002: Booking System Enhancements
-- Adds missing locations, session tracking fields, and incompany support

-- ===== Nieuwe locaties =====
INSERT INTO locaties (naam, stad) VALUES
  ('Alkmaar', 'Alkmaar'),
  ('Almere', 'Almere'),
  ('Hoorn', 'Hoorn'),
  ('Leeuwarden', 'Leeuwarden'),
  ('Leiden', 'Leiden'),
  ('Limburg', 'Limburg'),
  ('Nijmegen', 'Nijmegen'),
  ('Virtueel', 'Virtueel')
ON CONFLICT DO NOTHING;

-- ===== Cursus sessies uitbreidingen =====
-- Training ID voor CSV deduplicatie
ALTER TABLE cursus_sessies ADD COLUMN IF NOT EXISTS training_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_sessies_training_id ON cursus_sessies(training_id) WHERE training_id IS NOT NULL;

-- Meerdere lesdagen per sessie
ALTER TABLE cursus_sessies ADD COLUMN IF NOT EXISTS lesdagen JSONB DEFAULT '[]';

-- ===== Cursussen uitbreidingen =====
ALTER TABLE cursussen ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ===== InCompany type voor inschrijvingen =====
ALTER TABLE inschrijvingen DROP CONSTRAINT IF EXISTS inschrijvingen_type_check;
ALTER TABLE inschrijvingen ADD CONSTRAINT inschrijvingen_type_check
  CHECK (type IN ('inschrijving', 'offerte', 'incompany'));
