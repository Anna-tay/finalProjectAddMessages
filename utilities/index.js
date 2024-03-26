const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const contactModel = require("../models/contact-mondel")
const jwt = require("jsonwebtoken")
require("dotenv").config()


const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul class='nav-section-color'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"

  })
  list += "</ul>"

  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => {
        grid += '<li>'
        grid +=  '<a href="/inv/detail/'+ vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
        + 'details"><img src="../public' + vehicle.inv_thumbnail
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else {
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

Util.buildDetailsGrid = async function(data) {
  let grid
  if (data) {
      grid = `
      <div class="containor detailsBackgorund">
      <div class="left-section">
        <div class="car-section">
          <h3 id='passed_inpec'>This vehicle has passed inspection <br> by an SAE-certified technician</h3>
          <h3 id='enter-prise'>enterprise certified</h3>
        </div>
      <img id="big-car" src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
      <img id="small-car" src="${data.inv_thumbnail}" alt="${data.inv_make} ${data.inv_model}">
      </div>
      <div class="right-section detail-section">
        <h1>${data.inv_year} ${data.inv_make} ${data.inv_model}</h1>
        <card class="no-hagging">
            <card class="miles">
              <h3>MILEAGE</h3>
              <h4>${data.inv_miles}</h4>
            </card>
            <card class="info-haggle">
              <h1>No-Haggle Price 1     $${data.inv_price}</h1>
              <p>Does not include 1211 Dealership Service Fee</p>
              <h3>ESTIMATE PAYMENTS</h3>
            </card>
          </card>
        <section class="detail-section-info">
          <section class="left-details-section">
            <p><strong>Mileage:</strong> ${data.inv_miles}</p>
            <p><strong>MPG:</strong> 23</p>
            <p><strong>Ext. Color:</strong> ${data.inv_color}</p>
            <p><strong>Int. Color:</strong> Black</p>
            <p><strong>Fuel Type:</strong> Gas</p>
            <p><strong>Drivetrain:</strong> FontWheel Drive</p>
            <p><strong>Transmission:</strong> Xtronic CVT</p>
            <p><strong>Stock #:</strong> D09G24</p>
            <p><strong>VIN:</strong> 0560327485</p>
            <h4 id="mpg">+ MPG</h4>

            <P>The principal prior use of this vehicle was as a Rental Vehicle</p>
          </section>
          <section class="right-details-section">
            <button class="start-my-purchase">START MY PURCHASE</button>
            <button class="other-buttons">CONTACT US</button>
            <button class="other-buttons">SCHEDULE TEST DRIVE</button>
            <button class="other-buttons">APPLY FOR FINANCING</button>

            <h3><strong>Call Us</strong></h3>
            <h3 class="number"><strong>801-37886</strong></h3>
            <h3><strong>Visit Us</strong></h3>
          </section>
        </section>
      </div>
  </div>
  `;
  } else {
      grid += '<p class="notice">Sorry, no vehicle could be found.</p>';
  }
  return grid;
};

Util.buildClassificationList = async function() {
  let data = await invModel.getClassifications()
  // console.log(data)
  let grid
  grid = `<label for="classificationList">Choose Classification Name</label> <br>`
  if (data) {
    grid += '<select id="classificationList" name="classification_id">'
    grid += `<option> Please select a classification</option>`
      data.rows.forEach(row => {
        grid += `<option value="${row.classification_id}">${row.classification_name}</option>`
      })
    grid += `</select>`;
  } else {
      grid += '<p class="notice">Sorry, no vehicle could be found.</p>';
  }
  return grid;
};

// buildContactTable
Util.buildContactTable = async function() {
    let data = await contactModel.getAllContacts()
    let grid = '<h3>Referrals</h3> <div class="contactTable">'
    if (data.rows){
      grid += `<table id="contactsTable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Relationship</th>
          <th>Info</th>
          <th>Referred By</th>
          <th></th>
        </tr>
      </thead>
      <tbody>`
      data.rows.forEach(row => {
        if (row.contacted == 1){
          grid += `<tr><td> ${row.contact_firstname} ${row.contact_lastname} </td>
          <td> ${row.contact_email}</td>
          <td> ${row.contact_phone}</td>
          <td> ${row.contact_relationship}</td>
          <td> ${row.contact_info}</td>
          <td> ${row.account_firstname} ${row.account_lastname}</td>
          <td><button onClick='markContacted()'>Contacted</button></td></tr>`
        }else{
          pass
        }

      });
      grid += `</tbody> </table> </div>`
    } else {
      grid += '<p class="notice">No one to contact yet. Please look again later!</p>';
    }
    return grid;
};


/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  // console.log("checkJWTToken was started")
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLoginned = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ************************
 * Constructs the login and logout
 ************************** */
Util.getLoginLogout = async function (req, res, next) {

  try {
    return 'loggedOut'
    // if (res.locals.loggedin) {
    //   console.log('this is logged in')
    //   return "loggedIn"
    // } else {
    //   return "loggedOut"
    // }
  } catch (error) {
    // Handle error appropriately
    console.error("Error in getLoginLogout:", error);
    return "loggedOut"
  }

};


//  getting account by email
Util.getAccountType = async function(account_email) {
  let account_info = await invModel.getAccountType(account_email)
  return account_info
}

// getting account by Id
Util.getAccountById = async function(account_id) {
  let account_info = await invModel.getAccountByIdSQL(account_id)
  return account_info
}

module.exports = Util