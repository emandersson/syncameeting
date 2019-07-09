

ALTER TABLE mmm.syncameeting192_schedule CHANGE COLUMN uuid uuid varchar(36);
ALTER TABLE mmm.syncameetingL_schedule CHANGE COLUMN uuid uuid varchar(36);

-- Set back

ALTER TABLE mmm.syncameeting192_schedule CHANGE COLUMN uuid uuid BINARY(16);
ALTER TABLE mmm.syncameetingL_schedule CHANGE COLUMN uuid uuid BINARY(16);

