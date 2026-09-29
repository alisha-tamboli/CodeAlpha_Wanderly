const Post = require("../models/Post");
const Comment = require("../models/Comment");
const cloudinary = require("../config/cloudinary");

const createPost = async (req, res) => {
    try {
        const { location, content } = req.body || {};

        if (!location || !content) {
            return res.status(400).json({
                message: "Location and content are required"
            });
        }

        let imageUrl = "";

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            folder: "wanderly"
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

            imageUrl = result.secure_url;
        }

        const post = await Post.create({
            user: req.userId,
            location,
            content,
            image: imageUrl
        });

        res.status(201).json({
            message: "Post created successfully ✈️",
            post
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name username profileImage")
            .sort({ createdAt: -1 });

        res.json({
            posts
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.includes(req.userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (userId) => userId.toString() !== req.userId.toString()
            );

            await post.save();

            return res.json({
                message: "Post unliked",
                likes: post.likes.length
            });
        }

        post.likes.push(req.userId);
        await post.save();

        res.json({
            message: "Post liked ❤️",
            likes: post.likes.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = await Comment.create({
            post: req.params.id,
            user: req.userId,
            text
        });

        res.status(201).json({
            message: "Comment added 💬",
            comment
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({
            post: req.params.id
        })
            .populate("user", "name username profileImage")
            .sort({ createdAt: 1 });

        res.json({
            comments
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const deletePost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Only post owner can delete
        if (post.user.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only delete your own post"
            });
        }

        // Delete post comments also
        await Comment.deleteMany({
            post: req.params.id
        });

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            message: "Post deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

module.exports = {
    createPost,
    getAllPosts,
    likePost,
    addComment,
    getComments,
    deletePost
};