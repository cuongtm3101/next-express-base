const mongoose = require("mongoose");
const slugify = require('slugify');

const sectionSchema = mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.ObjectId,
    ref: "lesson"
  },
  sectionTitle: {
    type: String,
    required: [true, "section need a required !!!"],
    maxlength: [50, "Course name need require less more than 50 characters"],
    minlength: [3, "Course name need require more than 3 characters"],
    sectionDescription: String,
    sectionTotalName: String
  },
  slug: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

sectionSchema.pre("save", function (next) {
  this.slug = slugify(this.sectionTitle, { lower: true });
  next();
});

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;