// require statements
const utilities = require("../utilities/index")
const bcrypt = require('bcryptjs');
const accountModel = require('../models/account-model')
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
   

  // Hash the password before storing
  let hashedPassword;
  try {
    // Hash the password using bcrypt
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
    loginLogout,
      errors: null,
       
    });
    return; // Return to avoid executing the rest of the function in case of an error
  }

  // Call registerAccount with the hashed password
  const regResult = await accountModel.registerAccountSQL(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword  // Use the hashed password
  );

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    loginLogout,
      
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
    loginLogout,
       
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  // console.('this is account Data' + accountData)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
    loginLogout,
      errors: null,
      account_email,

    })
    return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return res.redirect("/account/"+account_email)
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
    res.render("account/login", {
      title: "Login",
      nav,
    loginLogout,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
  res.render("account/registration", {
    title: "Register",
    nav,
    loginLogout,
    errors: null,
  })
}


async function buildShowSorry(req, res, next) {
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
  res.render("account/sorry", {
    title: "Sorry",
    nav,
    loginLogout,
    errors: null,
  })
}


/* ****************************************
*  Deliver buildShowLogin view
* *************************************** */
async function buildShowLogin(req, res, next) {
  const account_email = req.params.account_email
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout()
  let account_info = await utilities.getAccountType(account_email)
  let accountType = account_info.account_type
  let account_name = account_info.account_firstname + ' ' + account_info.account_lastname
  let account_id = account_info.account_id;
  let contactTable = await utilities.buildContactTable()
  // let addContact = "/account/addContact/"+ account_id
  let updateAccountLink = "/account/update-info/" + account_id
  res.render("account/showLogin", {
    title: "Congrats you are logged in",
    nav,
    loginLogout,
    errors: null,
    accountType,
    account_name,
    account_id,
    contactTable,
    updateAccountLink
  })
}


async function buildUpdateAccount(req, res, next) {
  const account_id = req.params.account_id
  let nav = await utilities.getNav()
  let account_info = await utilities.getAccountById(account_id)
  let account_firstname = account_info.account_firstname
  let account_lastname = account_info.account_lastname
  let account_email = account_info.account_email
  let loginLogout = await utilities.getLoginLogout()
  res.render("account/updateAccount", {
    title: "Update Account",
    nav,
    loginLogout,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
  })
}


async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout();
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  // Call registerAccount with the hashed password
  const regResult = await accountModel.updateAccountSQL(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );

  if (regResult) {
    let nav = await utilities.getNav()
    let loginLogout = await utilities.getLoginLogout()
    let account_info = await utilities.getAccountById(account_id)
    console.log('2 here', account_info)
    let account_firstname = account_info.account_firstname
    let account_lastname = account_info.account_lastname
    let account_email = account_info.account_email
    req.flash("notice", `Congratulations, you updated the account: ${account_info.account_firstname}.`);
    res.render("account/updateAccount", {
      title: 'Congratulations, you updated the account!',
      nav,
      loginLogout,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.render("account/updateAccount", {
      title: "Update Account",
      nav,
    loginLogout,
      account_id,
      account_firstname,
    account_lastname,
    account_email,
    });
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  let loginLogout = await utilities.getLoginLogout();
  const { account_id, account_password } = req.body;

  let hashedPassword
  // Hash the password before storing
  try {
    // Hash the password using bcrypt
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    let account_info = await utilities.getAccountById(account_id)
    let account_firstname = account_info.account_firstname
    let account_lastname = account_info.account_lastname
    let account_email = account_info.account_email
    req.flash("notice", 'Sorry, there was an error processing the update .');
    res.render("account/updateAccount", {
      title: "Update Account",
      nav,
    loginLogout,
      errors: null,
      account_id,
      account_email,
      account_firstname,
      account_lastname
    });
    return; // Return to avoid executing the rest of the function in case of an error
  }

  // Call registerAccount with the hashed password
  const regResult = await accountModel.updatePasswordSQL(
    account_id,
    hashedPassword  // Use the hashed password
  );
  console.log('it updated')

  if (regResult) {
    let nav = await utilities.getNav()
    let loginLogout = await utilities.getLoginLogout()
    let account_info = await utilities.getAccountById(account_id)
    console.log('2 here', account_info)
    let account_firstname = account_info.account_firstname
    let account_lastname = account_info.account_lastname
    let account_email = account_info.account_email
    req.flash("notice", `Congratulations, you updated the account: ${account_info.account_firstname}.`);
    res.render("account/updateAccount", {
      title: 'Congratulations, you updated the account!',
      nav,
      loginLogout,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  } else {
    let account_info = await utilities.getAccountById(account_id)
    console.log('1 here', account_info)
    let account_firstname = account_info.account_firstname
    let account_lastname = account_info.account_lastname
    let account_email = account_info.account_email
    req.flash("notice", "Sorry, the registration failed.");
    res.render("account/updateAccount", {
      title: "Update Account",
      nav,
      loginLogout,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

// final project add new contact
/* ****************************************
*  Deliver buildAddContact view
* *************************************** */
async function buildAddContact(req, res, next) {
  const account_id = req.params.account_id
  let nav = await utilities.getNav()
  res.render("account/addContact", {
    title: "Please add a new Contact!",
    nav,
    loginLogout,
    errors: null,
    account_id,
  })
}

// async function addContact(req, res, next) {
//   let nav = await utilities.getNav()
//   let loginLogout = await utilities.getLoginLogout();
//   const { account_firstname, account_lastname, account_email, account_phone, account_relationship, account_info, account_id } = req.body;

//   // Call registerAccount with the hashed password
//   const regResult = await accountModel.addContactSQL(
//     account_firstname, account_lastname, account_email, account_phone, account_relationship, account_info, account_id
//   );

//   if (regResult) {
//     const account_id = req.params.account_id
//     let nav = await utilities.getNav()
//     res.render("account/addContact", {
//       title: "A contact was created! Want to add another?",
//       nav,
//       loginLogout,
//       errors: null,
//       account_id,
//     })
//   } else {
//     const account_id = req.params.account_id
//     let nav = await utilities.getNav()
//     res.render("account/addContact", {
//       title: "Sorry something went wrong please try again later.",
//       nav,
//       loginLogout,
//       errors: null,
//       account_id,
//     })
//   }
// }

module.exports = { updatePassword, buildAddContact, updateAccount, buildUpdateAccount, buildLogin, buildRegister, registerAccount, accountLogin, buildShowLogin, buildShowSorry }
