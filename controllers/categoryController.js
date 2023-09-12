const asyncHandler = require("express-async-handler");
const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require('express-validator');

exports.category_list = asyncHandler(async (req, res, next) => {
  const categoryList = await Category.find().exec();

  res.render("categoryList", {
    title: "All categories",
    categoryList: categoryList,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name price numInStock").exec(),
  ]);

  res.render("category_detail", {
    title: "Category details",
    category: category,
    items: items,
  });
});


// Handle Category create on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", {title: "Create new category"});
};

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a item object with escaped and trimmed data.
    const category = new Category({ 
      name: req.body.name, 
      description: req.body.description, 
     });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Item with same name already exists.
      const categoryExists = await Category.findOne({ name: req.body.name }).exec();
      if (categoryExists) {
        // Item exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New item saved. Redirect to genre detail page.
        res.redirect(category.url);
      }
    }
  }),
];

//update category on GET
exports.category_update_get = asyncHandler(async(req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  res.render("category_form", {title: "Update category", category: category });
});

// Handle Category update on POST.
exports.category_update_post = [
  // Validate and sanitize the name field.
  body("name", "Name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a item object with escaped and trimmed data.
    const category = new Category({ 
      name: req.body.name, 
      description: req.body.description, 
      _id: req.params.id,
     });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Item with same name already exists.
      await Category.findByIdAndUpdate(category.id, category, {});
      // New item saved. Redirect to genre detail page.
      res.redirect(category.url);
    }
  }),
];

exports.category_delete_get = asyncHandler(async(req, res, next) => {
  const category = await Category.findById(req.params.id);
  const itemsInCategory = await Item.find({category: category._id});
  console.log("items in cat");
  console.log(itemsInCategory);

  res.render("category_delete", {title: "Confirm removal", category: category, itemsInCategory: itemsInCategory})
});

exports.category_delete_post = asyncHandler(async(req, res, next) => {

  console.log("DELETING");

  await Category.findByIdAndDelete(req.body.categoryid);

  res.redirect("/catalog/categories");
});