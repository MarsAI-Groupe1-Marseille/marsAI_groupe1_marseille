const bcrypt = require('bcryptjs');

async function testLogin() {
  // Test password: password123
  const hashedPassword = '$2b$10$wsDcaDk5BP.qIfugqE./geLIroEJdORZ9YfzVr3RY5fMlrLRjG.pm';
  const passwordToTest = 'password123';

  const isMatch = await bcrypt.compare(passwordToTest, hashedPassword);
  console.log('Password match:', isMatch);
  console.log('\nTest données:');
  console.log('Email: jury@test.com');
  console.log('Password: password123');
  console.log('Hash stored:', hashedPassword);
}

testLogin();
