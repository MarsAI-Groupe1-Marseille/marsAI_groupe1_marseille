-- Création de la base de données
CREATE DATABASE IF NOT EXISTS mars_ai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mars_ai_db;

-- ==========================================
-- 1. TABLES DE RÉFÉRENCE (Indépendantes)
-- ==========================================

CREATE TABLE ROLE (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE, -- Ex: 'ADMIN', 'JURY', 'USER'
    libelle VARCHAR(100) NOT NULL
);

CREATE TABLE STATUT_FILM (
    id_statut_film INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE, -- Ex: 'PENDING', 'APPROVED'
    libelle VARCHAR(100) NOT NULL
);

CREATE TABLE OUTIL_IA (
    id_outil_ia INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    site_web VARCHAR(255)
);

CREATE TABLE LIEU (
    id_lieu INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    adresse VARCHAR(255) NOT NULL
);

CREATE TABLE PARTENAIRE (
    id_partenaire INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    site_web VARCHAR(255)
);

CREATE TABLE NEWSLETTER (
    id_newsletter INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    langue VARCHAR(10) DEFAULT 'fr',
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. TABLES PRINCIPALES (Utilisateurs & Events)
-- ==========================================

CREATE TABLE UTILISATEUR (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    pseudo VARCHAR(50) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    bio TEXT,
    site_web VARCHAR(255),
    pays VARCHAR(100),
    langue VARCHAR(10) DEFAULT 'fr',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EVENEMENT (
    id_evenement INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    date_event DATE NOT NULL,
    heure_debut TIME,
    heure_fin TIME,
    capacite INT,
    id_lieu INT NOT NULL,
    FOREIGN KEY (id_lieu) REFERENCES LIEU(id_lieu)
);

-- ==========================================
-- 3. TABLES CŒUR DE MÉTIER (Films & Réservations)
-- ==========================================

CREATE TABLE FILM (
    id_film INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    pays VARCHAR(100),
    duree_minutes INT,
    video_url VARCHAR(255),
    date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INT NOT NULL, -- Le réalisateur
    id_statut_film INT NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur),
    FOREIGN KEY (id_statut_film) REFERENCES STATUT_FILM(id_statut_film)
);

CREATE TABLE RESERVATION_EVENEMENT (
    id_reservation INT AUTO_INCREMENT PRIMARY KEY,
    date_reservation DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(50) DEFAULT 'CONFIRMED', -- Ex: CONFIRMED, CANCELLED
    nb_place INT DEFAULT 1,
    id_utilisateur INT NOT NULL,
    id_evenement INT NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur),
    FOREIGN KEY (id_evenement) REFERENCES EVENEMENT(id_evenement)
);

-- ==========================================
-- 4. TABLES DE DÉTAILS & LIAISONS (Avis, IA, Modé)
-- ==========================================

-- Table pour lier un film à un outil IA avec des détails spécifiques
CREATE TABLE UTILISATION_IA (
    id_utilisation_ia INT AUTO_INCREMENT PRIMARY KEY,
    details TEXT, -- Ex: "Utilisé pour la génération des décors"
    id_film INT NOT NULL,
    id_outil_ia INT NOT NULL,
    FOREIGN KEY (id_film) REFERENCES FILM(id_film) ON DELETE CASCADE,
    FOREIGN KEY (id_outil_ia) REFERENCES OUTIL_IA(id_outil_ia)
);

CREATE TABLE AVIS_JURY (
    id_avis_jury INT AUTO_INCREMENT PRIMARY KEY,
    score INT CHECK (score BETWEEN 0 AND 10), -- Note sur 10 par exemple
    commentaire TEXT,
    date_avis DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INT NOT NULL, -- Le membre du jury
    id_film INT NOT NULL, -- Le film noté
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur),
    FOREIGN KEY (id_film) REFERENCES FILM(id_film) ON DELETE CASCADE,
    UNIQUE KEY unique_avis (id_utilisateur, id_film) -- Un jury ne note qu'une fois un film
);

CREATE TABLE MODERATION_FILM (
    id_moderation INT AUTO_INCREMENT PRIMARY KEY,
    decision VARCHAR(50), -- Ex: REFUSED, ASK_CHANGES
    raison TEXT,
    date_moderation DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INT NOT NULL, -- Le modérateur
    id_film INT NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur),
    FOREIGN KEY (id_film) REFERENCES FILM(id_film) ON DELETE CASCADE
);

-- ==========================================
-- 5. TABLES D'ASSOCIATION (Many-to-Many)
-- ==========================================

-- Pour gérer les rôles (Un user peut être Admin ET Jury)
CREATE TABLE UTILISATEUR_ROLE (
    id_utilisateur INT,
    id_role INT,
    PRIMARY KEY (id_utilisateur, id_role),
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_role) REFERENCES ROLE(id_role)
);

-- Pour les organisateurs d'événements
CREATE TABLE ORGANISATION_EVENEMENT (
    id_evenement INT,
    id_utilisateur INT,
    PRIMARY KEY (id_evenement, id_utilisateur),
    FOREIGN KEY (id_evenement) REFERENCES EVENEMENT(id_evenement) ON DELETE CASCADE,
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur)
);

-- Pour les sponsors
CREATE TABLE SPONSORING (
    id_partenaire INT,
    id_evenement INT,
    montant DECIMAL(10, 2), -- Optionnel : ajout d'un montant de sponsoring
    PRIMARY KEY (id_partenaire, id_evenement),
    FOREIGN KEY (id_partenaire) REFERENCES PARTENAIRE(id_partenaire),
    FOREIGN KEY (id_evenement) REFERENCES EVENEMENT(id_evenement) ON DELETE CASCADE
);