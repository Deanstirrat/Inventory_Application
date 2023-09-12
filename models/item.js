const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true},
  description: { type: String },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  price: { type: Number },
  numInStock: { type: Number },
});

// Virtual for author's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/item/${this._id}`;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);
