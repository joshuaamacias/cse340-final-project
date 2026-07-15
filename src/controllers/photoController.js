import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';
import templeModel from '../models/templeModel.js';
import {
    getApprovedPhotosByTemple,
    createPhoto,
    getLatestApprovedPhotos,
    getPendingPhotos,
    moderatePhoto
} from '../models/photoModel.js';

const uploadReturnPath = (req) => req.params.id ? `/temples/${req.params.id}` : '/photos/upload';

const uploadDirectory = path.join(process.cwd(), 'public', 'uploads', 'temple-photos');
fs.mkdirSync(uploadDirectory, { recursive: true });

const upload = multer({
    storage: multer.diskStorage({
        destination: uploadDirectory,
        filename: (req, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
    }),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        callback(null, allowed.includes(file.mimetype));
    }
});

const handlePhotoUpload = (req, res, next) => {
    upload.single('photo')(req, res, (error) => {
        if (error) {
            req.flash('error', error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
                ? 'Photos must be 5 MB or smaller.'
                : 'Please upload one JPEG, PNG, or WebP image.');
            return res.redirect(uploadReturnPath(req));
        }
        if (!req.file) {
            req.flash('error', 'Please choose a JPEG, PNG, or WebP image to upload.');
            return res.redirect(uploadReturnPath(req));
        }
        return next();
    });
};

const removeUploadedFile = (file) => {
    if (file) fs.unlink(file.path, () => {});
};

const submitPhoto = async (req, res, next) => {
    const templeId = Number.parseInt(req.body.templeId || req.params.id, 10);
    const caption = (req.body.caption || '').trim().slice(0, 280);
    if (!Number.isInteger(templeId) || caption.length < 4 || req.body.release !== 'accepted') {
        removeUploadedFile(req.file);
        req.flash('error', 'Choose a temple, write a short description, and accept the photo release.');
        return res.redirect(uploadReturnPath(req));
    }
    try {
        const temple = await templeModel.getTempleById(templeId);
        if (!temple) {
            removeUploadedFile(req.file);
            req.flash('error', 'Temple not found.');
            return res.redirect('/directory');
        }
        await createPhoto({
            templeId,
            userId: req.session.user.id,
            filePath: `/uploads/temple-photos/${req.file.filename}`,
            caption
        });
        req.flash('success', 'Thank you! Your photo has been submitted for review.');
        return res.redirect('/photos/upload');
    } catch (error) {
        removeUploadedFile(req.file);
        console.error('Photo submission error:', error);
        req.flash('error', 'We could not submit that photo. Please try again.');
        return res.redirect(uploadReturnPath(req));
    }
};

const showUploadForm = async (req, res, next) => {
    try {
        const temples = await templeModel.getAllTemples();
        res.addStyle('<link rel="stylesheet" href="/css/gallery.css">');
        res.render('photos/upload', { title: 'Share a Temple Photo', temples });
    } catch (error) {
        next(error);
    }
};

const showLatestPhotos = async (req, res, next) => {
    try {
        const photos = await getLatestApprovedPhotos();
        res.addStyle('<link rel="stylesheet" href="/css/gallery.css">');
        res.render('photos/latest', { title: 'New Temple Photos', photos });
    } catch (error) {
        next(error);
    }
};

const showModerationQueue = async (req, res, next) => {
    try {
        const photos = await getPendingPhotos();
        res.addStyle('<link rel="stylesheet" href="/css/gallery.css">');
        res.render('photos/moderation', { title: 'Review Photo Submissions', photos });
    } catch (error) {
        next(error);
    }
};

const processModeration = async (req, res, next) => {
    const photoId = Number.parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!Number.isInteger(photoId) || !['approved', 'rejected'].includes(status)) {
        req.flash('error', 'Invalid photo review request.');
        return res.redirect('/admin/photos');
    }
    try {
        const updated = await moderatePhoto(photoId, status);
        req.flash(updated ? 'success' : 'error', updated ? `Photo ${status}.` : 'Photo was already reviewed or not found.');
        return res.redirect('/admin/photos');
    } catch (error) {
        next(error);
    }
};

export { getApprovedPhotosByTemple, handlePhotoUpload, submitPhoto, showUploadForm, showLatestPhotos, showModerationQueue, processModeration };
