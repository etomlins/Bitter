const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  if (err.message === 'incorrect password') {
    errors.password = 'Incorrect password';
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

// GET request for signup
module.exports.signup_get = (req, res) => {
  res.render('register');
};

// POST request for signup
module.exports.signup_post = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // create a new user
    const user = await User.create({ email, username, password });
    
    // create a JWT token
    const token = createToken(user._id, user.username);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect(`/tweets`);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// GET request for login
module.exports.login_get = (req, res) => {
  res.render('login');
};

// POST request for login
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    console.log('it worked!')

    const token = jwt.sign({ id: user._id, username: user.username}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect(`/tweets`);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
