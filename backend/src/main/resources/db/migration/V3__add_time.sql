-- Add timing columns to the 'games' table

ALTER TABLE games ADD COLUMN start_time DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
ALTER TABLE games ADD COLUMN `start` INT;
ALTER TABLE games ADD COLUMN increment INT;


-- Add a new column 'time' to the 'moves' table

ALTER TABLE moves ADD COLUMN move_time DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);