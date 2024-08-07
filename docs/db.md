# Setup App Database

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

### Generate a JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Added to the .env file

## Adding data to DB

```sql
-- Step 1: Create the 'nodes' table with columns 'id', 'name', and 'description'
CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,       -- 'id' is a serial primary key, auto-incremented
    name VARCHAR(30),            -- 'name' is a variable character field with a maximum length of 30
    description VARCHAR(2000)    -- 'description' is a variable character field with a maximum length of 2000
    
);
```

## Nodes
```sql
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

ALTER TABLE users ADD COLUMN token VARCHAR(255);

```

## Users

```sql
-- Step 1: Create the 'users' table
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30)
);

-- Step 2: Correctly add a 'password' column to the 'users' table
ALTER TABLE users ADD COLUMN password VARCHAR(255);

-- Step 3: Define an enum type 'UserRole' with possible values 'admin', 'editor', and 'viewer'
CREATE TYPE UserRole AS ENUM ('admin', 'editor', 'viewer');

-- Step 4: Add a 'role' column to the 'users' table using the 'UserRole' enum
ALTER TABLE users ADD COLUMN role UserRole;
```
```bash
# list tables
\dt
```


## Teams and Organizations

1. Create the teams table:
Columns: id, organizationId, name.
organizationId should be a foreign key referencing the organizations table.

2. Create the organizations table:
Columns: id, name.

3. Update the users table:
Add columns teamId and organizationId.
Both teamId and organizationId should be foreign keys referencing the respective tables.

4. Add foreign keys:
Ensure that teamId in the users table references teams(id).
Ensure that organizationId in the users table references organizations(id).
Ensure that organizationId in the teams table references organizations(id).

```sql
-- 1. Create the organizations table
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- 2. Create the teams table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organizationId INT,
    CONSTRAINT fk_organization
      FOREIGN KEY(organizationId) 
	  REFERENCES organizations(id)
);

-- 3. Update the users table to include teamId and organizationId
ALTER TABLE users
ADD COLUMN teamId INT,
ADD COLUMN organizationId INT;

-- 4. Add foreign key constraints to the users table
ALTER TABLE users
ADD CONSTRAINT fk_team
  FOREIGN KEY(teamId) 
  REFERENCES teams(id),
ADD CONSTRAINT fk_organization
  FOREIGN KEY(organizationId) 
  REFERENCES organizations(id);

  -- 5. Add indexes to the teamId and organizationId columns in the users
CREATE INDEX idx_users_teamId ON users(teamId);
CREATE INDEX idx_users_organizationId ON users(organizationId);


UPDATE users
SET teamid = 1, 
    organizationid = 1 
WHERE email = 'anna@example.com'; 

```
## Api calls

```bash

## Add new User
curl -X POST http://localhost:3001/users \
-H "Content-Type: application/json" \
-d '{
  "name": "Admin user",
  "email": "admin@admin.com",
  "password": "123", 
  "role": "admin"
}'

## Reset User
curl -X PUT http://localhost:3001/users/44 \ 
-H "Content-Type: application/json" \
-d '{
  "name": "Anna RRR",
  "email": "anna@example.com",
  "password": "123", 
  "role": "admin"
}'

## Get teams
curl http://localhost:3001/organizations/1/teams



```