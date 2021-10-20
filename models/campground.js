const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema(
  {
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId, // connect campground model with review model
        ref: "Review",
      },
    ],
  },
  {
    collection: "campgrounds",
  }
);

// middleware to delete associated reivews with campground when deleting campground
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // if doc is not empty
    await Review.deleteMany({
      _id: {
        //remove the reviews in the doc with the id (the camp we wanna delete)
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
