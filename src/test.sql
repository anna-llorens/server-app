ALTER TABLE nodes ADD COLUMN description VARCHAR(2000);
INSERT INTO nodes (name, type, description) VALUES ('Asset 1', 'Asset', 'Description of Asset 1');