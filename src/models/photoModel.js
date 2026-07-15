import db from './database.js';

const getApprovedPhotosByTemple = async (templeId, limit = 24, offset = 0) => {
    const result = await db.query(`
        SELECT photos.photo_id AS id, photos.image_path AS file_path, photos.caption,
               COALESCE(photos.uploaded_at, photos.created_at) AS created_at,
               users.name AS contributor_name
        FROM photos
        INNER JOIN users ON users.id = photos.account_id
        WHERE photos.temple_id = $1 AND photos.status = 'approved'
        ORDER BY COALESCE(photos.uploaded_at, photos.created_at) DESC
        LIMIT $2 OFFSET $3
    `, [templeId, limit, offset]);
    return result.rows;
};

const createPhoto = async ({ templeId, userId, filePath, caption }) => {
    const result = await db.query(`
        INSERT INTO photos (temple_id, account_id, image_path, caption, status, is_approved)
        VALUES ($1, $2, $3, $4, 'pending', FALSE)
        RETURNING photo_id AS id
    `, [templeId, userId, filePath, caption || null]);
    return result.rows[0];
};

const getLatestApprovedPhotos = async (limit = 24) => {
    const result = await db.query(`
        SELECT photos.photo_id AS id, photos.image_path AS file_path, photos.caption,
               COALESCE(photos.uploaded_at, photos.created_at) AS created_at,
               temples.name AS temple_name, temples.temple_id
        FROM photos
        INNER JOIN temples ON temples.temple_id = photos.temple_id
        WHERE photos.status = 'approved'
        ORDER BY COALESCE(photos.uploaded_at, photos.created_at) DESC
        LIMIT $1
    `, [limit]);
    return result.rows;
};

const getPendingPhotos = async () => {
    const result = await db.query(`
        SELECT photos.photo_id AS id, photos.image_path AS file_path, photos.caption,
               COALESCE(photos.uploaded_at, photos.created_at) AS created_at,
               temples.name AS temple_name, users.name AS contributor_name
        FROM photos
        INNER JOIN temples ON temples.temple_id = photos.temple_id
        INNER JOIN users ON users.id = photos.account_id
        WHERE photos.status = 'pending'
        ORDER BY COALESCE(photos.uploaded_at, photos.created_at) ASC
    `);
    return result.rows;
};

const moderatePhoto = async (id, status) => {
    const result = await db.query(
        `UPDATE photos
         SET status = $1, is_approved = ($1 = 'approved'), moderated_at = CURRENT_TIMESTAMP
         WHERE photo_id = $2 AND status = 'pending'`,
        [status, id]
    );
    return result.rowCount > 0;
};

export { getApprovedPhotosByTemple, createPhoto, getLatestApprovedPhotos, getPendingPhotos, moderatePhoto };
