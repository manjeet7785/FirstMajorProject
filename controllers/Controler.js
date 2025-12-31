const List = require("../models/listing.js")
const flash = require("connect-flash")

module.exports.index = async (req, res) => {
  const Alllist = await List.find({});
  res.render("listings/index", { Alllist });
}

module.exports.renderNew = (req, res) => {
  res.render("listings/new")
}

module.exports.renderShow = (async (req, res) => {
  let { id } = req.params;
  const show = await List.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  }).populate("owner")
  if (!show) {
    req.flash("error", "Listing is not exit sorry")
    return res.redirect("/listings");
  }
  res.render("listings/show", { show });
})

module.exports.createRoute = async (req, res, next) => {
  try {
    // console.log("createRoute called");
    // console.log("req.file:", req.file);
    // console.log("req.body:", req.body);

    if (!req.file) {
      req.flash("error", "Please upload an image.");
      return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename

    const newList = new List(req.body.listing);
    newList.owner = req.user._id;
    newList.image = { url, filename };
    await newList.save();
    req.flash("success", "Listing created successfully.");
    res.redirect("/listings")
  } catch (error) {
    console.error("Error in createRoute:", error);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
}

module.exports.editRoute = async (req, res) => {
  let { id } = req.params;
  const listing = await List.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }
  req.flash("success", "You can now edit the listing.");
  res.render("listings/edit", { listing });
}
module.exports.UpdateRouter = async (req, res) => {
  let { id } = req.params;
  let updatedListing = req.body.listing;
  let listing = await List.findByIdAndUpdate(id, updatedListing, { new: true });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    await List.findByIdAndUpdate(id, { image: { url, filename } });
  }
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing updated successfully.");
  res.redirect(`/listings/${id}`);
}
module.exports.DeleteRouter = async (req, res) => {
  let { id } = req.params;
  let deleteList = await List.findByIdAndDelete(id)
  req.flash("success", "Listing deleted successfully.");
  if (!deleteList) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }
  res.redirect("/listings")
  // console.log(deleteList);
}