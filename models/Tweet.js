const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  id: { type: String },
  content: { type: String, required: true, maxlength: 280 },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

TweetSchema.pre('save', function (next) {
  this.id = this._id.toString();
  next();
});

const Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;
