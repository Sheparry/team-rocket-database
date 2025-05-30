-- ORDERS

/*Query for getting information about current orders*/
SELECT Orders.orderID, Orders.pokemonSpecies,Orders.minLevel,Orders.maxLevel,Locations.locationName,Orders.meetupDate,Orders.PriceOffered,Orders.Status
FROM Orders
INNER JOIN Locations ON Orders.meetupLocation = Locations.locationID
ORDER BY Orders.orderID ASC;

/*Query for add a new order, with @ being used to 
denote the variables that will have data from the backend*/

INSERT INTO Orders(customerID, pokemonSpecies, minLevel, maxLevel, meetupLocation, meetupDate, priceOffered, status) VALUES
(@customerID_from_name_dropdown,@pokemonSpecies_from_dropdown,@minLevelInput,@maxLevelInput,@location_from_dropdown,@dateInput,@priceOfferedInput,0);

DELETE FROM Orders
WHERE orderID = @orderID_from_row_clicked;

UPDATE Orders
SET customerID = @customerID_from_name_dropdown,
pokemonSpecies = @pokemonSpecies_from_dropdown,
minLevel = @minLevelInput,
maxLevel = @maxLevelInput,
meetupLocation = @location_from_dropdown,
meetupDate = @dateInput,
priceOffered = @priceOfferedInput,
status = @status_from_dropdown
WHERE orderID = @orderID_from_row_clicked;

-- EmployeesOrders

/*Query for getting all the employees working on each order*/
SELECT Orders.orderID, Employees.codeName, Employees.employeeID
FROM Orders
LEFT JOIN EmployeesOrders ON EmployeesOrders.orderID = Orders.orderID
LEFT JOIN Employees ON EmployeesOrders.employeeID = Employees.employeeID
ORDER BY Orders.orderID ASC;

/*Query for add a new employee on an order, with @ being used to denote
variables from backend*/
INSERT INTO EmployeesOrders (orderID, employeeID) VALUES
(@orderID_from_dropdown,@employeeID_from_codename_dropdown);

DELETE FROM EmployeesOrders
WHERE orderID = @orderID_from_row_clicked AND employeeID = @employeeID_from_row_clicked;

/*Query for replacing one employee with another on an order,
with @ used to denote variables from backend*/
UPDATE EmployeesOrders
SET employeeID = @new_employeeID_from_codename_dropdown
WHERE orderID = @orderID_from_row_clicked AND employeeID = @employeeID_from_row_clicked;


-- Customers

/*Shows the customer and what order(s) they have corresponding to them (if any)*/
SELECT Customers.customerID, Customers.name, Customers.email, Customers.phoneNumber, Orders.orderID
FROM Customers
LEFT JOIN Orders ON Customers.customerID = Orders.customerID
ORDER BY Customers.name ASC;

/*Query for add a new employee, with @ being used to 
denote the variables that will have data from the backend*/
INSERT INTO Customers(name, email, phoneNumber) VALUES
(@name_from_textbox, @email_from_textbox, @phoneNumber_from_textbox);

/*Query for deleting a customer, with @ denoting variables
from backend*/
DELETE FROM Customers
WHERE customerID = @customerID_from_row_clicked;

UPDATE Customers
SET Customers.name = @name_from_textbox,
Customers.email = @email_from_textbox,
Customers.phoneNumber = @phoneNumber_from_textbox
WHERE customerID = @customerID_from_row_clicked;

-- Employees

/*Query for getting employee information, including superior officer*/
SELECT Employees.employeeID, Employees.codeName, Employees.burnerPhone, Employees.reportsTo as SupieriorID, (SELECT Employees.codeName FROM Employees WHERE Employees.employeeID = SupieriorID) as SupieriorName, Locations.locationName
FROM Employees
INNER JOIN Locations ON Employees.primaryLocation = Locations.locationID
ORDER BY Employees.employeeID ASC;

/*Query for add a new employee, with @ being used to 
denote the variables that will have data from the backend*/
INSERT INTO Employees(codeName, burnerPhone, reportsTo, primaryLocation) VALUES
(@codeName_from_textbox, @burnerPhone_from_textbox, @employeeID_from_codename_dropdown, @primaryLocation_from_location_dropdown);

/*Query for deleting a pokemon, with @ being used to 
denote the variables that will have data from the backend*/
DELETE FROM Employees
WHERE employeeID = @employeeID_from_row_clicked;

UPDATE Employees
SET Employees.codeName = @codeName_from_textbox,
Employees.burnerPhone = @burnerPhone_from_textbox,
Employees.reportsTo = @employeeID_from_codename_dropdown,
Employees.primaryLocation = @primaryLocation_from_location_dropdown
WHERE employeeID = @employeeID_from_row_clicked;

-- Pokemon

/*Query for getting each pokemon, who they belong too, and information about them*/
SELECT Pokemon.pokemonID, Pokemon.employeeID, Pokemon.level, PokemonSpecies.speciesName, PokemonSpecies.pokedexEntry, PokemonSpecies.pokemonType1, PokemonSpecies.pokemonType2
FROM Pokemon
INNER JOIN PokemonSpecies ON Pokemon.speciesName = PokemonSpecies.speciesName
ORDER BY Pokemon.pokemonID ASC;

/*Query for add a new pokemon, with @ being used to 
denote the variables that will have data from the backend*/
INSERT INTO Pokemon(employeeID, level, speciesName) VALUES
(@employeeID_from_codename_dropdown, @level_from_textbox, @speciesName_from_dropdown);

/*Query for deleting a pokemon, with @ being used to 
denote the variables that will have data from the backend*/
DELETE FROM Pokemon
WHERE pokemonID = @pokemonID_from_row_clicked;

UPDATE Pokemon
SET Pokemon.employeeID = @employeeID_from_codename_dropdown,
Pokemon.level = @level_from_textbox,
Pokemon.speciesName = @speciesName_from_dropdown
WHERE pokemonID = @pokemonID_from_row_clicked;

-- Locations

SELECT Locations.locationID, Locations.locationName
FROM Locations
ORDER BY Locations.locationID;

/*Query for add a new location, with @ being used to 
denote the variables that will have data from the backend*/
INSERT INTO Locations(locationName) VALUES
(@location_name_from_textbox);

/*Query for deleting a location, with @ being used to 
denote the variables that will have data from the backend*/
DELETE FROM Locations
WHERE locationID = @locationID_from_row_clicked;

UPDATE Locations
SET locationName = @locationName_from_textbox
WHERE locationID = @locationID_from_row_clicked;

-- Pokemon Species

SELECT PokemonSpecies.speciesName, PokemonSpecies.pokedexEntry, PokemonSpecies.pokemonType1, PokemonSpecies.pokemonType2
FROM PokemonSpecies
ORDER BY PokemonSpecies.pokedexEntry ASC;

/*Query for add a new pokemon species, with @ being used to 
denote the variables that will have data from the backend*/
INSERT INTO PokemonSpecies(speciesName, pokedexEntry, pokemonType1, pokemonType2) VALUES
(@speciesName_from_textbox, @pokedexEntry_from_textbox, @pokemonType1_from_textbox, @pokemonType2_from_textbox);

/*Query for deleting a pokemon species, with @ being used to 
denote the variables that will have data from the backend*/
DELETE FROM PokemonSpecies
WHERE speciesName = @species_name_from_row_clicked;

UPDATE PokemonSpecies
SET speciesName = @speciesName_from_textbox,
@pokedexEntry_from_textbox,
@pokemonType1_from_textbox,
@pokemonType2_from_textbox
WHERE speciesName = @species_name_from_row_clicked;

