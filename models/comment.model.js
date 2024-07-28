const mongoose = require("mongoose");
const generate= require("../helper/generate");

const commentSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    description: String,
    "deleted": {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
const Comment = mongoose.model('Comment', commentSchema, "comments");

module.exports = Comment;