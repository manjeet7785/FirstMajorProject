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
  }).populate("owner")   //List ko pass kiya hun  models ke listings se // populate me review ke liye use kiya
  if (!show) {
    req.flash("error", "Listing is not exit sorry") //agar listing me product na ho to
    return res.redirect("/listings");
  }
  res.render("listings/show", { show });
})

module.exports.createRoute = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename
  console.log("This is", url, ".....", filename);

  if (!req.body.listing) {
    throw new ExpressError(400, "Send Valid data for listing")
  }
  let create = req.body.listing;
  const imageUrl = create.image;
  create.image = {
    url: imageUrl,
    filename: 'placeholder-filename'
  };
  // const newList = new List(req.body.listing);
  const newList = new List(create);
  // console.log(req.user);
  newList.owner = req.user._id;  //print krne ke liye user ka name 
  await newList.save();
  req.flash("success", "Listing created successfully.");
  res.redirect("/listings")
}

module.exports.editRoute = async (req, res) => {
  let { id } = req.params;
  const listing = await List.findById(id);


  if (!listing) {
    req.flash("error", "Listing not found."); //agar listing me product na ho to
    return res.redirect("/listings");
  }
  req.flash("success", "You can now edit the listing.");
  res.render("listings/edit", { listing });
}

module.exports.UpdateRouter = async (req, res) => {
  let { id } = req.params;
  // 1. Get the data from the form
  let updatedListing = req.body.listing;

  // 2. Re-structure the image field to match the Schema (object with url and filename)
  // The form only sends the URL string, so we need to convert it.
  if (updatedListing.image) {
    updatedListing.image = {
      url: updatedListing.image,
      filename: 'placeholder-filename' // Use a temporary/placeholder filename
    };
  }

  // 3. Perform the update
  await List.findByIdAndUpdate(id, updatedListing);
  req.flash("success", "Listing updated successfully.");
  if (!updatedListing) {
    req.flash("error", "Listing not found.");//agar listing me product na ho to
    return res.redirect("/listings");
  }


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