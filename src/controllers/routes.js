import { Router } from 'express';

// 1. Import Temple Controllers
import templeController from './templeController.js'; 

// 2. Import Auth & Form Controllers
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin, requireRole } from '../middleware/auth.js';
import {
    handlePhotoUpload,
    submitPhoto,
    showLatestPhotos,
    showModerationQueue,
    processModeration
} from './photoController.js';

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
router.get('/photos', showLatestPhotos);

// --- AUTH & FORMS ROUTES ---
router.use('/login', loginRoutes);
router.use('/register', registrationRoutes);
router.use('/contact', contactRoutes);

router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);
router.post('/temples/:id/photos', requireLogin, handlePhotoUpload, submitPhoto);
router.get('/admin/photos', requireRole('admin'), showModerationQueue);
router.post('/admin/photos/:id', requireRole('admin'), processModeration);
// Add this alongside your other directory/home GET routes
router.get('/temples/:id', templeController.showTempleDetail);

// ... your existing routes ...

// ==========================================
// LIBRARY STATIC ROUTES
// ==========================================
router.get('/library/quotes', (req, res) => {
    res.render('library/quotes', { title: 'Inspired Temple Quotes' });
});

router.get('/library/facts', (req, res) => {
    res.render('library/facts', { title: 'Interesting Temple Facts' });
});

router.get('/library/designs', (req, res) => {
    res.render('library/designs', { title: 'Temple Architectural Designs' });
});

router.get('/library/proposed', (req, res) => {
    res.render('library/proposed', { title: 'Proposed Temples Matrix' });
});

export default router;
