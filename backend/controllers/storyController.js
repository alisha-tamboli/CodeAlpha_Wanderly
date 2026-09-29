const Story = require("../models/Story");
const cloudinary = require("../config/cloudinary");

const createStory = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Please select an image"
            });
        }

        const result = await new Promise((resolve, reject) => {

            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "wanderly/stories"
                    },
                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }

                    }
                )
                .end(req.file.buffer);
        });

        const story = await Story.create({
            user: req.userId,
            image: result.secure_url
        });

        res.status(201).json({
            message: "Story added successfully ✈️",
            story
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const getStories = async (req, res) => {
    try {

        const stories = await Story.find()
            .populate(
                "user",
                "name username profileImage"
            )
            .sort({ createdAt: -1 });

        res.json({
            stories
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createStory,
    getStories
};