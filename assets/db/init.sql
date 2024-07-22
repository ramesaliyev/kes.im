
-- Create links table
DROP TABLE IF EXISTS links;
CREATE TABLE IF NOT EXISTS links (
  slug TEXT PRIMARY KEY,
  url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for links table
--CREATE INDEX IF NOT EXISTS idx_links_slug ON links(slug);
CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);

-- Fill links table with some data.
INSERT INTO links
  (slug, url)
VALUES
  ('ra', 'https://rames.dev'),
  ('tp', 'https://ramesaliyev.com/trigonoparty/');
