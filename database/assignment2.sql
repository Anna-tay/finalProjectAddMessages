-- task 1
INSERT INTO account (account_firstname, 
					 account_lastname, 
					 account_email, 
					 account_password)
Values('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

select * from account;

-- task 2
UPDATE account
SET account_type = 'admin'
WHERE account_firstname = 'Tony';

select * from account;

-- task 3
DELETE FROM account WHERE account_firstname = 'Tony';

select * from account;

-- task 4
UPDATE inventory
SET inv_description =  REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

Select * from inventory;

-- task 5
SELECT i.inv_make, i.inv_model, c.classification_name  
FROM inventory as i 
INNER JOIN classification as c
ON i.classification_id = c.classification_id
WHERE c.classification_id = 2;

-- task 6
Update inventory
Set inv_image = replace (inv_image, 'ges/', 'ges/vehicles/'),
inv_thumbnail = replace(inv_thumbnail, 'ges/', 'ges/vehicles/' );

Select * from inventory;