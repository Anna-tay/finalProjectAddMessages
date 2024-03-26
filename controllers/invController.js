const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}



/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try{
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
     
    const className = data[0].classification_name
    res.render("./inventory/classification.ejs", {
      title: className + " vehicles",
      nav,
    loginLogout,
      grid,
      
    })
  } catch (error) {
    console.error("Error in buildByClassificationId:", error);
    // Handle the error appropriately, e.g., send an error response or redirect
    res.status(500).send("Internal Server Error");
  }
}

/* ***************************
 *  Build inventory by Details view
 * ************************** */
invCont.buildByDetailsId = async function (req, res, next) {
  try{
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByDetailsId(inv_id)
    console.log('inv' + data)
    const grid = await utilities.buildDetailsGrid(data)
    // console.log("this is grid" + grid)
    let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
     
    let name = data.inv_make + " " + data.inv_model
    res.render("./inventory/details.ejs", {
      title: name ,
      nav,
    loginLogout,
      grid,
      
    })
  } catch (error) {
    console.error("Error in buildByDetailsId:", error);
    // Handle the error appropriately, e.g., send an error response or redirect
    res.status(500).send("Internal Server Error");
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditView = async function (req, res, next) {
  const inv_id = req.params.invId
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
   
  const itemData = await invModel.getInventoryByDetailsId(inv_id)
  const classificationSelect = await utilities.buildClassificationList()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    loginLogout,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
   
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  console.log('this is the classification ', classification_id)
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    loginLogout,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    
    })
  }
}


/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = req.params.invId
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
   
  const itemData = await invModel.getInventoryByDetailsId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete_confirm", {
    title: "Delete " + itemName,
    nav,
    loginLogout,
    
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
   
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  } = req.body
  const updateResult = await invModel.deleteInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  )

  if (updateResult == 'true') {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/delete_confirm", {
    title: "Delete " + itemName,
    nav,
    loginLogout,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
    })
  }
}

module.exports = invCont