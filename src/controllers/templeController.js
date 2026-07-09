import templeModel from '../models/templeModel.js';

const templeController = {};

// Helper function to format data and generate open-source Wikimedia image links
const formatTempleData = (templesData) => {
    return templesData.map(temple => {
        let snippetMessage = `Status: ${temple.status} | Location: ${temple.location}`;
        
        if (temple.closure_reason) {
            snippetMessage += ` (${temple.closure_reason})`;
        }

        // Standardizing the string explicitly for open public media files
        // Example: Converts "Salt Lake Temple" into "Salt_Lake_Temple"
        const wikiName = temple.name
            .replace(/[\(\),]/g, '') 
            .trim()
            .replace(/\s+/g, '_'); 

        // Publicly accessible asset path pattern
        const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${wikiName}.jpg`;
        
        return {
            id: temple.temple_id,
            title: temple.name,
            rawStatus: temple.status,
            date: temple.status.toUpperCase(),
            snippet: snippetMessage,
            image: imageUrl 
        };
    });
};

// 1. Home Page Controller (Shows only 3 temples)
templeController.getHome = async (req, res, next) => {
    try {
        const templesData = await templeModel.getHomeTemples();
        const formattedNews = formatTempleData(templesData);

        res.render('home', { 
            title: 'LDS Temple News - Home', 
            news: formattedNews 
        });
    } catch (error) {
        next(error);
    }
};

// 2. Directory Page Controller (Shows all temples)
templeController.getDirectory = async (req, res, next) => {
    try {
        const templesData = await templeModel.getAllTemples();
        const formattedNews = formatTempleData(templesData);

        res.render('directory', { 
            title: 'Global Temple Directory', 
            news: formattedNews 
        });
    } catch (error) {
        next(error);
    }
};

// 3. Single Temple Detail Controller
templeController.showTempleDetail = async (req, res, next) => {
    const templeId = req.params.id;
    
    try {
        const temple = await templeModel.getTempleById(templeId);
        
        if (!temple) {
            return res.status(404).render('errors/404', { title: 'Not Found' });
        }
        
        // Mirroring identical image logic for individual items
        const wikiName = temple.name
            .replace(/[\(\),]/g, '')
            .trim()
            .replace(/\s+/g, '_');
            
        const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${wikiName}.jpg`;
        
        res.render('detail', { 
            title: temple.name, 
            item: {
                title: temple.name,
                rawStatus: temple.status,
                date: temple.status.toUpperCase(),
                snippet: `Status: ${temple.status} | Location: ${temple.location}${temple.closure_reason ? ` (${temple.closure_reason})` : ''}`,
                image: imageUrl
            }
        });
    } catch (error) {
        console.error('Error fetching temple detail:', error);
        next(error); 
    }
};

export default templeController;