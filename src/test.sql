-- Step 1: Create the 'nodes' table with columns 'id', 'name', and 'description'
CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,       -- 'id' is a serial primary key, auto-incremented
    name VARCHAR(30),            -- 'name' is a variable character field with a maximum length of 30
    description VARCHAR(2000)             -- 'description' is a variable character field with a maximum length of 2000
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
