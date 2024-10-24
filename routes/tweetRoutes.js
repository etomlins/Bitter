const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');
const authenticateToken = require('../middleware/auth');

// fetch tweets
router.get('/', authenticateToken, async (req, res) => {
    try {
        const tweets = await Tweet.find().populate('authorId', 'username');
        
        const posts = tweets.map(tweet => ({
            id: tweet.id,
            content: tweet.content,
            authorId: tweet.authorId,
            likecount: tweet.likes.length,
            likedByUser: tweet.likes.includes(req.user._id)
        }));
    
        res.render('main_content', { posts, currentUsername: req.user.username, userId: req.user.id});
    } catch (err) {
        console.error('Failed to fetch tweets:', err);
        res.status(500).send('Server Error');
    }
});

// create a new tweet
router.post('/', authenticateToken, async (req, res) => {
    const { content } = req.body;
    try {
        console.log('Creating new tweet...');
        const username = req.user.username;
        console.log(username)
        console.log(req.user.id)

        const tweet = await Tweet.create({ content, authorId: req.user.id, likes: []});
        
        res.status(201).json({
            id: tweet.id,
            content: tweet.content,
            authorId: tweet.authorId,
            the_username: username,
            likes: tweet.likes
        });
    } catch (err) {
        console.error('Failed to create tweet:', err);
        res.status(500).json({ error: 'Failed to create tweet' });
    }
});

router.post('/:id/likes', authenticateToken, async (req, res) => {
    try {
        console.log('Handling like/unlike request...');
        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) return res.status(404).json({ error: 'Tweet not found' });

        const userId = req.user._id;
        const index = tweet.likes.indexOf(userId);

        if (index === -1) {
            tweet.likes.push(userId);
        } else {
            tweet.likes.splice(index, 1);
        }

        await tweet.save();
        console.log('Tweet successfully liked or unliked!');
        
        res.status(200).json({ 
            success: true, 
            likesCount: tweet.likes.length 
        });
    } catch (error) {
        console.error('Error liking the tweet:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
