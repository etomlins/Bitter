const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const protectedRoutes = require('./routes/protected');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const Tweet = require('./models/Tweet');
const User = require('./models/User');
const authenticateToken = require('./middleware/auth');
const userRoutes = require('./routes/userRoutes');


dotenv.config();

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000, 
    });
    console.log("MongoDB connected successfully!");
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectToDatabase();

app.get('/', (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
      res.redirect('/tweets');
  } else {
      res.redirect('/auth/login');
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// auth routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

// tweet routes
const tweetRoutes = require('./routes/tweetRoutes');

app.use('/tweets', tweetRoutes);
app.use('/users', userRoutes);


// cookies
// app.get('/set-cookies', (req,res) => {
//   res.cookie('newUser',false, {maxAge: 1000 * 60 * 60 * 24,httpOnly:true})
//   res.send('you got the cookies!')
// });

// app.get('/read-cookies', (req,res) => {
//   const cookies = req.cookies;
//   console.log(cookies);
//   res.json(cookies);
// });