import templeModel from '../models/templeModel.js';
import { getApprovedPhotosByTemple } from '../models/photoModel.js';

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
        const news = [
            {
                title: 'San Diego California Temple Opens for Public Tours',
                date: 'June 15, 2026',
                summary: 'The renovated San Diego California Temple is open to the public for tours through July 11, with dedication scheduled for August 23.',
                url: 'https://newsroom.churchofjesuschrist.org/article/open-house-begins-for-the-san-diego-temple'
            },
            {
                title: 'Belo Horizonte Brazil Temple Open House',
                date: 'June 10, 2026',
                summary: 'The public open house ran June 13–27 ahead of the Belo Horizonte Brazil Temple dedication on August 16.',
                url: 'https://newsroom.churchofjesuschrist.org/article/open-house-begins-for-the-belo-horizonte-brazil-temple'
            },
            {
                title: 'Montpelier Idaho Temple Milestones Announced',
                date: 'May 4, 2026',
                summary: 'Open-house and dedication dates have been announced for the Montpelier Idaho Temple, with dedication set for October 18.',
                url: 'https://newsroom.churchofjesuschrist.org/article/milestones-announced-for-the-montpelier-idaho-temple'
            },
            {
                title: 'Salt Lake Temple Renovation Update',
                date: 'Updated July 6, 2026',
                summary: 'The Salt Lake Temple renovation is projected to finish in late 2026, with a public open house planned for 2027.',
                url: 'https://newsroom.churchofjesuschrist.org/event/temple-open-house-and-dedications'
            }
        ];
        res.addStyle('<link rel="stylesheet" href="/css/home.css">');
        res.render('home', { 
            title: 'LDS Temple News - Home', 
            news
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
        const photos = await getApprovedPhotosByTemple(templeId, 12);
        res.addStyle('<link rel="stylesheet" href="/css/gallery.css">');
        
        res.render('detail', { 
            title: temple.name, 
            item: {
                id: temple.temple_id,
                title: temple.name,
                rawStatus: temple.status,
                date: temple.status.toUpperCase(),
                snippet: `Status: ${temple.status} | Location: ${temple.location}${temple.closure_reason ? ` (${temple.closure_reason})` : ''}`,
                image: imageUrl
            },
            photos
        });
    } catch (error) {
        console.error('Error fetching temple detail:', error);
        next(error); 
    }
};

export default templeController;
