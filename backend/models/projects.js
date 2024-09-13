const mongoose = require("mongoose");

const projectsSchema = new mongoose.Schema({
  name: {
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
  category: {
    type: String,
    required: true,
    min: 3,
    max: 40,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    default: null,
  },
  opensource: {
    type: Boolean,
    default: true,
  },
  images: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Project", projectsSchema);
