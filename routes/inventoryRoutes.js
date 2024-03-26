// Needed Resources
const express = require("express");
const router = new express.Router() ;
const invController = require("../controllers/invController");
const utilities = require("../utilities/index")
const validate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by details view
router.get("/detail/:invId", invController.buildByDetailsId);

// getting all inventory by classification id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// updating route
router.get("/edit/:invId", utilities.checkLoginned, utilities.handleErrors(invController.buildEditView))

router.post("/update",
    validate.invUpdate(),
    validate.checkUpdateData,
    invController.updateInventory)

// deleting data
router.get("/delete/:invId", utilities.handleErrors(invController.buildDeleteView))

router.post(
    "/delete",
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;