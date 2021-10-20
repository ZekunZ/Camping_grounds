const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    collection: "users",
  }
);
UserSchema.plugin(passportLocalMongoose); // add on to our schema the user name, password, and some methods

module.exports = mongoose.model("User", UserSchema);
