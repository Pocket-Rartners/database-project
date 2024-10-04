// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors'); // Import CORS middleware

// Load environment variables
require('dotenv').config();

// Initialize the Express app
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_ATLAS_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Carousel schema
const slideSchema = new mongoose.Schema({
    url: { type: String, required: true },
    transitionType: { type: String, required: true },
    transitionInterval: { type: Number, required: true },
    isCollapsed: { type: Boolean, default: false },
});

const carouselSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    slides: { type: [slideSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: false }
});

// User model
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    carousels: { type: Array, default: [] },
    id: { type: String, unique: true, required: true },
    activeCarousel: { type: Object, default: null },
});

const User = mongoose.model('User', userSchema);

// Set up the session store
const mongoStore = new MongoStore({
    mongoUrl: process.env.MONGODB_ATLAS_URI,
    collectionName: 'sessions',
});

// Middleware setup
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(
    { usernameField: 'userName' },
    (userName, password, done) => {
        User.findOne({ userName })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect username' });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        return done(err);
                    }
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                });
            })
            .catch(err => {
                console.error('Error during user authentication:', err);
                return done(err);
            });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findOne({ id })
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            console.error('Error during user deserialization:', err);
            done(err);
        });
});

// Routes
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome, ' + req.user.userName + '!');
    } else {
        res.sendFile(__dirname + '/login.html');
    }
});

// Login route
app.post('/login', passport.authenticate('local'), (req, res) => {
    const { userName, id, carousels, activeCarousel } = req.user;
    res.json({ user: { userName, id, carousels, activeCarousel } });
});

// Signup route
app.post('/signup', async (req, res) => {
    const { userName, password, id } = req.body;

    console.log('Signup data:', req.body);

    if (!userName || !password || !id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            password: hashedPassword,
            carousels: [],
            id,
        });

        const result = await newUser.save();
        console.log('New user saved:', result);
        res.status(201).json({ user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user information by ID
app.get('/getUser/:id', async (req, res) => {
    const userId = req.params.id;

    console.log('GetUser request for ID:', userId);

    try {
        // Find the user by user ID
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user information, excluding the password
        const { password, ...userInfo } = user.toObject(); 
        res.status(200).json({ user: userInfo });
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ message: 'Server error while retrieving user' });
    }
});

// add new carousel
app.post('/NewCarousel', async (req, res) => {
    const { userId, carouselData } = req.body;

    console.log('NewCarousel request body:', req.body);

    // Check for required fields
    if (!userId || !carouselData) {
        return res.status(400).json({ message: 'User ID and carousel data are required' });
    }

    try {
        // Find the user by userId
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new carousel object
        const newCarousel = {
            id: carouselData.id,
            title: carouselData.title,
            slides: carouselData.slides,
            createdAt: new Date(),
            active: carouselData.active,
        };

        // Add the new carousel to the user's carousels array
        user.carousels.push(newCarousel);
        
        // Save the updated user document
        await user.save();

        res.status(201).json({ message: 'Carousel saved successfully', carousel: newCarousel });
    } catch (error) {
        console.error('Error saving carousel:', error);
        res.status(500).json({ message: 'Server error while saving carousel' });
    }
});

// Update carousel
app.post('/updateCarousel', async (req, res) => {
    const { userId, carouselId, updatedCarouselData } = req.body;

    console.log('UpdateCarousel request body:', req.body);

    // Check for required fields
    if (!userId || !carouselId || !updatedCarouselData) {
        return res.status(400).json({ message: 'User ID, carousel ID, and updated carousel data are required' });
    }

    try {
        // Find the user by userId
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the carousel within the user's carousels
        const carouselIndex = user.carousels.findIndex(carousel => carousel.id === carouselId);
        if (carouselIndex === -1) {
            return res.status(404).json({ message: 'Carousel not found' });
        }

        // Update the carousel properties
        user.carousels[carouselIndex] = {
            ...user.carousels[carouselIndex],
            ...updatedCarouselData,
        };

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Carousel updated successfully', carousel: user.carousels[carouselIndex] });
    } catch (error) {
        console.error('Error updating carousel:', error);
        res.status(500).json({ message: 'Server error while updating carousel' });
    }
});

// Delete carousel
app.delete('/deleteCarousel', async (req, res) => {
    const { userId, carouselId } = req.body;

    try {
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.carousels = user.carousels.filter(carousel => carousel.id !== carouselId);
        await user.save();

        res.status(200).json({ message: 'Carousel deleted successfully' });
    } catch (error) {
        console.error('Error deleting carousel:', error);
        res.status(500).json({ message: 'Server error while deleting carousel' });
    }
});


// Start server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
