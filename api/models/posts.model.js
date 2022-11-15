const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
    content: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array,
        default: []
    }
});

PostsSchema.plugin(require('mongoose-unique-validator'));

PostsSchema.plugin(require('mongoose-error'));

module.exports = mongoose.model("Post", PostsSchema);
