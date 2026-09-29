const express = require("express");
const router = express.Router();

const { followUser, getUserProfile, getUserPosts} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.put("/:id/follow", protect, followUser);
router.get("/:id", getUserProfile);
router.get("/:id/posts", getUserPosts);


module.exports = router;