-- Compu Act Opleidingen - Database Schema

-- Categorieën
CREATE TABLE categorieen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  naam TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  volgorde INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Locaties
CREATE TABLE locaties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  naam TEXT NOT NULL,
  stad TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cursussen
CREATE TABLE cursussen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  titel TEXT NOT NULL,
  beschrijving TEXT NOT NULL DEFAULT '',
  korte_beschrijving TEXT NOT NULL DEFAULT '',
  afbeelding TEXT,
  categorie_id UUID REFERENCES categorieen(id) ON DELETE SET NULL,
  prijs_vanaf DECIMAL(10,2) NOT NULL DEFAULT 0,
  inhoud JSONB DEFAULT '{}',
  duur TEXT DEFAULT '1 dag',
  niveau TEXT NOT NULL DEFAULT 'beginner' CHECK (niveau IN ('beginner', 'gevorderd', 'expert')),
  actief BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cursus sessies
CREATE TABLE cursus_sessies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cursus_id UUID NOT NULL REFERENCES cursussen(id) ON DELETE CASCADE,
  locatie_id UUID REFERENCES locaties(id) ON DELETE SET NULL,
  datum DATE NOT NULL,
  tijden TEXT DEFAULT '10:00 - 16:30',
  prijs DECIMAL(10,2) NOT NULL DEFAULT 0,
  lesmethode TEXT NOT NULL DEFAULT 'klassikaal' CHECK (lesmethode IN ('klassikaal', 'online', 'thuisstudie', 'incompany')),
  capaciteit INT DEFAULT 8,
  actief BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inschrijvingen (ook offertes)
CREATE TABLE inschrijvingen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'inschrijving' CHECK (type IN ('inschrijving', 'offerte')),
  cursussen JSONB NOT NULL DEFAULT '[]',
  klantgegevens JSONB NOT NULL DEFAULT '{}',
  totaalprijs DECIMAL(10,2) DEFAULT 0,
  email_verzonden BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'nieuw' CHECK (status IN ('nieuw', 'verwerkt', 'geannuleerd')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  naam TEXT NOT NULL,
  bedrijf TEXT DEFAULT '',
  tekst TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  actief BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site settings
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===== RLS Policies =====

ALTER TABLE categorieen ENABLE ROW LEVEL SECURITY;
ALTER TABLE locaties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursussen ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursus_sessies ENABLE ROW LEVEL SECURITY;
ALTER TABLE inschrijvingen ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Publieke leestoegang
CREATE POLICY "Publieke leestoegang categorieen" ON categorieen FOR SELECT USING (true);
CREATE POLICY "Publieke leestoegang locaties" ON locaties FOR SELECT USING (true);
CREATE POLICY "Publieke leestoegang cursussen" ON cursussen FOR SELECT USING (actief = true);
CREATE POLICY "Publieke leestoegang sessies" ON cursus_sessies FOR SELECT USING (actief = true);
CREATE POLICY "Publieke leestoegang testimonials" ON testimonials FOR SELECT USING (actief = true);
CREATE POLICY "Publieke leestoegang settings" ON site_settings FOR SELECT USING (true);

-- Anonieme inserts voor inschrijvingen
CREATE POLICY "Anonieme insert inschrijvingen" ON inschrijvingen FOR INSERT WITH CHECK (true);

-- Service role volledige toegang (via supabase service key)
CREATE POLICY "Service role cursussen" ON cursussen FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role sessies" ON cursus_sessies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role categorieen" ON categorieen FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role locaties" ON locaties FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role inschrijvingen" ON inschrijvingen FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- ===== Indexes =====
CREATE INDEX idx_cursussen_slug ON cursussen(slug);
CREATE INDEX idx_cursussen_categorie ON cursussen(categorie_id);
CREATE INDEX idx_sessies_cursus ON cursus_sessies(cursus_id);
CREATE INDEX idx_sessies_datum ON cursus_sessies(datum);
CREATE INDEX idx_inschrijvingen_type ON inschrijvingen(type);
CREATE INDEX idx_inschrijvingen_status ON inschrijvingen(status);

-- ===== Seed data =====

-- Categorieën
INSERT INTO categorieen (naam, slug, volgorde) VALUES
  ('Excel', 'excel', 1),
  ('Word', 'word', 2),
  ('Office 365', 'office-365', 3),
  ('Outlook', 'outlook', 4),
  ('PowerPoint', 'powerpoint', 5),
  ('Power BI', 'power-bi', 6),
  ('Project', 'project', 7),
  ('AI', 'ai', 8),
  ('Visio', 'visio', 9);

-- Locaties
INSERT INTO locaties (naam, stad) VALUES
  ('Amsterdam', 'Amsterdam'),
  ('Rotterdam', 'Rotterdam'),
  ('Utrecht', 'Utrecht'),
  ('Den Haag', 'Den Haag'),
  ('Eindhoven', 'Eindhoven'),
  ('Groningen', 'Groningen'),
  ('Arnhem', 'Arnhem'),
  ('Maastricht', 'Maastricht'),
  ('Zwolle', 'Zwolle'),
  ('Zaandam', 'Zaandam'),
  ('Haarlem', 'Haarlem'),
  ('Breda', 'Breda'),
  ('Tilburg', 'Tilburg'),
  ('Amersfoort', 'Amersfoort'),
  ('Den Bosch', 'Den Bosch');

-- Testimonials
INSERT INTO testimonials (naam, bedrijf, tekst, rating) VALUES
  ('Walther Piek', 'Arbeidsconsulent', 'De persoonlijke aandacht en het juiste niveau van de training maakten het verschil. Onze medewerkers konden de geleerde vaardigheden direct toepassen in hun dagelijks werk.', 5),
  ('Sandra de Vries', 'Gemeente Amsterdam', 'Uitstekende Excel training. De docent nam ruim de tijd voor persoonlijke vragen en de stof was direct toepasbaar.', 5),
  ('Mark Jansen', 'ING Bank', 'De incompany training was perfect afgestemd op onze organisatie. Zeer tevreden over de flexibiliteit en kwaliteit.', 5);

-- Standaard site settings
INSERT INTO site_settings (id, value) VALUES
  ('contact', '{"email": "info@computertraining.nl", "telefoon": "085 105 8919", "adres": "Vincent van Goghweg 85, 1506 JB Zaandam"}'),
  ('email', '{"from_email": "info@computertraining.nl", "admin_email": "info@computertraining.nl"}');
