const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', versionKey: false }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', versionKey: false }]
});

// hash password

UserSchema.pre('save', async function(next) {
  console.log("Hashing password for user:", this.email);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// static method to login user
UserSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    console.log("Email from request:", email);
    console.log("Password from request:", password);
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password :(');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('User', UserSchema);


module.exports = User;
