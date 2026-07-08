import 'dotenv/config'; // Ensures your .env variables load
import express from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';

// Import your custom modules
import router from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';
import { setupDatabase, testConnection } from './src/models/setup.js'; // NEW: Import DB setup

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Static Assets & View Engine Setup
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/views'));

// 2. Body Parser (CRITICAL for your login and registration forms!)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Session & Flash Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// 4. Attach flash messages to locals for EJS views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    next();
});

// 5. Global Variables Middleware
app.use(addLocalVariables);

// 6. Main Router
app.use('/', router);

// 7. Error Handlers
app.use((req, res) => {
    res.status(404).render('errors/404', { title: '404 - Page Not Found' });
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).render('errors/500', { title: '500 - Server Error', error });
});

// 8. Initialize Database and Start Server
const startServer = async () => {
    try {
        await testConnection();
        await setupDatabase(); // This will automatically run your seed.sql!
        
        app.listen(PORT, () => {
            console.log(`Server running on http://127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();