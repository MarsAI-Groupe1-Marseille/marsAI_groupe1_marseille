# 🔒 GUIDE DE SÉCURITÉ - MARSAI FESTIVAL

## Configuration initiale (OBLIGATOIRE)

### 1. Créer le fichier .env

```bash
cd backend
cp .env.example .env
```

### 2. Générer les secrets sécurisés

```bash
node generate-secrets.js
```

Copiez les valeurs générées dans votre `.env` :
- `JWT_SECRET` - Pour signer les tokens d'authentification
- `SESSION_SECRET` - Pour sécuriser les sessions

### 3. Définir les credentials par défaut

Dans `.env`, définissez :
```env
ADMIN_DEFAULT_EMAIL=admin@votredomaine.com
ADMIN_DEFAULT_PASSWORD=UnMotDePasseTrèsComplexe123!@#

JURY_DEFAULT_EMAIL=jury@test.fr
JURY_DEFAULT_PASSWORD=AutreMotDePasseComplexe456!@#
```

⚠️ **IMPORTANT** : Changez ces mots de passe immédiatement après la première connexion !

## Bonnes pratiques

### ✅ À FAIRE

1. **Ne JAMAIS commiter le fichier `.env`** (déjà dans .gitignore)
2. **Utiliser des mots de passe forts** (minimum 12 caractères, majuscules, minuscules, chiffres, symboles)
3. **Régénérer les secrets** lors du passage en production
4. **Activer HTTPS** en production (`NODE_ENV=production`)
5. **Utiliser des variables d'environnement** pour toutes les configurations sensibles

### ❌ À NE PAS FAIRE

1. ❌ Partager les secrets dans le code source
2. ❌ Utiliser les mêmes secrets en dev et en production
3. ❌ Logger les mots de passe ou tokens dans la console
4. ❌ Utiliser des mots de passe par défaut en production
5. ❌ Désactiver les protections CSRF ou rate limiting

## Sécurité en production

### Variables critiques à définir

```env
NODE_ENV=production
JWT_SECRET=[secret-unique-64-chars]
SESSION_SECRET=[secret-unique-64-chars]
FRONTEND_URL=https://votredomaine.com
```

### Checklist de mise en production

- [ ] Secrets régénérés (JWT_SECRET, SESSION_SECRET)
- [ ] Mots de passe par défaut changés
- [ ] HTTPS activé
- [ ] Base de données sécurisée
- [ ] Rate limiting configuré
- [ ] CORS configuré avec domaines autorisés
- [ ] Logs de sécurité activés
- [ ] Backups automatisés configurés

## En cas de compromission

Si vous suspectez une fuite de secrets :

1. **Régénérer immédiatement** tous les secrets
2. **Forcer la déconnexion** de tous les utilisateurs
3. **Changer tous les mots de passe** des comptes par défaut
4. **Auditer les logs** pour détecter les accès suspects
5. **Notifier les utilisateurs** si nécessaire

## Support

Pour toute question de sécurité : security@marsai.com
