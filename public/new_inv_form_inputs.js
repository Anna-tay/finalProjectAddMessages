const pool = require("../database/")

const formFields = [
    { label: 'Make', type: 'text', name: 'inv_make', required: true },
    { label: 'Model', type: 'text', name: 'inv_model', required: true },
    { label: 'Year', type: 'number', name: 'inv_year', required: true },
    { label: 'Description', type: 'textarea', name: 'inv_description', required: true },
    { label: 'Image URL', type: 'text', name: 'inv_image', required: true },
    { label: 'Thumbnail URL', type: 'text', name: 'inv_thumbnail', required: true },
    { label: 'Price', type: 'number', name: 'inv_price', required: true },
    { label: 'Miles', type: 'number', name: 'inv_miles', required: true },
    { label: 'Color', type: 'text', name: 'inv_color', required: true },
    { label: 'Category', type: 'select', name: 'classification_name', required: true}
];

async function fetchOptionsFromDatabase(req, res){
    // getting options
    const sql = `SELECT * FROM classification;`;
    const classification_options_data = await pool.queryNoParam(sql);

    const data = res.json(classification_options_data);
    return [
        data
    ];
}

// Function to dynamically generate form elements
// Function to dynamically generate form elements with asynchronous options fetching
async function generateFormElements() {
    const form = document.getElementById('dynamicForm');

    for (const field of formFields) {
        if (field.type === 'select') {
            const select = document.createElement('select');
            select.name = field.name;
            select.required = field.required;

            const label = document.createElement('label');
            label.innerText = field.label;

            // Fetch options asynchronously
            const options = await fetchOptionsFromDatabase();

            // Create options for the dropdown
            options.forEach(optionData => {
                const option = document.createElement('option');
                option.value = optionData.classification_id;
                option.text = optionData.classification_name;
                select.appendChild(option);
            });

            // Append label and select to the form
            form.appendChild(label);
            form.appendChild(select);
        } else {
            const element = document.createElement(field.type === 'textarea' ? 'textarea' : 'input');
            element.type = field.type;
            element.name = field.name;
            element.required = field.required;

            const label = document.createElement('label');
            label.innerText = field.label;

            form.appendChild(label);
            form.appendChild(element);
        }
    }
}

// Call the function to generate form elements when the page loads
window.onload = generateFormElements;
