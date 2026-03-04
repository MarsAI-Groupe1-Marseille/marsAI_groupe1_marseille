const crypto = require('crypto');

/**
 * Script pour générer des secrets sécurisés
 * Usage: node generate-secrets.js
 */

console.log('GÉNÉRATION DE SECRETS SÉCURISÉS');
console.log('=====================================\n');

console.log('JWT_SECRET=');
console.log(crypto.randomBytes(64).toString('hex'));
console.log('\n');

console.log('SESSION_SECRET=');
console.log(crypto.randomBytes(64).toString('hex'));
console.log('\n');

console.log('=====================================');
console.log('Copiez ces valeurs dans votre fichier .env');
console.log('Ne partagez JAMAIS ces secrets !');
