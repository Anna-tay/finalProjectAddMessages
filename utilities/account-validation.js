const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.

      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.

      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()

      res.render("account/registration", {
        errors,
        title: "Registration",
        nav,
    loginLogout,

        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Sorry that did not meet the requirements"),
  ]
}

/* ******************************
* Check data and return errors or continue to Login
* ***************************** */
validate.checkLoginData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()

    res.render("account/login", {
      errors,
      title: "Login",
      nav,
    loginLogout,
    })
    return
  }
  next()
}


// validation for manager routes
validate.newClassRules = () => {
  return [
    // password is required and must be strong password
    body("classification_id")
      .trim()
      .isLength({
        minLength: 1
      })
      .withMessage("The classification name does not meet the requirements"),
  ]
}

validate.checkNewClassData = async (req, res, next) => {
  const { classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
     
    res.render("inventory/add-classification", {
      errors,
      title: "New Classification",
      nav,
    loginLogout,
      
      classification_id
    })
    return
  }
  next()
}

// add inv validation
// validation for manager routes
validate.newInvRules = () => {
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

validate.checkNewInvData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
     
    res.render("inventory/add-inventory", {
      errors,
      title: "New Inventory",
      nav,
    loginLogout,
      
      inv_make, inv_model, inv_year, inv_description,
       inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    })
    return
  }
  next()
}

/*  **********************************
 *  update Data Validation Rules
 * ********************************* */
validate.updateRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
        throw new Error("Email exists. Please log in or use different email")
      }
    }),
  ]
}

/* ******************************
* Check data and return errors or continue to update
* ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  console.log('this is first name ' + account_firstname)
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
    res.render("account/updateAccount", {
      errors,
      title: "Update Account",
      nav,
    loginLogout,
    account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
 *  update password Data Validation Rules
 * ********************************* */
validate.updatePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
* Check data and return errors or continue to update password
* ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  console.log("maybe here 2")
  errors = validationResult(req)
  let account_info = await utilities.getAccountById(account_id)
  let account_firstname = account_info.account_firstname
  let account_lastname = account_info.account_lastname
  let account_email = account_info.account_email
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let loginLogout = await utilities.getLoginLogout()
    res.render("account/updateAccount", {
      errors,
      title: "Update Account",
      nav,
      loginLogout,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate