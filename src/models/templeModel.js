import { query } from './database.js';

const templeModel = {};

// Fetch all temples ordered by their historical insertion timeline
templeModel.getAllTemples = async () => {
    const sql = `SELECT temple_id, name, location, status, closure_reason 
                 FROM public.temples 
                 ORDER BY temple_id ASC`;
    const result = await query(sql);
    return result.rows;
};

export default templeModel;