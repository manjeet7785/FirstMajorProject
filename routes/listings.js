const express = require("express")
const router = express.Router();
const wrapAsync = require("../utilies/wrapAsync.js")
const ExpressError = require("../utilies/ExpressError.js")
const List = require("../models/listing.js")
const flash = require("connect-flash")
const { isLoggedIn, isOwner } = require("../middl.js")

const ListingController = require("../controllers/Controler.js")

const multer = require('multer')
const { storage } = require("../Cloud.js")
const upload = multer({ storage })


// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// }

// router.get("/", (req, res) => {
//   res.send("Hii I am")
// });




//index Route
router.get("/", wrapAsync(ListingController.index))

//New Route
router.get("/new", isLoggedIn, ListingController.renderNew)

//show Route
router.get("/:id", wrapAsync(ListingController.renderShow));



// //Create Route
// router.post("/listings", (req, res) => {
//   let create = req.body.listing;
//   // console.log(create);

//   // ab window me add krne ke liye list 
//   const imageUrl = create.image;
//   create.image = {
//     url: imageUrl,
//     filename: 'placeholder-filename' // Provide a temporary filename
//   };
//   const newList = new List(req.body.listing);
//   newList.save();
//   res.redirect("/listing")  //isse list ko add kiya hun list me 
//   // console.log();
// })


//error handling ke liye 
//Create Route

router.post("/", isLoggedIn, upload.array('listing[images]', 20), wrapAsync(ListingController.createRoute))

// Upload Images Form
router.get("/:id/upload-images", isLoggedIn, isOwner, wrapAsync(ListingController.uploadImagesForm))

// Upload Images Post
router.post("/:id/upload-images", isLoggedIn, isOwner, upload.array('images', 10), wrapAsync(ListingController.uploadImages))

// router.post("/", upload.single('listing[image]'), (req, res) => {
//   res.send(req.file)
//   // console.log(req.file);

// })


//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(ListingController.editRoute)
)


//Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(ListingController.UpdateRouter))

//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(ListingController.DeleteRouter))

module.exports = router;