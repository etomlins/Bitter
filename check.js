const bcrypt = require('bcryptjs');

const plainPassword = 'hudson';
const hashedPassword = '$2a$10$Xr3xKc3xXK9pKhptxKLKRubKppQpLKiTYglqIlxlIZNzANh9TkHo.';

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) {
    console.error('Error during bcrypt compare:', err);
  } else if (isMatch) {
    console.log('Password matches successfully!');
  } else {
    console.log('Password mismatch.');
  }
});
