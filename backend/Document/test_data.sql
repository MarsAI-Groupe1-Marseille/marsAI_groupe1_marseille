-- ============================================================
-- INSERT TEST DATA POUR JURY DASHBOARD
-- ============================================================

USE `mars_ai_db`;

-- 1. Créer un utilisateur jury s'il n'existe pas
INSERT IGNORE INTO `users` ( email, password_hash, full_name, role, avatar_url)
VALUES 
  ('jury@test.com', '$2b$10$...', 'Jury Marseille', 'jury', '/avatars/jury1.jpg'),
  ('jury2@test.com', '$2b$10$...', 'Jury2 Festival', 'jury', '/avatars/jury2.jpg');

-- 2. Créer des directors
INSERT IGNORE INTO `directors` (civility, first_name, last_name, birth_date, email, phone, mobile, job_title)
VALUES 
  ('M', 'Jean', 'Dupont', '1985-05-15', 'jean.dupont@email.com', '0491234567', '0612345678', 'Réalisateur'),
  ('Mme', 'Marie', 'Martin', '1990-03-22', 'marie.martin@email.com', '0492234567', '0612345679', 'Cinéaste'),
  ('M', 'Pierre', 'Bernard', '1988-07-10', 'pierre.bernard@email.com', '0493234567', '0612345680', 'Producteur');

-- 3. Créer des submissions (films)
INSERT IGNORE INTO `submissions` (director_id, title_original, title_english, duration_seconds, language_main, synopsis_original, synopsis_english, ai_classification, youtube_id, poster_url, approval_status)
VALUES 
  (1, 'L\'Algorithme Perdu', 'The Lost Algorithm', 300, 'FR', 'Un drame sur l\'IA', 'A drama about AI', 'Hybrid', 'dQw4w9WgXcQ', '/uploads/film1.jpg', 'approved'),
  (2, 'Rêves Numériques', 'Digital Dreams', 420, 'FR', 'Une expérience visuelle surprenante', 'A surprising visual experience', '100% IA', 'jNQXAC9IVRw', '/uploads/film2.jpg', 'approved'),
  (1, 'Réflexions', 'Reflections', 180, 'FR', 'Court métrage introspectif', 'Introspective short film', 'Hybrid', '9bZkp7q19f0', '/uploads/film3.jpg', 'approved'),
  (3, 'Futur Incertain', 'Uncertain Future', 480, 'FR', 'Epic de sciences fiction', 'Science fiction epic', '100% IA', 'kJQP7kiOLVM', '/uploads/film4.jpg', 'approved');

-- 4. Créer les jury lists (playlists)
INSERT IGNORE INTO `jury_lists` (name)
VALUES 
  ('Sélection 2026'),
  ('Courts Métrages');

-- 5. Créer les associations jury_members (lier users aux jury_lists)
INSERT IGNORE INTO `jury_members` (user_id, jury_list_id)
VALUES 
  (1, 1),  -- jury@test.com dans Sélection 2026
  (1, 2),  -- jury@test.com dans Courts Métrages
  (2, 1);  -- jury2@test.com dans Sélection 2026

-- 6. Créer les associations jury_list_submissions (lier films aux playlists)
INSERT IGNORE INTO `jury_list_submissions` (jury_list_id, submission_id)
VALUES 
  (1, 1),  -- L'Algorithme Perdu dans Sélection 2026
  (1, 2),  -- Rêves Numériques dans Sélection 2026
  (2, 3),  -- Réflexions dans Courts Métrages
  (1, 4);  -- Futur Incertain dans Sélection 2026
