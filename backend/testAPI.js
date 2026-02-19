// Test API endpoint
const http = require('http');
const jwt = require('jsonwebtoken');

// Créer un token pour l'utilisateur jury (ID 20)
const token = jwt.sign(
  { id: 20, email: 'jury@test.com', role: 'jury' },
  process.env.JWT_SECRET || 'your-secret-key',
  { expiresIn: '24h' }
);

console.log('Token créé:', token.substring(0, 50) + '...\n');

// Tester l'endpoint
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/jury/my-playlists',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('✅ Réponse API:');
    try {
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch {
      console.log(data);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Erreur API:', err.message);
});

req.end();
