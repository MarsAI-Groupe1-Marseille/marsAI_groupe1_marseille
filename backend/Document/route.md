# 📡 DOCUMENTATION API - MARS AI

**Version API :** 1.0
**Base URL :** `http://localhost:3000` (ou votre domaine)

---

## 1. AUTHENTIFICATION & UTILISATEURS
*Gestion des comptes et de la sécurité.*

### 🟢 Inscription (Register)
* **Route :** `POST /api/auth/register`
* **Description :** Créer un nouveau compte utilisateur.
* **JSON Reçu (Input) :**
  ```json
  {
    "email": "lucas@mail.com",
    "pseudo": "SkyWalker",
    "nom_complet": "Lucas Skywalker",
    "password": "superSecretPassword"
  }
  ```

### 🟢 JSON Renvoyé (Output) - 201 Created :
 ```json
  {
  "message": "Compte créé avec succès",
  "user": {
    "id_utilisateur": 10,
    "email": "lucas@mail.com",
    "pseudo": "SkyWalker"
  }
}
  ```

### 🟢 Connexion (Login) 
* **Route :** `POST /api/auth/login`
* **Description :** Connecter un utilisateur et recevoir un token (JWT).
* **JSON Reçu (Input) :**
  ```json
  {
    "email": "lucas@mail.com",
    "password": "superSecretPassword"
  }
  ```

