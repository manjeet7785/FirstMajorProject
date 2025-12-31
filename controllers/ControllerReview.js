const User = require("../models/user");
const List = require("../models/listing.js");
const passport = require("passport");
const Review = require("../models/reviews.js")


module.exports.CreateReviews = async (req, res) => {
  // console.log(req.params.id);
  let show = await List.findById(req.params.id);
  let newReviews = new Review(req.body.review)
  newReviews.author = req.user._id;
  console.log("data", newReviews);
  show.reviews.push(newReviews);
  await newReviews.save();
  await show.save();
  req.flash("success", "Review Added successfully.");
  res.redirect(`/listings/${show._id}`);
}
module.exports.DeleteController = async (req, res) => {
  let { id, reviewId } = req.params;
  await List.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Listing Deleted successfully.");
  res.redirect(`/listings/${id}`)
}
module.exports.SignupGetController = (req, res) => {
  res.render("signup/signup");
}
module.exports.SignupPostController = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const register = await User.register(newUser, password)
    // console.log(register);
    req.login(register, function (err) {
      if (err) {
        return next();
      }
      req.flash("success", "Welcome to my website");
      res.redirect("/listings")
    })
  }
  catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup")
  }

}
module.exports.loginGetController = (req, res) => {
  res.render("signup/login");
}
module.exports.loginPostController =
  (req, res) => {
    req.flash("success", "Welcome back! You are logged in.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
  }

module.exports.logoutController = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged Out");
    res.redirect("/listings");
  });
}