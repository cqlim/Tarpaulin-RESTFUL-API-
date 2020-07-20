-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema tarpaulin
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `tarpaulin` ;

-- -----------------------------------------------------
-- Schema tarpaulin
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `tarpaulin` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `tarpaulin` ;

-- -----------------------------------------------------
-- Table `tarpaulin`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tarpaulin`.`users` ;

CREATE TABLE IF NOT EXISTS `tarpaulin`.`users` (
  `userID` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `description` VARCHAR(100) NULL DEFAULT NULL,
  `role` ENUM('admin', 'instructor', 'student') NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  UNIQUE INDEX `userID` (`userID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `tarpaulin`.`courses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tarpaulin`.`courses` ;

CREATE TABLE IF NOT EXISTS `tarpaulin`.`courses` (
  `courseID` BIGINT NOT NULL AUTO_INCREMENT,
  `subject` VARCHAR(100) NOT NULL,
  `number` VARCHAR(100) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `term` VARCHAR(100) NOT NULL,
  `instructorId` BIGINT NOT NULL,
  PRIMARY KEY (`courseID`),
  UNIQUE INDEX `courseID` (`courseID` ASC) VISIBLE,
  INDEX `instructorId` (`instructorId` ASC) VISIBLE,
  CONSTRAINT `courses_ibfk_1`
    FOREIGN KEY (`instructorId`)
    REFERENCES `tarpaulin`.`users` (`userID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `tarpaulin`.`assignments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tarpaulin`.`assignments` ;

CREATE TABLE IF NOT EXISTS `tarpaulin`.`assignments` (
  `assignmentID` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(20) NOT NULL,
  `description` VARCHAR(20),
  `points` BIGINT NOT NULL,
  `due` DATETIME NOT NULL,
  `courseId` BIGINT NOT NULL,
  PRIMARY KEY (`assignmentID`),
  UNIQUE INDEX `assignmentID` (`assignmentID` ASC) VISIBLE,
  INDEX `courseId` (`courseId` ASC) VISIBLE,
  CONSTRAINT `assignments_ibfk_1`
    FOREIGN KEY (`courseId`)
    REFERENCES `tarpaulin`.`courses` (`courseID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `tarpaulin`.`submissions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tarpaulin`.`submissions` ;

CREATE TABLE IF NOT EXISTS `tarpaulin`.`submissions` (
  `submissionID` BIGINT NOT NULL AUTO_INCREMENT,
  `studentId` BIGINT NOT NULL,
  `assignmentID` BIGINT NOT NULL,
  `description` VARCHAR(20) NULL DEFAULT NULL,
  `timestamp` DATETIME NULL DEFAULT NULL,
  `file` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`submissionID`),
  UNIQUE INDEX `submissionID` (`submissionID` ASC) VISIBLE,
  INDEX `studentID` (`studentId` ASC) VISIBLE,
  INDEX `assignmentID` (`assignmentID` ASC) VISIBLE,
  CONSTRAINT `submissions_ibfk_1`
    FOREIGN KEY (`studentId`)
    REFERENCES `tarpaulin`.`users` (`userID`),
  CONSTRAINT `submissions_ibfk_2`
    FOREIGN KEY (`assignmentID`)
    REFERENCES `tarpaulin`.`assignments` (`assignmentID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `tarpaulin`.`usercourse`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tarpaulin`.`usercourse` ;

CREATE TABLE IF NOT EXISTS `tarpaulin`.`usercourse` (
  `studentID` BIGINT NOT NULL,
  `courseID` BIGINT NOT NULL,
  INDEX `studentID` (`studentID` ASC) VISIBLE,
  INDEX `courseID` (`courseID` ASC) VISIBLE,
  CONSTRAINT `usercourse_ibfk_1`
    FOREIGN KEY (`studentID`)
    REFERENCES `tarpaulin`.`users` (`userID`),
  CONSTRAINT `usercourse_ibfk_2`
    FOREIGN KEY (`courseID`)
    REFERENCES `tarpaulin`.`courses` (`courseID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
