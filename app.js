require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const List = require("./models/listing.js")
const Review = require("./models/reviews.js")
const path = require("path")
const methodOver = require("method-override")
const ejsmate = require("ejs-mate")
const wrapAsync = require("./utilies/wrapAsync.js")
const ExpressError = require("./utilies/ExpressError.js")
const listingRouter = require("./routes/listings.js")
const reviewsRoute = require("./routes/router.js")
const userRouter = require("./routes/user.js");
const session = require("express-session")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")



const url = process.env.DB_URL;


app.get("/", (req, res) => {
  res.send("hello")
})

async function main() {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connection successful!");

    app.listen(8080, () => {
      console.log("Server is listening to port 8080");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOver("_method"));
app.engine("ejs", ejsmate)
app.use(express.static(path.join(__dirname, "/public")))


const sessionOptions = {
  secret: "mysecret ye kuch bhi likh skhte",
  resave: false,
  saveUninitialized: true,
  Cookie: {
    // expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}

app.use(session(sessionOptions))  // now we check the session is working or not so simply go with application and cookies
app.use(flash()) // routes se phle flash ko use krna hai kyu route pya hi kamm krna hai

// jo bhi releted to password hai usko yeha likhe

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
// passport.use(new LocalStrategy(User.authenticate()));
// passport ke under jitne bhi user aaye vo localStrategy ke throug passport.authenticate hoke aaye or un user ko passport.authenticate ke liye passport.authenticate method ka use krte hai 

// isko likhna pdega serial me me rkhna or jb user session khtam kr diya to usko deserialize hota hai
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


app.use("/", userRouter)
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRoute);




// This middleware catches any request that hasn't been handled by routes above it.
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
// custom error handle isko create ki help se kr rhe hai 



app.use((err, req, res, next) => {
  // Provide default values for safety
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.render("error.ejs", { err })
})

main();
// app.get("/listening", async (req, res) => {
//   let sample = new List({
//     title: "My New Home",
//     description: "My the nae",
//     price: 12000,
//     location: "Lucknow",
//     country: "India"
//   })
//   await sample.save();
//   console.log("Saple wala ");
//   res.send("Successfully")

// })

