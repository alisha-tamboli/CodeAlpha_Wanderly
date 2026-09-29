const express = require("express");

const router = express.Router();

const {
    createStory,
    getStories
} = require("../controllers/storyController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


// Get all stories
router.get("/", getStories);


// Create story
router.post(
    "/",
    protect,
    upload.single("image"),
    createStory
);


module.exports = router;