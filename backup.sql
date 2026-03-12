-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 11 mars 2026 à 15:37
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mars_ai_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `collaborators`
--

DROP TABLE IF EXISTS `collaborators`;
CREATE TABLE IF NOT EXISTS `collaborators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `submission_id` int NOT NULL,
  `role` varchar(255) NOT NULL,
  `civility` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `submission_id` (`submission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `collaborators`
--

INSERT INTO `collaborators` (`id`, `submission_id`, `role`, `civility`, `first_name`, `last_name`, `job_title`, `email`, `created_at`, `updated_at`) VALUES
(1, 1, 'Monteur', NULL, 'Michael', 'Kahn', 'Chef Monteur', NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 2, 'Actrice , Réalisatrice', NULL, 'Sophie ', 'Marceau', NULL, 'sophie.claire@gmail.com', '2026-02-19 16:18:18', '2026-02-19 16:18:18');

-- --------------------------------------------------------

--
-- Structure de la table `directors`
--

DROP TABLE IF EXISTS `directors`;
CREATE TABLE IF NOT EXISTS `directors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `civility` enum('M','Mme','Iel') DEFAULT 'M',
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `job_title` varchar(255) NOT NULL,
  `social_links` json DEFAULT NULL,
  `marketing_source` varchar(255) DEFAULT NULL,
  `newsletter_optin` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `directors`
--

INSERT INTO `directors` (`id`, `civility`, `first_name`, `last_name`, `birth_date`, `email`, `phone`, `mobile`, `address`, `zip_code`, `city`, `country`, `job_title`, `social_links`, `marketing_source`, `newsletter_optin`, `created_at`, `updated_at`) VALUES
(1, 'M', 'Steven', 'Spielberg', '1946-12-18', 'spielberg@gmail.com', NULL, '0600000000', '10 Universal City Plaza', NULL, 'Los Angeles', 'USA', 'Réalisateur', '{\"twitter\": \"@stevenspielberg\"}', NULL, 0, '2026-02-07 14:19:12', '2026-02-07 14:19:12'),
(2, 'M', 'Mehdi', 'SEBILLOT', '1975-01-30', 'mehdi.sebillot@laplateforme.io', '', '0629838320', '29 traverse chante perdrix, Batiment A5', '13010', 'Marseille', 'France', 'Chômeur de Luxe', '{\"linkedin\": \"\", \"instagram\": \"\"}', '', 1, '2026-02-19 16:18:07', '2026-02-19 16:18:07');

-- --------------------------------------------------------

--
-- Structure de la table `jury_evaluations`
--

DROP TABLE IF EXISTS `jury_evaluations`;
CREATE TABLE IF NOT EXISTS `jury_evaluations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `submission_id` int NOT NULL,
  `user_id` int NOT NULL,
  `vote_status` enum('LIKE','DISLIKE','DISCUSS') NOT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_vote` (`submission_id`,`user_id`),
  UNIQUE KEY `jury_evaluations_user_id_submission_id` (`user_id`,`submission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jury_lists`
--

DROP TABLE IF EXISTS `jury_lists`;
CREATE TABLE IF NOT EXISTS `jury_lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `jury_lists`
--

INSERT INTO `jury_lists` (`id`, `name`, `created_at`) VALUES
(1, 'Compétition IA Générative 2026', '2026-02-07 14:18:57');

-- --------------------------------------------------------

--
-- Structure de la table `jury_list_submissions`
--

