const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.use(flash());


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Load from .env
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      httpOnly: 
      maxAge: 1000 * 60 * 60 * 24, // 1-day expiration
    },
  })
);

// Database Connection
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('connected', () => console.log('Database connected.'));
mongoose.connection.on('error', (err) => {
  console.error('Database connection error:', err.message);
  process.exit(1); // Exit if database connection fails
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Helper Function for Password Validation
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Middleware for Authentication
function checkAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// Routes
app.get('/', checkAuth, (req, res) => {
  res.render('index', { user: req.session.userName });
});

app.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword} = req.body;

    if (!name || !email || !password || !confirmPassword) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/signup');
    }

    if (!validatePassword(password)) {
      req.flash('error', 'Password must be at least 8 characters long and include at least one letter and one number.');
      return res.redirect('/signup');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/signup');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email is already in use.');
      return res.redirect('/signup');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.redirect('/login');
  } catch (err) {
    console.error('Signup Error:', err.message);
    req.flash('error', 'An error occurred while creating your account.');
    res.redirect('/signup');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password} = req.body;

    if (!email || !password) {
      req.flash('error', 'Both email and password are required.');
      alert("Both email and password are required");
      return res.redirect('/login');
    }

    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    req.session.userId = user._id;
    req.session.userName = user.name;

    res.redirect('/');
  } catch (err) {
    console.error('Login Error:', err.message);
    req.flash('error', 'An error occurred during login.');
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).render('error', { message: 'Something went wrong, please try again later.' });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
