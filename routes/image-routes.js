const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');
const {uploadImageController, fetchImageController, deleteImageController} = require('../controllers/image-controller');


const router = express.Router();



router.post('/upload', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImageController);
router.get('/get', authMiddleware, adminMiddleware, fetchImageController);
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImageController);


module.exports = router;


