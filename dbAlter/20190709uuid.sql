
ALTER TABLE mmm.syncameeting192_schedule DROP COLUMN idSchedule;
ALTER TABLE mmm.syncameetingL_schedule DROP COLUMN idSchedule;
ALTER TABLE mmm.syncameeting192_schedule CHANGE COLUMN codeSchedule uuid BINARY(16) PRIMARY KEY FIRST;
ALTER TABLE mmm.syncameetingL_schedule CHANGE COLUMN codeSchedule uuid BINARY(16) PRIMARY KEY FIRST;


-- Set back

ALTER TABLE mmm.syncameeting192_schedule CHANGE COLUMN uuid codeSchedule varchar(20) NOT NULL DEFAULT '' AFTER idUser;
ALTER TABLE mmm.syncameetingL_schedule CHANGE COLUMN uuid codeSchedule varchar(20) NOT NULL DEFAULT '' AFTER idUser;
ALTER TABLE mmm.syncameeting192_schedule DROP PRIMARY KEY;
ALTER TABLE mmm.syncameetingL_schedule DROP PRIMARY KEY;
ALTER TABLE mmm.syncameeting192_schedule ADD COLUMN idSchedule INT(8) PRIMARY KEY NOT NULL auto_increment FIRST;
ALTER TABLE mmm.syncameetingL_schedule ADD COLUMN idSchedule INT(8) PRIMARY KEY NOT NULL auto_increment FIRST;

