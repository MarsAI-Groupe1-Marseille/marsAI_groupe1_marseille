-- ============================================================
-- 🧹 RESET TOTAL & INITIALISATION - MARS AI FESTIVAL
-- ============================================================

-- 1. SUPPRESSION ET CRÉATION DE LA BASE
DROP DATABASE IF EXISTS `mars_ai_db`;
CREATE DATABASE `mars_ai_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `mars_ai_db`;

-- 2. CONFIGURATION DE L'ENCODAGE
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 🚀 CRÉATION DES TABLES (Mise à jour Spécifications PDF)
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLE : USERS (Admin / Jury)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 2. TABLE : DIRECTORS (Le Réalisateur)
-- ------------------------------------------------------------
-- Mise à jour selon PDF Section 1
DROP TABLE IF EXISTS `directors`;
CREATE TABLE `directors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,  
  `civility` ENUM('M', 'Mme', 'Iel') DEFAULT 'M',
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `birth_date` DATE NOT NULL,   
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(50), 
  `mobile` VARCHAR(50) NOT NULL,  
  `address` VARCHAR(255),
  `zip_code` VARCHAR(20),
  `city` VARCHAR(100),
  `country` VARCHAR(100),   
  `job_title` VARCHAR(100) NOT NULL, 
  `social_links` JSON, 
  `marketing_source` VARCHAR(100),
  `newsletter_optin` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 3. TABLE : SUBMISSIONS (Les Films)
-- ------------------------------------------------------------
-- Mise à jour selon PDF Sections 2, 3 et 4
DROP TABLE IF EXISTS `submissions`;
CREATE TABLE `submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `director_id` INT NOT NULL,  
  `title_original` VARCHAR(255) NOT NULL,
  `title_english` VARCHAR(255),
  `duration_seconds` INT NOT NULL, 
  `language_main` VARCHAR(50) NOT NULL,
  `theme_tags` VARCHAR(255),  
  `synopsis_original` TEXT NOT NULL,
  `synopsis_english` TEXT,
  `ai_classification` ENUM('100% IA', 'Hybrid') NOT NULL,
  `ai_tools` TEXT,
  `ai_methodology` TEXT,
  `youtube_id` VARCHAR(50),
  `poster_url` VARCHAR(255),
  `gallery_urls` JSON,  
  `has_subtitles` BOOLEAN DEFAULT FALSE,
  `video_status` ENUM('uploading', 'processing', 'ready', 'error') DEFAULT 'uploading',
  `approval_status` ENUM('submitted', 'approved', 'rejected', 'incomplete') DEFAULT 'submitted',  
  `edit_token` VARCHAR(255), 
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
  CONSTRAINT `fk_submission_director` FOREIGN KEY (`director_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 4. TABLE : COLLABORATORS (L'Équipe)
-- ------------------------------------------------------------
-- NOUVEAU : Selon PDF Section 5 "Composition de l'Équipe"
DROP TABLE IF EXISTS `collaborators`;
CREATE TABLE `collaborators` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` INT NOT NULL,  
  `role` VARCHAR(100) NOT NULL,
  `civility` VARCHAR(20),
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `job_title` VARCHAR(100),
  `email` VARCHAR(255),
  
  CONSTRAINT `fk_collab_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 5. TABLES JURY & MODÉRATION (Inchangées ou adaptées)
-- ------------------------------------------------------------

DROP TABLE IF EXISTS `jury_lists`;
CREATE TABLE `jury_lists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `jury_members`;
CREATE TABLE `jury_members` (
  `user_id` INT NOT NULL,
  `jury_list_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `jury_list_id`),
  CONSTRAINT `fk_member_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_member_list` FOREIGN KEY (`jury_list_id`) REFERENCES `jury_lists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `jury_list_submissions`;
CREATE TABLE `jury_list_submissions` (
  `jury_list_id` INT NOT NULL,
  `submission_id` INT NOT NULL,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`jury_list_id`, `submission_id`),
  CONSTRAINT `fk_jls_list` FOREIGN KEY (`jury_list_id`) REFERENCES `jury_lists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jls_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 🧪 JEU DE DONNÉES DE TEST (SEED ACTUALISÉ)
-- ============================================================

INSERT INTO `users` (`email`, `full_name`, `role`, `password_hash`) VALUES
('admin@mars-festival.com', 'Super Admin', 'admin', '$2b$10$FakeHash...'),
('jury@mars-festival.com', 'Alice Jury', 'jury', '$2b$10$FakeHash...');

INSERT INTO `jury_lists` (`name`) VALUES ('Compétition IA Générative 2026');
INSERT INTO `jury_members` (`user_id`, `jury_list_id`) VALUES (2, 1);

-- Insertion d'un Réalisateur (Avec les nouveaux champs)
INSERT INTO `directors` 
(civility, first_name, last_name, birth_date, email, mobile, address, city, country, job_title, social_links) 
VALUES 
('M', 'Steven', 'Spielberg', '1946-12-18', 'spielberg@gmail.com', '0600000000', '10 Universal City Plaza', 'Los Angeles', 'USA', 'Réalisateur', '{"twitter": "@stevenspielberg"}');

-- Insertion d'un Film (Avec les nouveaux champs IA)
INSERT INTO `submissions` 
(director_id, title_original, title_english, duration_seconds, language_main, synopsis_original, ai_classification, ai_tools, youtube_id, video_status, approval_status) 
VALUES 
(1, 'Le Retour du Robot', 'Robot Return', 58, 'Français', 'Un robot cherche sa maman sur Mars.', 'Hybrid', 'Runway Gen-2, Midjourney v6', 'dQw4w9WgXcQ', 'ready', 'approved');

-- Ajout à la liste du jury
INSERT INTO `jury_list_submissions` (`jury_list_id`, `submission_id`) VALUES (1, 1);

-- Ajout d'un collaborateur (Nouveau)
INSERT INTO `collaborators` (submission_id, role, first_name, last_name, job_title)
VALUES (1, 'Monteur', 'Michael', 'Kahn', 'Chef Monteur');