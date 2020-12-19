const mongoose = require("mongoose");
const slugify = require("slugify");

const lessonSchema = mongoose.Schema({
  lessonTitle: {
    type: String,
    required: true,
    maxlength: [100, "lesson name need require less more than 100 characters"],
    minlength: [10, "lesson name need require more than 10 characters"]
  },
  lessonDescription: String,
  lessionNote: String,
  videoId: {
    type: mongoose.Schema.ObjectId,
    ref: "Video"
  },
  slug: String
});

lessonSchema.pre("save", function (next) {
  this.slug = slugify(this.lessonTitle, { lower: true });
  next();
})

module.exports = lessonSchema;