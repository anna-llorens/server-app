# Setup App

## PostgreSQL 

```bash
# Install Homebrew (if not already installed):
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL:
brew install postgresql

# Start PostgreSQL:
brew services start postgresql

# Access PostgreSQL and create a user and a db
psql postgres
CREATE USER user WITH PASSWORD 'db_password';
CREATE DATABASE db_name OWNER postgres;
\q

# Connect to the db:
psql -U postgres -d osprean_db
# or with specific user (postgres user)
psql -d postgres -U postgres
\c osprean_db
```

## Adding data to DB

```sql
-- Step 1: Create the 'nodes' table with columns 'id', 'name', and 'description'
CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,       -- 'id' is a serial primary key, auto-incremented
    name VARCHAR(30),            -- 'name' is a variable character field with a maximum length of 30
    description VARCHAR(2000)    -- 'description' is a variable character field with a maximum length of 2000
    
);

-- Step 2: Create an enum type 'NodeType' with possible values 'person' and 'asset'
CREATE TYPE NodeType AS ENUM ('person', 'asset' , 'team', 'other');

-- Or alter existing type
ALTER TYPE NodeType ADD VALUE 'new_type';

-- Step 3: Add a new column 'type' to the 'nodes' table using the 'NodeType' enum
ALTER TABLE nodes ADD COLUMN type NodeType;

-- Or alter existing type from column 
ALTER TABLE nodes
ALTER COLUMN type TYPE NodeType USING type::NodeType;

-- Step 4: Insert a new record into the 'nodes' table with values for 'name', 'type', and 'description'
INSERT INTO nodes (name, type, description) VALUES ('Asset 1', 'asset', 'This is the Asset 1 description');

```

```bash
# list tables
\dt
```