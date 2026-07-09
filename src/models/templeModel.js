import { query } from './database.js';

const templeModel = {};

// Fetch ALL temples for the directory (Ordered Alphabetically)
templeModel.getAllTemples = async () => {
    const sql = `SELECT temple_id, name, location, status, closure_reason 
                 FROM public.temples 
                 ORDER BY name ASC`;
    const result = await query(sql);
    return result.rows;
};

// Fetch just 3 temples for the Home Page teaser
templeModel.getHomeTemples = async () => {
    const sql = `SELECT temple_id, name, location, status, closure_reason 
                 FROM public.temples 
                 ORDER BY temple_id ASC 
                 LIMIT 3`;
    const result = await query(sql);
    return result.rows;
};

// Fetch a single temple by its ID for the detail page
templeModel.getTempleById = async (id) => {
    // FIXED: Uses temple_id instead of id to match your table columns
    const sql = 'SELECT * FROM public.temples WHERE temple_id = $1';
    const result = await query(sql, [id]);
    return result.rows[0]; // Returns just the single record found
};

export default templeModel;