* **JSON Renvoyé (Output) - 200 OK :**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "user": {
      "id_utilisateur": 10,
      "role_codes": ["USER", "JURY"]
    }
  }
  ```

---

## 2. GESTION DES FILMS 🎬
*Le cœur du festival.*

### 🔵 Lister les films (Public)
* **Route :** `GET /api/films`
* **Description :** Récupérer la liste des films validés (APPROVED).
* **Paramètres optionnels :** `?sort=date`, `?outil=midjourney`
* **JSON Renvoyé (Output) - 200 OK :**
  ```json
  [
    {
      "id_film": 45,
      "titre": "Cyber Dreams",
      "video_url": "https://youtu.be/...",
      "realisateur": "SkyWalker",
      "outils": ["Midjourney", "Runway"]
    },
    {
      "id_film": 46,
      "titre": "Lost in Space",
      "realisateur": "SarahConnor",
      "outils": ["ChatGPT"]
    }
  ]
  ```

### 🔵 Détail d'un film
* **Route :** `GET /api/films/:id`
* **Description :** Voir tout le détail d'un film (Synopsis, Outils utilisés, Prompts).
* **JSON Renvoyé (Output) - 200 OK :**
  ```json
  {
    "id_film": 45,
    "titre": "Cyber Dreams",
    "description": "Un voyage onirique...",
    "video_url": "https://youtu.be/...",
    "statut": "APPROVED",
    "realisateur": { "id": 10, "pseudo": "SkyWalker" },
    "ia_utilisees": [
      {
        "outil": "Midjourney",
        "details": "Prompt: cyberpunk city, neon lights, 8k"
      },
      {
        "outil": "ElevenLabs",
        "details": "Voix off du narrateur"
      }
    ]
  }
  ```

### 🟢 Soumettre un film (Create)
* **Route :** `POST /api/films`
* **Description :** Un utilisateur envoie son film + les outils utilisés.
* **JSON Reçu (Input) :**
  ```json
  {
    "titre": "Cyber Dreams",
    "description": "Un voyage onirique...",
    "pays": "France",
    "duree_minutes": 5,
    "video_url": "https://youtu.be/...",
    "outils_ia": [
      { "id_outil_ia": 1, "details": "Prompt: cyberpunk city..." },
      { "id_outil_ia": 3, "details": "Voix off..." }
    ]
  }
  ```

* **JSON Renvoyé (Output) - 201 Created :**
  ```json
  {
    "message": "Film soumis avec succès",
    "id_film": 45,
    "statut": "PENDING"
  }
  ```

### 🟠 Modération d'un film (Admin)
* **Route :** `PATCH /api/films/:id/moderation`
* **Description :** L'admin valide ou refuse un film.
* **JSON Reçu (Input) :**
  ```json
  {
    "decision": "REFUSED",
    "raison": "La vidéo ne fonctionne pas.",
    "code_statut": "REFUSED"
  }
  ```

* **JSON Renvoyé (Output) - 200 OK :**
  ```json
  { "message": "Statut mis à jour", "nouveau_statut": "REFUSED" }
  ```

---

## 3. NOTATION & JURY ⭐
*Routes protégées : Nécessite le rôle JURY.*

### 🟢 Noter un film
* **Route :** `POST /api/films/:id/avis`
* **Description :** Un juré poste sa note.
* **JSON Reçu (Input) :**
  ```json
  {
    "score": 8,
    "commentaire": "Très belle technique, mais scénario faible."
  }
  ```

* **JSON Renvoyé (Output) - 201 Created :**
  ```json
  { "message": "Avis enregistré", "id_avis": 102 }
  ```

---

## 4. ÉVÉNEMENTS & RÉSERVATIONS 🎫

### 🔵 Lister les événements
* **Route :** `GET /api/events`
* **Description :** Voir l'agenda des événements à venir.
* **JSON Renvoyé (Output) - 200 OK :**
  ```json
  [
    {
      "id_evenement": 1,
      "titre": "Soirée de Gala",
      "date": "2026-06-20",
      "lieu": "Cinéma Le Prado",
      "places_restantes": 150
    }
  ]
  ```

### 🟢 Réserver une place
* **Route :** `POST /api/events/:id/reserve`
* **Description :** Un utilisateur prend son billet.
* **JSON Reçu (Input) :**
  ```json
  {
    "nb_place": 2
  }
  ```

* **JSON Renvoyé (Output) - 201 Created :**
  ```json
  {
    "message": "Réservation confirmée",
    "id_reservation": 888,
    "statut": "CONFIRMED"
  }
  ```

### 🔴 Annuler une réservation
* **Route :** `DELETE /api/reservations/:id`
* **Description :** L'utilisateur annule son billet.
* **JSON Renvoyé (Output) - 200 OK :**
  ```json
  { "message": "Réservation annulée" }
  ```

---

## 5. DONNÉES DE RÉFÉRENCE 📋
*Routes publiques pour remplir les formulaires.*

### 🔵 Obtenir les outils IA
* **Route :** `GET /api/tools`
* **JSON Renvoyé :**
  ```json
  [
    { "id_outil_ia": 1, "nom": "Midjourney" },
    { "id_outil_ia": 2, "nom": "ChatGPT" }
  ]
  ```

### 🔵 Obtenir les statuts possibles
* **Route :** `GET /api/status`
* **JSON Renvoyé :**
  ```json
  [
    { "id_statut_film": 1, "code": "PENDING", "libelle": "En attente" },
    { "id_statut_film": 2, "code": "APPROVED", "libelle": "Validé" }
  ]
  ```

---

## 6. 👤 GESTION DU PROFIL (DASHBOARD)
*Actuellement, un utilisateur ne peut pas voir ses propres informations ou modifier sa bio.*

### 🔵 Mon Profil (Moi)
* **Route :** `GET /api/users/me`
* **Description :** Récupérer mes infos personnelles (nécessite d'être connecté).
* **JSON Renvoyé :**
  ```json
  {
    "id_utilisateur": 10,
    "pseudo": "SkyWalker",
    "email": "lucas@mail.com",
    "bio": "Réalisateur passionné par l'IA...",
    "role_codes": ["USER"]
  }
  ```

### 🟢 Mettre à jour mon profil
* **Route :** `PATCH /api/users/me`
* **Description :** Changer sa bio, son site web ou son avatar.
* **JSON Reçu :**
  ```json
  {
    "bio": "Nouvelle bio mise à jour...",
    "site_web": "https://lucas-portfolio.com"
  }
  ```

### 🔵 Mes Films (Dashboard Réalisateur)
* **Route :** `GET /api/users/me/films`
* **Description :** Voir la liste de mes films (même ceux qui sont refusés ou en attente, contrairement à la route publique).
* **JSON Renvoyé :**
  ```json
  [
    {
      "id_film": 45,
      "titre": "Cyber Dreams",
      "statut": "PENDING"
    },
    {
      "id_film": 12,
      "titre": "Vieux brouillon",
      "statut": "REFUSED"
    }
  ]
  ```

---

## 7. ✏️ MODIFICATION & SUPPRESSION (CRUD)
*Actuellement, si un utilisateur fait une faute de frappe dans le titre de son film, il ne peut pas corriger.*

### 🟠 Modifier mon film
* **Route :** `PATCH /api/films/:id`
* **Description :** Le réalisateur corrige son film (Titre, Description, URL).
* **JSON Reçu :**
  ```json
  {
    "titre": "Cyber Dreams (Version Finale)",
    "description": "Correction du synopsis..."
  }
  ```

### 🔴 Supprimer mon film
* **Route :** `DELETE /api/films/:id`
* **Description :** Le réalisateur décide de retirer son film du concours.
* **JSON Renvoyé :**
  ```json
  { "message": "Film supprimé avec succès" }
  ```

---

## 8. 📧 NEWSLETTER
*Route pour remplir la table NEWSLETTER.*

### 🟢 S'inscrire à la newsletter
* **Route :** `POST /api/newsletter/subscribe`
* **Description :** Un visiteur (même non connecté) laisse son email.
* **JSON Reçu :**
  ```json
  {
    "email": "fan@cinema.com",
    "langue": "fr"
  }
  ```

* **JSON Renvoyé (201 Created) :**
  ```json
  { "message": "Inscription validée" }
  ```

---

## 9. 🛠️ ADMINISTRATION (BACK-OFFICE)
*Gestion des événements pour éviter les insertions manuelles en SQL.*

### 🟢 Créer un événement (Admin)
* **Route :** `POST /api/admin/events`
* **JSON Reçu :**
  ```json
  {
    "titre": "Workshop IA & Cinéma",
    "date_event": "2026-07-10",
    "id_lieu": 2,
    "capacite": 50
  }
  ```

### 🔴 Supprimer un événement (Admin)
* **Route :** `DELETE /api/admin/events/:id`
* **JSON Renvoyé :**
  ```json
  { "message": "Événement annulé" }
  ```

---

## 💡 Codes HTTP à respecter

| Code | Signification | Contexte |
|------|---------------|----------|
| 200 | OK | Requête réussie (Lecture, Modif, Suppression) |
| 201 | Created | Ressource créée avec succès (Inscription, Ajout Film) |
| 400 | Bad Request | Données invalides envoyées par le client |
| 401 | Unauthorized | Non connecté (Token manquant ou invalide) |
| 403 | Forbidden | Connecté mais droits insuffisants (ex: User veut modérer) |
| 404 | Not Found | Ressource introuvable (ID film inconnu) |
| 409 | Conflict | Conflit (ex: Email déjà utilisé, Film déjà noté) |
| 500 | Server Error | Erreur interne (Bug du code ou BDD down) |
