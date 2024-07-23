-- Step 1: Create a new table with the desired schema
--

-- Step 2: Copy data from the old table to the new table
INSERT INTO links_new (slug, url, created_at)
SELECT slug, url, created_at
FROM links;

-- Step 3: Drop the old table
DROP TABLE links;

-- Step 4: Rename the new table to the original table name
ALTER TABLE links_new RENAME TO links;
