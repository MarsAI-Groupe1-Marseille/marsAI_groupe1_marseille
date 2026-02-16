# 📡 DOCUMENTATION API - MARS AI Festival

**Version API :** 2.0  
**Base URL :** `http://localhost:3000` (ou votre domaine)

---

## 1. SOUMISSION PUBLIQUE (Cœur du Système) 🎬

Pas besoin de compte. Le réalisateur remplit le formulaire et envoie tout.

### 🟢 Soumettre un film (Formulaire Principal)

**Route :** `POST /api/submissions`

**Format :** `multipart/form-data` (Important pour les fichiers)

**Description :** Crée le réalisateur (si nouveau), le film, l'équipe et upload les fichiers.

#### Champs Requis (Body) :

| Champ | Type | Description |
| :--- | :--- | :--- |
| **Director Info** | | |
| director_email | String | Email du réalisateur (Clé unique) |
| director_firstname | String | Prénom |
| director_lastname | String | Nom |
| director_birthdate | Date | YYYY-MM-DD (Check 18+) |
| director_phone | String | Mobile |
| director_job | String | Métier |
| director_address | String | Adresse complète |
| **Film Info** | | |
| title_original | String | Titre du film |
| synopsis_original | String | Pitch (max 300 car.) |
| duration | Int | Durée en secondes |
| ai_classification | Enum | '100% IA' ou 'Hybrid' |
| ai_tools | String | Liste des outils (Midjourney, Runway...) |
| **Fichiers** | | |
| video_file | File | Le fichier vidéo (.mp4) |
| poster_file | File | L'affiche (.jpg, .png) |
| subtitle_file | File | (Optionnel) Le fichier .srt |
| gallery_files | Files[] | (Optionnel) Jusqu'à 3 images |
| **JSON Data** | | |
| collaborators | String | JSON stringifié : `[{"role":"Monteur", "first_name":"Bob"}]` |

#### JSON Renvoyé (201 Created) :

```json
{
  "message": "Film envoyé avec succès !",
  "submission_id": 45,
  "youtube_id": "dQw4w9WgXcQ",
  "edit_token": "123e4567-e89b-12d3-a456-426614174000",
  "director": "Steven Spielberg"
}
```

---

## 2. ÉDITION RÉALISATEUR (Via Token) ✏️

Le réalisateur utilise le lien reçu par email pour modifier sa fiche.

### 🔵 Récupérer ma soumission

**Route :** `GET /api/submissions/:token`

**Description :** Affiche le formulaire pré-rempli pour modification.

#### JSON Renvoyé (200 OK) :

```json
{
  "id": 45,
  "title_original": "Le Retour du Robot",
  "poster_url": "uploads/poster-123.jpg",
  "video_status": "ready",
  "director": {
    "first_name": "Steven",
    "last_name": "Spielberg",
    "email": "spielberg@gmail.com"
  },
  "collaborators": [
    { "role": "Monteur", "first_name": "Michael", "last_name": "Kahn" }
  ]
}
```

### 🟠 Modifier les textes (Pas la vidéo)

**Route :** `PUT /api/submissions/:token`

**Format :** `application/json` (ou `multipart` si on change l'affiche)

**Description :** Met à jour titre, synopsis, équipe ou affiche. Interdit de changer la vidéo ici.

#### JSON Reçu :

```json
{
  "title_original": "Le Retour du Robot (Final Cut)",
  "synopsis_original": "Correction de la description...",
  "collaborators": [...]
}
```

---

## 3. AUTHENTIFICATION (Admin & Jury) 🔐

Seuls les membres du staff ont un compte avec mot de passe.

### 🟢 Connexion (Login)

**Route :** `POST /api/auth/login`

#### JSON Reçu :

```json
{
  "email": "jury@mars-festival.com",
  "password": "secretPassword"
}
```

#### JSON Renvoyé (200 OK) :

```json
{
  "token": "eyJhbGciOiJIUzI...",
  "user": {
    "id": 2,
    "role": "jury",
    "full_name": "Alice Jury"
  }
}
```

---

## 4. DASHBOARD JURY & ADMIN 🕵️

Routes protégées (Header : `Authorization: Bearer TOKEN`)

### 🔵 Lister tous les films

**Route :** `GET /api/admin/submissions`

**Filtres (Query Params) :** `?status=submitted` (nouveaux), `?status=approved`, `?ai=100% IA`

#### JSON Renvoyé :

```json
[
  {
    "id": 45,
    "title": "Le Retour du Robot",
    "director": "Steven Spielberg",
    "status": "submitted",
    "ai_classification": "Hybrid",
    "thumbnail": "uploads/poster-123.jpg"
  }
]
```

### 🟠 Modération (Valider/Refuser)

**Route :** `PATCH /api/admin/submissions/:id/status`

**Description :** L'admin valide le film ou demande des corrections.

#### JSON Reçu :

```json
{
  "approval_status": "rejected",
  "reason": "Son inaudible à 00:45"
}
```

---

## 5. SYSTÈME DE VOTE (Jury) ⭐

### 🟢 Ajouter un vote

**Route :** `POST /api/jury/vote`

**Description :** Un juré donne son avis sur un film.

#### JSON Reçu :

```json
{
  "submission_id": 45,
  "vote_status": "LIKE",
  "comment": "Visuellement bluffant mais scénario faible."
}
```

### 🔵 Voir les résultats (Admin)

**Route :** `GET /api/admin/submissions/:id/votes`

#### JSON Renvoyé :

```json
{
  "submission_id": 45,
  "stats": { "LIKE": 3, "DISLIKE": 1, "DISCUSS": 0 },
  "details": [
    { "jury": "Alice", "vote": "LIKE", "comment": "Top !" }
  ]
}
```

---

## 6. GALERIE PUBLIQUE 🌍

Ce que voient les visiteurs du site.

### 🔵 Le Catalogue (Films Validés)

**Route :** `GET /api/gallery`

**Filtres :** `?year=2026`, `?winner=true`

**Description :** Ne renvoie QUE les films où `approval_status = 'approved'`.

#### JSON Renvoyé :

```json
[
  {
    "id": 45,
    "youtube_id": "dQw4w9WgXcQ",
    "title": "Le Retour du Robot",
    "director": "Steven Spielberg",
    "synopsis": "Un robot cherche...",
    "tags": ["Futur", "Espace"],
    "poster_url": "http://api.marsfestival.com/uploads/poster-123.jpg"
  }
]
```

---

## 7. TABLE DE RÉFÉRENCE (Listes déroulantes) 📋

### 🔵 Infos Formulaire

**Route :** `GET /api/config/form-data`

**Description :** Pour remplir les select du frontend.

#### JSON Renvoyé :

```json
{
  "ai_classifications": ["100% IA", "Hybrid"],
  "civilities": ["M", "Mme", "Iel"],
  "marketing_sources": ["Instagram", "LinkedIn", "Bouche à oreille"]
}
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