DROP TABLE IF EXISTS `jury_list_submissions`;
CREATE TABLE IF NOT EXISTS `jury_list_submissions` (
  `jury_list_id` int NOT NULL,
  `submission_id` int NOT NULL,
  `added_at` datetime DEFAULT NULL,
  PRIMARY KEY (`jury_list_id`,`submission_id`),
  KEY `fk_jls_submission` (`submission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `jury_list_submissions`
--

INSERT INTO `jury_list_submissions` (`jury_list_id`, `submission_id`, `added_at`) VALUES
(1, 1, '2026-02-07 14:19:43');

-- --------------------------------------------------------

--
-- Structure de la table `jury_members`
--

DROP TABLE IF EXISTS `jury_members`;
CREATE TABLE IF NOT EXISTS `jury_members` (
  `user_id` int NOT NULL,
  `jury_list_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`jury_list_id`),
  KEY `fk_member_list` (`jury_list_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `jury_members`
--

INSERT INTO `jury_members` (`user_id`, `jury_list_id`) VALUES
(2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `moderation_tickets`
--

DROP TABLE IF EXISTS `moderation_tickets`;
CREATE TABLE IF NOT EXISTS `moderation_tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `submission_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `issue_type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `is_resolved` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `submission_id` (`submission_id`),
  KEY `admin_id` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `site_config`
--

DROP TABLE IF EXISTS `site_config`;
CREATE TABLE IF NOT EXISTS `site_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `config_key` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'home_page' COMMENT 'Clé identifiant la config (ex: home_page, footer, header)',
  `config_data` json NOT NULL COMMENT 'Données de configuration en JSON (hero, categories, awards, partners)',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `director_id` int NOT NULL,
  `title_original` varchar(255) NOT NULL,
  `title_english` varchar(255) NOT NULL,
  `duration_seconds` int DEFAULT NULL,
  `language_main` varchar(255) DEFAULT NULL,
  `theme_tags` varchar(255) DEFAULT NULL,
  `synopsis_original` text NOT NULL,
  `synopsis_english` text NOT NULL,
  `ai_classification` enum('100% IA','Hybrid') DEFAULT NULL,
  `ai_tools` text,
  `ai_methodology` text,
  `youtube_id` varchar(255) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `gallery_urls` json DEFAULT NULL,
  `has_subtitles` tinyint(1) DEFAULT '0',
  `video_status` enum('uploading','processing','ready','error') DEFAULT 'processing',
  `approval_status` enum('submitted','approved','rejected','incomplete') DEFAULT 'submitted',
  `edit_token` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `s3_video_key` varchar(255) DEFAULT NULL,
  `subtitles_url` varchar(255) DEFAULT NULL,
  `is_selected` tinyint(1) DEFAULT '0',
  `award_winner` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `director_id` (`director_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `submissions`
--

INSERT INTO `submissions` (`id`, `director_id`, `title_original`, `title_english`, `duration_seconds`, `language_main`, `theme_tags`, `synopsis_original`, `synopsis_english`, `ai_classification`, `ai_tools`, `ai_methodology`, `youtube_id`, `poster_url`, `gallery_urls`, `has_subtitles`, `video_status`, `approval_status`, `edit_token`, `created_at`, `updated_at`, `s3_video_key`, `subtitles_url`, `is_selected`, `award_winner`) VALUES
(1, 1, 'Le Retour du Robot', 'Robot Return', 58, 'Français', NULL, 'Un robot cherche sa maman sur Mars.', '', 'Hybrid', 'Runway Gen-2, Midjourney v6', NULL, 'dQw4w9WgXcQ', NULL, NULL, 0, 'ready', 'approved', NULL, '2026-02-07 14:19:26', '2026-02-07 14:19:26', NULL, NULL, 0, NULL),
(2, 2, 'Néon Murmures', 'Neon Whispers)', 100, 'Français', 'sentimental', 'bla bla bla ...', 'alb alb alb ....', '100% IA', 'Runaway ,Sora', 'Prompt engineering , Process ...', 'osvp5YvS_r8', 'https://mrs.s3.fr-par.scw.cloud/grp1/posters/unnamed01_1771517870061.jpg', '[]', 0, 'processing', 'submitted', 'b24dd5387d4ebd29aedd96b79b7cd553599270346ba3c43907925a824b1a2fa6', '2026-02-19 16:18:18', '2026-02-19 16:18:18', 'grp1/videos/ScÃ©narimageÂ 1_(1)_1771517869290.mp4', NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `role` enum('admin','jury','moderator') DEFAULT 'jury',
  `invite_token` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `specialite` json DEFAULT NULL,
  `invite_token_expires_at` datetime DEFAULT NULL,
  `account_status` enum('pending','active') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `avatar_url`, `role`, `invite_token`, `created_at`, `updated_at`, `google_id`, `specialite`, `invite_token_expires_at`, `account_status`) VALUES
(1, 'admin@mars-festival.com', '$2b$10$FakeHash...', 'Super Admin', NULL, 'admin', NULL, '2026-02-07 14:18:53', '2026-02-07 14:18:53', NULL, NULL, NULL, 'pending'),
(2, 'jury@mars-festival.com', '$2b$10$FakeHash...', 'Alice Jury', NULL, 'jury', '6e54592a04c9b4c001f771c5530260621d7369d80cd985f2fcaf4591f8637e88', '2026-02-07 14:18:53', '2026-02-19 15:20:46', NULL, NULL, '2026-02-19 15:50:46', 'pending'),
(3, 'admin@gmail.com', '$2b$10$fDrQgXHRKuWwjSmGGRGmZO8aDluzsU4IvLs76XC3YPCnO51TXPdSy', 'Super Admin', NULL, 'admin', NULL, '2026-02-08 12:09:29', '2026-02-08 12:09:29', NULL, NULL, NULL, 'pending'),
(4, 'mehdi.sebillot@laplateforme.io', '$2b$10$Fe9.o9y1qu.2mnC3XyeVJODELLD2vz7Og6wEASDVjb77mJkPoPEJy', 'Super Admin', NULL, 'admin', NULL, '2026-02-19 15:18:24', '2026-02-19 15:19:06', '118209869605989098647', NULL, NULL, 'pending'),
(5, 'bonatero@gmail.com', '$2b$10$8vQLfxaesTy11vER8qoRl.FOVrqsww2./H/LHrKslWcZyv.c2apVm', 'bonatero_modifié', NULL, 'jury', NULL, '2026-02-20 09:35:45', '2026-03-09 10:11:24', NULL, '[\"[\\\"Montage vidéo\\\",\\\"effets spéciaux\\\"]\"]', NULL, 'pending'),
(6, 'franc@gmail.com', '$2b$10$wbzi/LjJ8FQy51BeD/z08O5tFUJ6gbWU3cdlrUcbJ412PVbCu15fS', 'franc le blanc', 'https://mrs.s3.fr-par.scw.cloud/grp1/avatars/unnamed01_1772034914358.jpg', 'jury', NULL, '2026-02-25 15:53:56', '2026-02-25 15:55:15', NULL, '[\"Montage vidéo\", \"effets spéciaux\"]', NULL, 'pending');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `collaborators`
--
ALTER TABLE `collaborators`
  ADD CONSTRAINT `collaborators_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `jury_evaluations`
--
ALTER TABLE `jury_evaluations`
  ADD CONSTRAINT `jury_evaluations_ibfk_95` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `jury_evaluations_ibfk_96` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `jury_list_submissions`
--
ALTER TABLE `jury_list_submissions`
  ADD CONSTRAINT `fk_jls_list` FOREIGN KEY (`jury_list_id`) REFERENCES `jury_lists` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_jls_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `jury_members`
--
ALTER TABLE `jury_members`
  ADD CONSTRAINT `fk_member_list` FOREIGN KEY (`jury_list_id`) REFERENCES `jury_lists` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_member_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `moderation_tickets`
--
ALTER TABLE `moderation_tickets`
  ADD CONSTRAINT `moderation_tickets_ibfk_95` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `moderation_tickets_ibfk_96` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`director_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
