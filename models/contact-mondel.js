const pool = require("../database/")

async function getAllContacts() {
    try {
      const result = await pool.query(
        `SELECT c.contact_firstname,
        c.contact_lastname,
         c.contact_email,
         c.contact_phone,
         c.contact_relationship, c.contact_info, c.contacted, a.account_firstname, a.account_lastname
        FROM public.contacts AS c
        JOIN public.account AS a ON c.account_id = a.account_id;
        `)

      return result
    } catch (error) {
      return new Error("No contacts found")
    }
  }

module.exports = {getAllContacts}