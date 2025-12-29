const mongooes = require("mongoose");
const reviews = require("./reviews");
const Schema = mongooes.Schema;

const listeningSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String
  },
  // image: {

  //   type: {
  //     url: String,
  //     filename: String,
  //   },
  //   default: {
  //     url: "https://images.unsplash.com/photo-1761165308046-174a56e73525?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
  //     filename: "listing_placeholder" // या कोई भी डिफ़ॉल्ट filename
  //   },
  //   Set: (v) => v === " " ? "https://images.unsplash.com/photo-1761165308046-174a56e73525?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170" : v,
  // },
  price: Number,
  location: String,
  country: String,
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
// db.users.dropIndex('username_1')
const List = mongooes.model("List", listeningSchema)
module.exports = List;

