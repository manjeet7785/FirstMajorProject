const List = require("./models/listing")
module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req); //all data here
  // console.log(req.path, "..", req.originalUrl); // ye vahi url hai jaa mujhe redirect krna hai 
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing")
    return res.redirect("/login")
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    req.flash("error", "Invalid request.");
    return res.redirect("/listings");
  }
  next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewId } = req.params;
  let listing = new List.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of the comment")
    return res.redirect(`/listings/${id}`);
  }
}