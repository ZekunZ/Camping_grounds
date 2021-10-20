const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const userRoutes = require("./routes/users");

const mongoose = require("mongoose");
const { urlencoded } = require("express");
mongoose.connect(
  "mongodb+srv://zekunzhang:Qa7kXz0XPZgsQvr9@mongodb-server-portfoli.k0h0q.mongodb.net/yelp-camp?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: "thisshouldbeabetterseret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use LocalStrategy, using authenticate in the User. Generate a function that is used in Passport LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to use flash  all templates have access to this
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// app.get('/makecampground', async (req,res) => {
//     const camp = new Campgorund({title: 'My Backyard', description:'Cheap camping'});
//     await camp.save();
//     res.send(camp);
// })

// for everysingle request
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; // deconstruct error
  if (!err.message) err.message = "Oh! Something went wrong!";
  res.status(statusCode).render("error", { err });
}); // catch error and do next accordingly

var port = process.env.PORT || "3000";
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
