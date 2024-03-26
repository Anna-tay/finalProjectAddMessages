const utilities = require("../../utilities/index")

if (utilities.checkLogin()) {
    // If the user is logged in, show the "Logout" link
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "block";
} else {
    // If the user is not logged in, show the "My Account" link
    document.getElementById("login").style.display = "block";
    document.getElementById("logout").style.display = "none";
}