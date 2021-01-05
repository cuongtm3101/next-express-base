const mongoose = require("mongoose");
const slugify = require('slugify');

const courseSchema = mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category"
  },
  trainerName: {
    type: String,
    required: [true, "need a trainer name"]
  },
  courseName: {
    type: String,
    required: [true, "Course have an Course"],
    unique: true,
    trim: true,
    maxlength: [100, "Course name need require less more than 10 characters"],
    minlength: [3, "Course name need require more than 3 characters"]
  },
  slug: String,
  demoVideoId: {
    type: String,
    required: [true, "A Course need require a video demo"],
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
    required: [true, "A Course need require a short description"],
    maxlength: [100, "Course name need require less more than 10 characters"],
    minlength: [20, "Course name need require more than 3 characters"]
  },
  detailDescription: [
    {
      title: String,
      content: String,
      imgURL: String,
      type: {
        type: {
          type: String
        }
      }
    }
  ],
  price: {
    type: Number,
    required: [true, 'A Course must have a price']
  },
  discount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: `Discount Price ({VALUE}) should be below regular price`
    }
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


courseSchema.index({ slug: 1 });
courseSchema.pre("save", function (next) {
  this.slug = slugify(this.courseName, { lower: true });
  next();
});

courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "categoryId",
    select: '-__v '
  });
  next();
})

courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sectionId",
    select: '-__v'
  });
  next();
})

courseSchema.virtual("sectionId", {
  ref: "Section",
  foreignField: "courseId",
  localField: "_id"
});
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;