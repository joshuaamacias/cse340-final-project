import templeModel from '../models/templeModel.js';

const templeController = {};

templeController.getHome = async (req, res, next) => {
    try {
        const templesData = await templeModel.getAllTemples();
        
        const formattedNews = templesData.map(temple => {
            let snippetMessage = `Status: ${temple.status} | Location: ${temple.location}`;
            
            if (temple.closure_reason) {
                snippetMessage += ` (${temple.closure_reason})`;
            }
            
            return {
                title: temple.name,
                date: temple.status.toUpperCase(),
                snippet: snippetMessage
            };
        });

        res.render('home', { 
            title: 'LDS Temple News', 
            news: formattedNews 
        });
    } catch (error) {
        next(error);
    }
};

export default templeController;