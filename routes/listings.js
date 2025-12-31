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


router.get("/", wrapAsync(ListingController.index));
router.get("/new", isLoggedIn, ListingController.renderNew);
router.get("/:id", wrapAsync(ListingController.renderShow));
router.post("/", isLoggedIn, upload.array('listing[images]', 20), wrapAsync(ListingController.createRoute))

router.get("/:id/upload-images", isLoggedIn, isOwner, wrapAsync(ListingController.uploadImagesForm))
router.post("/:id/upload-images", isLoggedIn, isOwner, upload.array('images', 10), wrapAsync(ListingController.uploadImages))
router.get("/:id/edit", isLoggedIn, wrapAsync(ListingController.editRoute)
)
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(ListingController.UpdateRouter))

router.delete("/:id", isLoggedIn, wrapAsync(ListingController.DeleteRouter))

module.exports = router;