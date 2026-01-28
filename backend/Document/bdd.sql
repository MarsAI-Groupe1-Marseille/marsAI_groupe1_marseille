-- ============================================================
--  RESET TOTAL & INITIALISATION - MARS AI FESTIVAL
-- ============================================================

-- 1. SUPPRESSION ET CRÉATION DE LA BASE
DROP DATABASE IF EXISTS `mars_ai_db`;
CREATE DATABASE `mars_ai_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mars_ai_db`;

-- 2. CONFIGURATION DE L'ENCODAGE
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
--  CRÉATION DES TABLES (MVP 1 - Carnet de Note)
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLE : USERS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL,
  `full_name` VARCHAR(255),
  `avatar_url` VARCHAR(255),
  `role` ENUM('admin', 'jury', 'moderator') NOT NULL DEFAULT 'jury',
  `invite_token` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- 2. TABLE : DIRECTORS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `directors`;
CREATE TABLE `directors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- 3. TABLE : JURY_LISTS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `jury_lists`;
CREATE TABLE `jury_lists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- 4. TABLE : JURY_MEMBERS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `jury_members`;
CREATE TABLE `jury_members` (
  `user_id` INT NOT NULL,
  `jury_list_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `jury_list_id`),
  CONSTRAINT `fk_member_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_member_list` FOREIGN KEY (`jury_list_id`) REFERENCES `jury_lists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- 5. TABLE : SUBMISSIONS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `submissions`;
CREATE TABLE `submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `director_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `synopsis` TEXT,
  `poster_url` VARCHAR(255),
  `duration` INT DEFAULT 0,
  `youtube_id` VARCHAR(50),
  `video_status` ENUM('uploading', 'processing', 'ready', 'error') DEFAULT 'uploading',
  `status` ENUM('submitted', 'approved', 'rejected', 'incomplete') DEFAULT 'submitted',
  `edit_token` VARCHAR(255),
  `token_expires_at` DATETIME,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_submission_director` FOREIGN KEY (`director_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- 6. TABLE : JURY_LIST_SUBMISSIONS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `jury_list_submissions`;
CREATE TABLE `jury_list_submissions` (
  `jury_list_id` INT NOT NULL,
  `submission_id` INT NOT NULL,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`jury_list_id`, `submission_id`),
  CONSTRAINT `fk_jls_list` FOREIGN KEY (`jury_list_id`) REFERENCES `jury_lists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jls_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- 7. TABLE : MODERATION_TICKETS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `moderation_tickets`;
CREATE TABLE `moderation_tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `issue_type` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `is_resolved` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ticket_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ticket_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- 8. TABLE : JURY_EVALUATIONS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `jury_evaluations`;
CREATE TABLE `jury_evaluations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `vote_status` ENUM('LIKE', 'DISLIKE', 'DISCUSS') NOT NULL,
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_vote` (`submission_id`, `user_id`),
  CONSTRAINT `fk_eval_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_eval_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  JEU DE DONNÉES DE TEST (SEED)
-- ============================================================

INSERT INTO `users` (`email`, `full_name`, `role`, `password_hash`) VALUES
('admin@mars-festival.com', 'Super Admin', 'admin', 'HASH_DU_MOT_DE_PASSE'),
('jury@mars-festival.com', 'Alice Jury', 'jury', 'HASH_DU_MOT_DE_PASSE');

INSERT INTO `jury_lists` (`name`) VALUES ('Compétition IA Générative');

INSERT INTO `jury_members` (`user_id`, `jury_list_id`) VALUES (2, 1);

INSERT INTO `directors` (`email`, `full_name`) VALUES ('spielberg@gmail.com', 'Steven Spielberg');

INSERT INTO `submissions` (`director_id`, `title`, `synopsis`, `youtube_id`, `video_status`, `status`, `duration`) 
VALUES (1, 'Le Retour du Robot', 'Un robot cherche sa maman.', 'dQw4w9WgXcQ', 'ready', 'approved', 180);

INSERT INTO `jury_list_submissions` (`jury_list_id`, `submission_id`) VALUES (1, 1);

INSERT INTO `jury_evaluations` (`submission_id`, `user_id`, `vote_status`, `comment`) 
VALUES (1, 2, 'LIKE', 'Superbe lumière, mais la fin est triste.');
