
-- Create links table
DROP TABLE IF EXISTS links;
CREATE TABLE IF NOT EXISTS links (
  slug TEXT PRIMARY KEY,
  url TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for links table
-- (No need to create index for url as it is already unique)
-- DROP INDEX IF EXISTS idx_links_url;
-- CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);

-- Fill links table with some data.
INSERT INTO links
  (slug, url)
VALUES
  ('1881', 'https://en.wikipedia.org/wiki/Mustafa_Kemal_Atatürk'),
  ('ataturk', 'https://www.google.com/search?q=atatürk'),
  ('rames', 'https://rames.dev'),
  ('ramesaliyev', 'https://ramesaliyev.com'),
  ('kesim', 'https://kes.im'),
  ('trigonoparty', 'https://ramesaliyev.com/trigonoparty/'),
  ('repo','https://github.com/ramesaliyev/kes.im'),
  ('cloudflare', 'https://www.cloudflare.com'),
  ('github', 'https://github.com'),
  ('chess', 'https://www.chess.com'),
  ('chatgpt', 'https://chatgpt.com'),
  ('youtube', 'https://www.youtube.com'),
  ('reddit', 'https://www.reddit.com');
