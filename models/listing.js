const mongooes = require("mongoose");
const reviews = require("./reviews");
const { required } = require("joi");
const Schema = mongooes.Schema;

const listeningSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  images: [
    {
      url: String,
      filename: String,
    }
  ],
  price: Number,
  location: String,
  country: String,
  sqFeet: Number,
  propertyType: {
    type: String,
    enum: [
      "Flat",
      "Zameen",
      "Room",
      "1BHK",
      "2BHK",
      "Home",
      "Shop",
    ]
  },
  totalFloors: String,
  facing: String,
  overlooking: String,
  keyHighlights: [String],
  furnishing: {
    type: String,
    enum: ["Furnished", "Semi-Furnished", "Unfurnished"]
  },
  flooring: String,
  propertyOwnership: {
    type: String,
    enum: ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"]
  },
  widthOfFacingRoad: String,
  gatedCommunity: {
    type: Boolean,
    default: false
  },
  cornerProperty: {
    type: Boolean,
    default: false
  },
  parking: String,
  park: {
    type: Boolean,
    default: false
  },
  swimming: {
    type: Boolean,
    default: false
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
});
listeningSchema.post("findOneAndDelete", async (show) => {
  if (show) {
    await reviews.deleteMany({ _id: { $in: show.reviews } })
  }
})

const List = mongooes.model("List", listeningSchema)
module.exports = List;

