const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let loginLogout = await utilities.getLoginLogout()

      res.render("inventory/edit-inventory", {
        errors,
        title: "Update Inventory",
        nav,
        loginLogout,
        inv_make, inv_model, inv_year, inv_description,
         inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id
      })
      return
    }
    next()
  }

validate.invUpdate = () => {
    return [
      body("inv_make")
          .trim()
          .isLength({ min: 1 })
          .withMessage("Please provide a inventory make."), // on error this message is sent.

        body("inv_model")
          .trim()
          .isLength({ min: 2 })
          .withMessage("Please provide a inventory model."),

        body("inv_year")
          .trim()
          .isLength({ min: 4 })
          .withMessage("Please provide a inventory year."),

        body("inv_description")
          .trim()
          .isLength({ min: 10 })
          .withMessage("Please provide a inventory description."),

        body("inv_image")
          .trim()
          .isLength({ min: 2 })
          .withMessage("Please provide a inventory image."),

        body("inv_thumbnail")
          .trim()
          .isLength({ min: 2 })
          .withMessage("Please provide a inventory thumbnail."),

        body("inv_price")
          .trim()
          .isFloat()
          .withMessage("Please provide a inventory price."),

        body("inv_miles")
          .trim()
          .isFloat()
          .withMessage("Please provide a inventory miles."),

        body("inv_color")
          .trim()
          .isLength({ min: 4 })
          .withMessage("Please provide a inventory color."),
    ]
}

module.exports = validate