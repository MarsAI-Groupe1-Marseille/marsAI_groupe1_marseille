# MARS AI - Guide des Workflows de l'application

Ce document explique, pas à pas, les workflows utilises dans l'app (backend + frontend), avec des exemples concrets simples.

---

## 1. Vue d'ensemble de l'architecture

### 1.1 Frontend
- Stack: React + Vite
- Role: afficher les pages, envoyer les requetes API, gerer les etats (auth, langue, erreurs)

### 1.2 Backend
- Stack: Node.js + Express + Sequelize + MySQL
- Role: securite, logique metier, validation, orchestration (S3, YouTube, emails)

### 1.3 Services externes
- Scaleway S3: stockage des fichiers (video, poster, galerie, sous-titres)
- YouTube API: publication des videos en mode `unlisted`
- SMTP/Nodemailer: envoi des mails transactionnels

---

## 2. Workflow Authentification (login + acces par role)

### 2.1 Etapes
1. L'utilisateur envoie email + mot de passe depuis le frontend.
2. Le backend verifie l'utilisateur (`User.findOne`) puis compare le mot de passe (`bcrypt.compare`).
3. Si OK, creation d'un JWT (`jsonwebtoken`) avec `id` + `role`.
4. Le JWT est stocke en cookie HttpOnly (`token`).
5. Le frontend appelle `/auth/me` au demarrage pour restaurer la session.
6. Les routes protegees verifient:
   - token valide (`verifyToken`)
   - role autorise (`checkRole`)

### 2.2 Exemple concret simple
```js
// Route protegee admin/moderator
router.get('/dashboard/stats', verifyToken, checkRole('admin', 'moderator'), controller)
```

---

## 3. Workflow Soumission d'un film (le plus important)

### 3.1 Etapes (ordre reel)
1. Le formulaire frontend envoie metadata + fichiers multipart.
2. `multer-s3` upload immediatement les fichiers vers Scaleway S3.
3. Le backend valide:
   - type de fichier (extension)
   - signature binaire (magic bytes) via `fileValidationService`
4. Le backend cree ou recupere le `Director`.
5. Le backend stream la video de S3 vers YouTube (`youtube.videos.insert`).
6. Le backend cree la `Submission` (avec `youtube_id`, URLs, statut `submitted`).
7. Le backend cree les `Collaborator` si presents.
8. Le backend tente d'envoyer un email de confirmation.
9. En cas d'erreur, nettoyage des objets S3 uploades (`cleanupUploadedFiles`).

### 3.2 Pourquoi ce workflow est complexe
- C'est une orchestration multi-systemes: S3 + YouTube + DB + Email.
- Une erreur doit etre geree proprement pour eviter les donnees orphelines.

### 3.3 Exemple concret simple (version reduite)
```js
const submission = await Submission.create({
  title_original: 'Mon film',
  director_id: 1,
  approval_status: 'submitted'
})
```

---

## 4. Workflow Moderation (admin/moderator)

### 4.1 Etapes
1. La page de gestion recupere les films (`GET /api/submissions?page=&limit=&status=`).
2. L'admin ouvre un film et choisit:
   - approuver
   - rejeter (avec motif + description)
3. Le frontend envoie `POST /api/admin/moderation/:submissionId`.
4. Le backend (`moderateSubmission`) ouvre une transaction SQL.
5. Si approuve:
   - `approval_status = approved`
   - envoi email d'acceptation
6. Si refuse:
   - `approval_status = rejected`
   - creation d'un `ModerationTicket`
   - envoi email de refus

### 4.2 Exemple concret simple
```js
await axios.post(`/admin/moderation/${filmId}`, { status: 'approved' })
```

---

## 5. Workflow Jury (distribution + vote)

### 5.1 Distribution des films au jury
1. L'admin cree une playlist (`JuryList`).
2. L'admin assigne des films (`JuryListSubmission`).
3. L'admin assigne des jurys (`JuryMember`).
4. Un jury connecte recupere ses playlists via `/api/jury/my-playlists`.

### 5.2 Evaluation d'un film
1. Le jury ouvre un film (page notation).
2. Le frontend charge:
   - details film
   - votes deja faits par ce jury
3. Si vote existant: affichage en mode "deja soumis".
4. Sinon: restoration d'un draft localStorage si present.
5. Le jury vote `LIKE | DISLIKE | DISCUSS` + commentaire optionnel.
6. Envoi a `/api/jury/vote`.
7. Backend: `findOrCreate` puis update si vote deja present.

### 5.3 Point technique utile
- Le draft local evite de perdre un vote si la page est rafraichie.

### 5.4 Exemple concret simple
```js
await axios.post('/jury/vote', {
  submissionId: id,
  vote_status: 'LIKE',
  comment: 'Bonne direction artistique'
})
```

---

## 6. Workflow Finalistes et Palmares

### 6.1 Etapes
1. L'admin consulte les candidats finalistes (`GET /api/admin/finalists`).
2. Cette route agrege les votes jury (SQL + stats LIKE/DISCUSS/DISLIKE).
3. L'admin marque un film `is_selected` et peut definir `award_winner`.
4. Le frontend public affiche les laureats via `GET /api/awards`.
5. La route awards ne retourne que les films:
   - selectionnes
   - avec prix
   - deja approuves

