
#### Init DB

    npx wrangler d1 execute kesim --remote --file=assets/db/init.sql

#### Test

    npx wrangler d1 execute kesim --remote --command="SELECT * FROM links"

#### See indexes

    npx wrangler d1 execute kesim --remote --command="SELECT name, type, sql FROM sqlite_schema WHERE type IN ('index')"

#### Verify indexes

Verify for slug:

    npx wrangler d1 execute kesim --remote --command="EXPLAIN QUERY PLAN SELECT * FROM links WHERE slug = 'ra' LIMIT 1;"

Verify for url:

    npx wrangler d1 execute kesim --remote --command="EXPLAIN QUERY PLAN SELECT * FROM links WHERE url = 'https://rames.dev' LIMIT 1;"
