import express from 'express';
import path from 'path';
import templeController from './src/controllers/templeController.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Serve static assets from the public folder
app.use(express.static('public'));

// 2. Set up EJS Templating Engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/views'));

// 3. Main Route handled via MVC Controller
app.get('/', templeController.getHome);

// 4. 404 Error Handler (MUST be the last route)
app.use((req, res) => {
    res.status(404).render('errors/404', { title: '404 - Page Not Found' });
});

// 5. 500 Error Handler
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).render('errors/500', { title: '500 - Server Error', error });
});

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});