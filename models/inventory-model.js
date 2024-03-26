const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        'SELECT * FROM public.inventory AS i ' +
        'JOIN public.classification AS c ' +
        'ON i.classification_id = c.classification_id ' +
        'WHERE i.classification_id = $1',
        [classification_id]
      );
      return data.rows
    } catch (error) {
      console.error("getInventoryByClassificationId error: ", error);
      throw error; // Rethrow the error or handle it appropriately
    }

}

/* ***************************
 *  Get all information for a vehicle based on inv_id
 * ************************** */
async function getInventoryByDetailsId(inv_id) {
  try {
    const data = await pool.query(
      'SELECT * FROM inventory ' +
      'WHERE inv_id = ' + inv_id
    );
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByDetailsId error: ", error);
    throw error; // Rethrow the error or handle it appropriately
  }

}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function deleteInventory(
  inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
) {
  try {
    const sql =
      "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [
      inv_id,
    ])
    return 'true'
  } catch (error) {
    console.error("model error: " + error)
  }
}

// getting account type
async function getAccountType(account_email) {
  try {
    const data = await pool.query(
      'SELECT * FROM account ' +
      `WHERE account_email = '${account_email}'`
    );
    console.log('date.rows[0]' + data.rows[0])
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByDetailsId error: ", error);
    throw error; // Rethrow the error or handle it appropriately
  }

}

async function getAccountByIdSQL(account_id) {
  try {
    const data = await pool.query(
      'SELECT * FROM account ' +
      `WHERE account_id = '${account_id}'`
    );
    console.log(data.rows[0])
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByDetailsId error: ", error);
    throw error; // Rethrow the error or handle it appropriately
  }

}

module.exports = {getClassifications, getAccountByIdSQL, getInventoryByClassificationId, updateInventory, getInventoryByDetailsId, deleteInventory, getAccountType};