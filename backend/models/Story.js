const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        image: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Automatically delete stories after 24 hours
storySchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 86400 }
);

const Story = mongoose.model("Story", storySchema);

module.exports = Story;