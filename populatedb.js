#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Category = require("./models/category");
  const Item = require("./models/item");
  
  const items = [];
  const categories = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, name) {
    const category = new Category({ name: name});
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }
  
  async function itemCreate(index, name, description, category, price, numInStock) {
    const itemDetail = {
      name: name,
      description: description,
      price: price,
      numInStock: numInStock,
    };
    if (category != false) itemDetail.category = category;
  
    const item = new Item(itemDetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
  }
  
  
  async function createCategories() {
    console.log("Adding catecories");
    await Promise.all([
      categoryCreate(0, "Fridge"),
      categoryCreate(1, "Pantry"),
      categoryCreate(2, "Spices"),
      categoryCreate(3, "Freezer"),
    ]);
  }
  
  async function createItems() {
    console.log("Adding Items");
    await Promise.all([
      itemCreate(0,
        "Mortans Iodized Salt",
        "10oz. Iodized to ensure healthy iodine levels",
        categories[2],
        3.00,
        1
      ),
      itemCreate(1,
        "Basmati Rice",
        "10lbs. Super premium imported basmati rice.",
        categories[1],
        10.00,
        1
      ),
      itemCreate(2,
        "Butter",
        "1 stick unsalted butter.",
        categories[0],
        1.50,
        6
      ),
      itemCreate(3,
        "Banquet Turkey Pot Pie",
        "Microwavable meal. Simple, fast, tasty.",
        categories[3],
        1.00,
        4
      ),
      itemCreate(4,
        "Chicken Breast",
        "1 fresh chicken breast",
        categories[3],
        2.99,
        6
      ),
      itemCreate(5,
        "Ketchup",
        "16oz bottle of hienz ketchup",
        categories[0],
        4.99,
        1
      ),
    ]);
  }