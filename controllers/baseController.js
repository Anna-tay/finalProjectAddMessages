const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
  // console.log('this is logout and login ' + loginLogout)
  // req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav,
  loginLogout})
}

module.exports = baseController