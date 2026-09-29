const express = require("express");
const router = express.Router();

const { createPost, getAllPosts, likePost, addComment, getComments, deletePost } = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, upload.single("image"), createPost);
router.get("/", getAllPosts);
router.put("/:id/like", protect, likePost);
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", getComments);
router.delete("/:id", protect, deletePost);

module.exports = router;