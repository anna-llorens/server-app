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
psql -U postgres -d db_name
# or with specific user
psql -d postgres -U user
\c db_name
```

## Adding data to DB

```sql
CREATE TABLE users( id SERIAL PRIMARY KEY, name VARCHAR(30), email VARCHAR(30) );
```

```bash
# list tables
\dt
```