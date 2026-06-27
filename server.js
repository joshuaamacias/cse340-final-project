import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Serve static assets from the public folder
app.use(express.static('public'));

// 2. Set up EJS Templating Engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/views'));

// 3. Routes (We will move this to a controller later, but let's test here)
app.get('/', (req, res) => {
    const sampleNews = [
        { title: "Salt Lake Temple Renovation Update", date: "June 2026", snippet: "New structural columns have been successfully placed." },
        { title: "New Temple Announced", date: "May 2026", snippet: "A new temple site has been selected for the area." }
    ];
    
    // Renders src/views/home.ejs and passes data to it
    res.render('home', { title: 'LDS Temple News', news: sampleNews });
});

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