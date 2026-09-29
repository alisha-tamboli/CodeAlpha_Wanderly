const User = require("../models/User");
const Post = require("../models/Post");

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.userId);

        if (!userToFollow) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (req.userId.toString() === req.params.id) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        const alreadyFollowing = currentUser.following.includes(req.params.id);

        if (alreadyFollowing) {
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== req.params.id
            );

            userToFollow.followers = userToFollow.followers.filter(
                (id) => id.toString() !== req.userId.toString()
            );

            await currentUser.save();
            await userToFollow.save();

            return res.json({
                message: "User unfollowed"
            });
        }

        currentUser.following.push(req.params.id);
        userToFollow.followers.push(req.userId);

        await currentUser.save();
        await userToFollow.save();

        res.json({
            message: "User followed"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({
            user: req.params.id
        }).sort({ createdAt: -1 });

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

module.exports = {
    getUserProfile,
    followUser,
    getUserPosts
};