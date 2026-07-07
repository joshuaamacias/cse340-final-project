import templeModel from '../models/templeModel.js';

const templeController = {};

// Helper function so we don't repeat the formatting code twice
const formatTempleData = (templesData) => {
    return templesData.map(temple => {
        let snippetMessage = `Status: ${temple.status} | Location: ${temple.location}`;
        
        if (temple.closure_reason) {
            snippetMessage += ` (${temple.closure_reason})`;
        }
        
        return {
            id: temple.temple_id,          // Needed for sorting by age
            title: temple.name,
            rawStatus: temple.status,      // Needed for the status dropdown
            date: temple.status.toUpperCase(),
            snippet: snippetMessage
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

// 2. Directory Page Controller (Shows all 385 temples)
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

export default templeController;