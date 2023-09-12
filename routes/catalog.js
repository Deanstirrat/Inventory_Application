const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

/// ITEM ROUTES ///

// GET catalog home page.
router.get("/", item_controller.index);

// GET request to create an item.
router.get("/item/create", item_controller.item_create_get);
// POST request to create an item.
router.post("/item/create", item_controller.item_create_post);

// GET request to update an item.
router.get("/item/:id/update", item_controller.item_update_get);
// POST request to update an item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request to delete an item.
router.get("/item/:id/delete", item_controller.item_delete_get);
// POST request to update an item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request for one item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all items.
router.get("/items", item_controller.item_list);



// CATEGORY ROUTES //

// GET request to create a category.
router.get("/category/create", category_controller.category_create_get);
// POST request to create a category.
router.post("/category/create", category_controller.category_create_post);

// GET request to update a category.
router.get("/category/:id/update", category_controller.category_update_get);
// POST request to update a category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request to delete a category.
router.get("/category/:id/delete", category_controller.category_delete_get);
// POST request to update a category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET retquest for one category
router.get("/category/:id", category_controller.category_detail);

// GET request for a list of all categories 
router.get("/categories", category_controller.category_list)

module.exports = router;
