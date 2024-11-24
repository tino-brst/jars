-- Adds a check constraint to ensure that the name of a jar is either a non empty string or null

ALTER TABLE "Jar"
ADD CONSTRAINT name_not_empty CHECK (
  name IS NULL OR LENGTH(name) > 0
);