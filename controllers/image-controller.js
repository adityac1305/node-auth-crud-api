const Image = require('../models/Image');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');


const uploadImageController = async (req, res) => {
    try {

        // check if file is missing in request
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: 'File is missing in request'
            });
        }

        // upload file to cloudinary
        const {url, public_Id} = await uploadToCloudinary(req.file.path);


        // Create a new image document with the image url and public id 
        const newlyUploadedImage = await Image.create({
            url,
            publicId: public_Id,
            uploadedBy: req.userInfo.userId
        });

        // Save the image in MongoDB
        await newlyUploadedImage.save();


        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newlyUploadedImage
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// fetch all images
const fetchImageController = async (req, res) => {
    try{

        // fetch all images with pagination and sorting

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const totalImages = await Image.countDocuments({});
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;


        // sort by multiple fields and different order

        /*
        const sortBy = req.query.sortBy || 'createdAt:desc';
        const sortObj = {};

        sortBy.split(':').forEach(pair => {
            const [field, order] = pair.split(':');
            sortObj[field] = order === 'asc' ? 1 : -1;
        });

        */


        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);


        // fetch all images
        // const images = await Image.find({});
        
        // send response
        if(images){
            res.status(200).json({
                success: true,
                message: 'Images fetched successfully',
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images
            });
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred while fetching image', error
        });
    }
}









// delete image from cloudinary controller
const deleteImageController = async (req, res) => {
    try{
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);
        if(!image){
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }


        // Check if image uploaded by current user who is trying to delete the image
        if(image.uploadedBy.toString() !== req.userInfo.userId){
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this image'
            });
        }

        // delete image from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // delete image from MongoDB
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);


        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred while deleting image', error
        });
    }
}





module.exports = {
    uploadImageController,
    fetchImageController,
    deleteImageController
};