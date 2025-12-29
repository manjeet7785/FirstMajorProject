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
  try {
    // console.log("createRoute called");
    // console.log("req.files:", req.files);
    // console.log("req.body:", req.body);

    if (!req.files || req.files.length === 0) {
      req.flash("error", "Please upload at least one image.");
      return res.redirect("/listings/new");
    }

    // Set first image as main image for backward compatibility
    let url = req.files[0].path;
    let filename = req.files[0].filename;

    // Store all images in the images array
    const images = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));

    const newList = new List(req.body.listing);
    newList.owner = req.user._id;
    newList.image = { url, filename };
    newList.images = images;
    await newList.save();
    req.flash("success", "Listing created successfully with " + images.length + " images.");
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
    req.flash("error", "Listing not found."); //agar listing me product na ho to
    return res.redirect("/listings");
  }
  req.flash("success", "You can now edit the listing.");
  res.render("listings/edit", { listing });
}

// module.exports.UpdateRouter = async (req, res) => {
//   let { id } = req.params;
//   // 1. Get the data from the form
//   let updatedListing = req.body.listing;


//   // The form only sends the URL string, so we need to convert it.
//   // if (updatedListing.image) {
//   //   updatedListing.image = {
//   //     url: updatedListing.image,
//   //     filename: 'placeholder-filename' // Use a temporary/placeholder filename
//   //   };
//   // }

//   // 3. Perform the update
//   await List.findByIdAndUpdate(id, updatedListing);
//   //ye se upadte kamm kr rha hai image ka 
//   let url = req.file.path;
//   let filename = req.file.filename
//   updatedListing.image = { url, filename }
//   req.flash("success", "Listing updated successfully.");
//   if (!updatedListing) {
//     req.flash("error", "Listing not found.");//agar listing me product na ho to
//     return res.redirect("/listings");
//   }


//   res.redirect(`/listings/${id}`);
// }

module.exports.UpdateRouter = async (req, res) => {
  let { id } = req.params;

  // 1. Get the data from the form (title, description, price, etc.)
  let updatedListing = req.body.listing;

  // 2. Perform the initial update of non-image fields.
  // We use {new: true} to get the updated document (optional but good practice).
  let listing = await List.findByIdAndUpdate(id, updatedListing, { new: true });

  // 3. ✅ FIX: Check if a new file was uploaded via the form
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;

    // 4. Update the image object only if a new file exists.
    // We use $set to specifically update the image field in the database.
    await List.findByIdAndUpdate(id, { image: { url, filename } });
    // The image object is now correctly updated in the database.
  }

  // 5. Error check (Check if the listing was found/updated)
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  // 6. Flash message and redirect
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