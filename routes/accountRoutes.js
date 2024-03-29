// Needed Resources
const express = require("express");
const router = new express.Router() ;
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')



// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/registration", accountController.buildRegister)

// show they logged in
router.get("/:account_email", utilities.checkLoginned, utilities.handleErrors(accountController.buildShowLogin))

router.get("/update-info/:account_id", utilities.checkLoginned, utilities.handleErrors(accountController.buildUpdateAccount))

router.post("/update-password/:account_id",
  utilities.checkLoginned,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
  )

router.post("/update-account/:account_id",
  utilities.checkLoginned,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
  )

router.get("/sorry", utilities.handleErrors(accountController.buildShowSorry))


// Process the registration data
router.post(
    "/registration",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
    regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


module.exports = router;