### 6.2 Exemple concret simple
```js
await axios.put(`/admin/finalists/${submissionId}`, {
  is_selected: true,
  award_winner: 'Grand Prix'
})
```

---

## 7. Workflow Configuration de la page d'accueil

### 7.1 Etapes
1. Admin charge config (`GET /api/admin/home-config`).
2. Admin modifie les blocs (hero, categories, awards, partners).
3. Images en base64 -> traitees puis upload S3 via helper.
4. Backend sauvegarde en DB (`SiteConfig`).

### 7.2 Exemple concret simple
```js
await axios.post('/admin/home-config', {
  hero: { title: 'Festival Mars AI' }
})
```

---

## 8. Workflow Internationalisation et erreurs globales

### 8.1 Internationalisation
1. `LanguageContext` maintient la langue (`fr` ou `en`).
2. Sauvegarde dans localStorage.
3. Les composants appellent `t('cle')`.

### 8.2 Erreurs globales
1. Axios interceptor capte les erreurs API.
2. `ErrorContext` transforme l'erreur en message user.
3. `ErrorDisplay` affiche le toast.
4. Certaines requetes peuvent ignorer ce systeme avec `skipErrorHandling: true`.

### 8.3 Exemple concret simple
```js
axios.get('/auth/me', { skipErrorHandling: true })
```

---

## 9. Securite transversale (appliquee partout)

### 9.1 CSRF
- Toute mutation (POST/PUT/DELETE/PATCH) utilise un token CSRF.
- Le frontend recupere un token (`/api/csrf-token`) et l'ajoute via interceptor.

### 9.2 Rate limiting
- generalLimiter: anti-abus global
- strictLoginLimiter: anti brute-force login
- uploadLimiter: limite les uploads
- authenticatedLimiter: limite les routes protegees

### 9.3 Helmet + CORS + cookies
- Headers de securite HTTP via Helmet
- CORS controle des origins
- cookies HttpOnly + sameSite=strict

---

## 10. Bibliotheques utilisees et utilite concrete

## 10.1 Backend
- express: routes et middleware HTTP
  - Exemple: `app.use('/api/admin', adminRoutes)`
- sequelize + mysql2: acces DB relationnelle
  - Exemple: `Submission.findAndCountAll({ where, limit, offset })`
- bcrypt: verification mot de passe
  - Exemple: `bcrypt.compare(password, user.password_hash)`
- jsonwebtoken: signature et verification JWT
  - Exemple: `jwt.sign({ id, role }, secret)`
- express-session + express-csurf + connect-session-sequelize: session + CSRF
  - Exemple: middleware `csrfProtection` sur les routes mutation
- multer + multer-s3 + @aws-sdk/client-s3: upload et lecture S3
  - Exemple: upload champs `video_file`, `poster_file`, `gallery_files`
- googleapis: upload video/sous-titres YouTube
  - Exemple: `youtube.videos.insert({ media: { body: streamS3 } })`
- nodemailer: emails transactionnels
  - Exemple: `sendSubmissionConfirmation()`
- helmet + express-rate-limit + cors + cookie-parser: securite HTTP

## 10.2 Frontend
- react + react-dom: UI et rendu
- react-router-dom: routage et routes protegees
  - Exemple: `<ProtectedRoute allowedRoles={['admin']}>`
- axios: client HTTP + interceptors CSRF/erreurs
- react-hook-form: gestion des formulaires complexes
- recharts: graphiques dashboard admin/jury
- lucide-react: icones UI
- framer-motion + gsap: animations
- tailwindcss + vite: style utilitaire + build dev rapide

---

## 11. Fonctions complexes a expliquer au groupe

### 11.1 `createSubmission` (backend/controllers/submissionController.js)
- Pourquoi c'est complexe: enchaine validation, DB, YouTube, email, cleanup.
- Ce qu'il faut retenir: une seule route pilote plusieurs sous-systemes.

### 11.2 `getFinalistCandidates` (backend/controllers/finalistController.js)
- Pourquoi c'est complexe: SQL dynamique + filtres + pagination + aggregation + enrichissement evaluations.
- Ce qu'il faut retenir: la logique de classement final est majoritairement server-side.

### 11.3 `getAllJuryWithStats` (backend/controllers/juryController.js)
- Pourquoi c'est complexe: combine plusieurs requetes (ORM + SQL brut) puis recalcule les stats.
- Ce qu'il faut retenir: evite de recalculer ces stats dans le frontend.

### 11.4 `NotationJury` (frontend/src/pages/NotationJury.jsx)
- Pourquoi c'est complexe: synchronise vote serveur, draft local, etat UI soumis/non soumis.
- Ce qu'il faut retenir: localStorage sert de securite UX, pas de source officielle.

---

## 12. Processus global simplifie (resume pour l'equipe)

1. Un realisateur soumet un film.
2. Le backend stocke les fichiers et cree la soumission.
3. Admin/moderator valide ou refuse.
4. Les films valides sont distribues au jury.
5. Le jury vote.
6. L'admin selectionne les finalistes et attribue les prix.
7. Le palmares public est genere automatiquement a partir de la base.

---

Si besoin, je peux faire une version 2 de ce document avec un schema Mermaid (diagramme) pour presenter ca rapidement en reunion de groupe.
