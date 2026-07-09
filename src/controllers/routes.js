import { Router } from 'express';

// 1. Import Temple Controllers
import templeController from './templeController.js'; 

// 2. Import Auth & Form Controllers
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

// --- STYLING MIDDLEWARE ---
// Assuming your global.js middleware provides res.addStyle()
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});

// --- MAIN TEMPLE ROUTES ---
router.get('/', templeController.getHome);
router.get('/directory', templeController.getDirectory);

// --- AUTH & FORMS ROUTES ---
router.use('/login', loginRoutes);
router.use('/register', registrationRoutes);
router.use('/contact', contactRoutes);

router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);
// Add this alongside your other directory/home GET routes
router.get('/temples/:id', templeController.showTempleDetail);

export default router;