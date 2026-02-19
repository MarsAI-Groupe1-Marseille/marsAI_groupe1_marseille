const bcrypt = require('bcryptjs');

async function createHashedPassword() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hashedPassword);
  console.log('\nUse this hash in your database');
}

createHashedPassword();
