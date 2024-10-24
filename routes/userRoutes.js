const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Tweet = require('../models/Tweet');
const authenticateToken = require('../middleware/auth');

// get user profile by username
router.get('/:username', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        userId = user._id;
        const currUserId = req.user.id;
        console.log('hiiii')
        console.log(currUserId)

        if (!user) return res.status(404).json({ error: 'User not found' });
        const followers = user.followers;
        const following = user.following;
        const user1 = await User.findOne({ username: req.params.username })
                                    .populate('followers', 'username _id')
                                    .populate('following', 'username _id');
        const isFollowing = user1.followers?.some(
            (follower) => follower._id?.toString() === req.user?._id?.toString()
          );
      
        const tweets = await Tweet.find({ authorId: user._id }).sort({ createdAt: -1 });

        const likedTweets = await Tweet.find({ likes: user._id });
        console.log({
            user,
            userId,
            tweets,
            likedTweets,
            currUserId,
            followers,
            following,
            isFollowing
        });
        
        res.render('profile', {
            user,
            userId,
            tweets,
            likedTweets,
            currUserId, 
            followers,
            following,
            isFollowing
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'An error occurred erm' });
    }
});

router.post('/:userId/followings', authenticateToken, async (req, res) => {
    try {
      const { targetUserId } = req.body;
  
      const user = await User.findById(req.params.userId);
      const targetUser = await User.findById(targetUserId);
  
      if (!user || !targetUser) return res.status(404).json({ error: 'User not found' });
  
      const isFollowing = user.following.includes(targetUserId);
  
      if (isFollowing) {
        user.following = user.following.filter(id => id.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== user._id.toString());
        await user.save();
        await targetUser.save();
        res.status(200).json({ message: 'Unfollowed user' });
      } else {
        user.following.push(targetUserId);
        targetUser.followers.push(user._id);
        await user.save();
        await targetUser.save();
        res.status(201).json({ message: 'Followed user' });
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
    
// get followers of a user
router.get('/:userId/followers', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('followers', 'username');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user.followers);
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// get the users a user is following
router.get('/:userId/followings', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('following', 'username');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user.following);
    } catch (error) {
        console.error('Error fetching followings:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
