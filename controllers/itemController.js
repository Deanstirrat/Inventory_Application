const asyncHandler = require("express-async-handler");
const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require('express-validator');

exports.index = (req, res, next) => {
  res.render("index", {
    title: "Inventory Home",
  });
};

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  const categories = await Category.findById(item.category[0]).exec();
  res.render("item_detail", {
    title: "Item details",
    item: item,
  });
});

exports.item_list = asyncHandler(async (req, res, next) => {
  const itemList = await Item.find().exec();

  res.render("itemList", {
    title: "All items",
    itemList: itemList,
  });
});

exports.item_update_get = asyncHandler(async(req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find().exec()
  ]);

  res.render("item_form", {title: "Update item", item: item, categories: categories })
})

exports.item_update_post = [
  //validate fields
  body("name", "Name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must contain at least 5 characters long")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("price", "Price must be more then 0")
    .trim()
    .isNumeric()
    .isFloat({ min: 0.01 })
    .escape(),
  body("numInStock", "Quantity must be a posititve whole number")
    .trim()
    .isNumeric()
    .isInt({ min: 0 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a item object with escaped and trimmed data.
    const item = new Item({ 
      name: req.body.name, 
      description: req.body.description, 
      price: req.body.price,
      numInStock: req.body.numInStock,
      category: typeof req.body.category === "undefined" ? [] : req.body.category,
      _id: req.params.id,
     });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const categories = await Category.find().exec();
      res.render("item_form", {
        title: "Update item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      const updatedItem = await Item.findByIdAndUpdate(item.id, item, {});
      // New item saved. Redirect to genre detail page.
      res.redirect(updatedItem.url);
    }
  }),
];

exports.item_create_get = asyncHandler(async(req, res, next) => {
  const categories = await Category.find().exec();
  res.render("item_form", {title: "Create new item", categories: categories});
});

// Handle Genre create on POST.
exports.item_create_post = [
  // Validate and sanitize the name field.
  body("name", "Name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must contain at least 5 characters long")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("price", "Price must be more then 0")
    .trim()
    .isNumeric()
    .isFloat({ min: 0.01 })
    .escape(),
  body("numInStock", "Quantity must be a posititve whole number")
    .trim()
    .isNumeric()
    .isInt({ min: 0 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a item object with escaped and trimmed data.
    const item = new Item({ 
      name: req.body.name, 
      description: req.body.description, 
      category: req.body.category,
      price: req.body.price,
      numInStock: req.body.numInStock,
     });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const categories = await Category.find().exec();
      res.render("item_form", {
        title: "Create Item",
        categories: categories,
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Item with same name already exists.
      const itemExists = await Item.findOne({ name: req.body.name }).exec();
      if (itemExists) {
        // Item exists, redirect to its detail page.
        res.redirect(itemExists.url);
      } else {
        await item.save();
        // New item saved. Redirect to genre detail page.
        res.redirect(item.url);
      }
    }
  }),
];

exports.item_delete_get = asyncHandler(async(req, res, next) => {
  const item = await Item.findById(req.params.id);

  res.render("item_delete", {title: "Confirm removal", item: item})
});

exports.item_delete_post = asyncHandler(async(req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid);

  res.redirect("/catalog/items");
});