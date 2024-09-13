const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
    date: {
        type: Date,
        default: Date.now,
    },
});

const newsSchema = new mongoose.Schema({
  project_id: {
    type: String,
    required: true,
  },
  project_name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    min: 1,
    max: 100,
  },
  description: {
    type: String,
    required: true,
    min: 3,
    max: 500,
  },
  author: {
    type: String,
    required: true,
  },
  author_id: {
    type: String,
  },
  publish_date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  attachments: {
    type: Array,
    default: [],
  },
  likes: {
    type: Array,
    default: [],
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
});

module.exports = mongoose.model("News", newsSchema);
