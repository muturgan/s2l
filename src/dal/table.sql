CREATE TABLE links (
    `ID` INT UNSIGNED  PRIMARY KEY  AUTO_INCREMENT,
    `link` TEXT  NOT NULL,
    `hash` CHAR(6)  UNIQUE  NOT NULL
)
ENGINE = InnoDB
CHARACTER SET 'utf8'
COLLATE 'utf8_general_ci'