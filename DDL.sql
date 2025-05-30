SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

/*
    Creates a category for pokemon species
    This will contain type information on the pokemon and their pokedex number
*/
DROP TABLE IF EXISTS PokemonSpecies;
CREATE TABLE PokemonSpecies (
    speciesName varchar(50) NOT NULL,
    pokedexEntry int(5) NOT NULL,
    pokemonType1 varchar(8) not NULL,
    pokemonType2 varchar(8) DEFAULT NULL,
    PRIMARY KEY(speciesName)
    );

/*
    Creates a category table for locations
    There are only so many locations in the pokemon games, so it shouldn't need updates once the data has been entered    
*/
DROP TABLE IF EXISTS Locations;
CREATE TABLE Locations (
    locationID int NOT NULL AUTO_INCREMENT,
    locationName varchar(50) NOT NULL,
    PRIMARY KEY(locationID)
    );

/*
    Creates a table to store customer info
*/
DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
    customerID int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    email varchar(255) DEFAULT NULL,
    phoneNumber varchar(11) DEFAULT NULL,
    PRIMARY KEY(customerID)
    );

/*
    Creates a table to store employee info
*/
DROP TABLE IF EXISTS Employees;
CREATE TABLE Employees  (
    employeeID int NOT NULL AUTO_INCREMENT,
    codeName varchar(50) NOT NULL,
    burnerPhone varchar(11) DEFAULT NULL,
    reportsTo int DEFAULT NULL,
    primaryLocation int NOT NULL,
    PRIMARY KEY(employeeID),
    /*Reference to their supierior, which would be another employee*/
    FOREIGN KEY(reportsTo) REFERENCES Employees(employeeID),
    FOREIGN KEY(primaryLocation) REFERENCES Locations(locationID)
    ON DELETE CASCADE
    );

/*
    Creates a table to store order info.
    The order contains a pokemon species, and then a range of levels it should be.
    This can be used later to query the pokemon we have to see if any match.
*/
DROP TABLE IF EXISTS Orders;
CREATE TABLE Orders  (
    orderID int NOT NULL AUTO_INCREMENT,
    customerID int NOT NULL,
    pokemonSpecies varchar(50) NOT NULL,
    minLevel int NOT NULL,
    maxLevel int NOT NULL,
    meetupLocation int NOT NULL,
    meetupDate datetime NOT NULL,
    priceOffered int NOT NULL,
    status int(3) NOT NULL,
    PRIMARY KEY(orderID),
    FOREIGN KEY(customerID) REFERENCES Customers(customerID)
    ON DELETE CASCADE,
    FOREIGN KEY(pokemonSpecies) REFERENCES PokemonSpecies(speciesName)
    ON DELETE CASCADE,
    FOREIGN KEY(meetupLocation) REFERENCES Locations(locationID)
    ON DELETE CASCADE
    ); 

/*
    Creates a table to store specific pokemon
    This will contain who (if anyone) owns the pokemon, and the level of the pokemon
*/
DROP TABLE IF EXISTS Pokemon;
CREATE TABLE Pokemon (
    pokemonID int NOT NULL AUTO_INCREMENT,
    level int(5) NOT NULL,
    speciesName varchar(50) not NULL,
    employeeID int DEFAULT NULL,
    PRIMARY KEY(pokemonID),
    FOREIGN KEY(speciesName) REFERENCES PokemonSpecies(speciesName)
    ON DELETE CASCADE,
    FOREIGN KEY(employeeID) REFERENCES Employees(employeeID)
    );

/*
    Creates a intersection table between Employees and Orders
    The primary key is a composite key of the two foreign keys
*/
DROP TABLE IF EXISTS EmployeesOrders;
CREATE TABLE EmployeesOrders (
    orderID  int NOT NULL,
    employeeID int NOT NULL,
    PRIMARY KEY(orderID,employeeID),
    FOREIGN KEY(orderID) REFERENCES Orders(orderID)
    ON DELETE CASCADE,
    FOREIGN KEY(employeeID) REFERENCES Employees(employeeID)
    ON DELETE CASCADE
    );

INSERT INTO Customers (name, email, phoneNumber) VALUES 
('Ash Ketchum', 'ash.pallet@pokemail.com', '5551234567'),
('Misty Waterflower', 'misty@ceruleangym.com', '5552345678'),
('Brock Harrison', 'brock@pewtergym.com', '5553456789'),
('Gary Oak', 'gary.oak@pokemail.com', '5554567890'),
('Professor Oak', 'prof.oak@pokelab.org', NULL);

INSERT INTO Employees (codeName, burnerPhone, primaryLocation) VALUES 
('Team Rocket', '5551112222', 1),
('Jessie', '5552223333', 2),
('James', '5553334444', 3),
('Meowth', '5554445555', 4),
('Giovanni', '5550001111', 5);

UPDATE Employees
SET reportsTo = (SELECT employeeID FROM Employees WHERE codeName = 'Team Rocket')
WHERE codeName = 'Jessie' OR codeName = 'James' OR codeName = 'Meowth';

INSERT INTO Locations (locationName) VALUES 
('Viridian Forest'),
('Mt. Moon'),
('Cerulean Cave'),
('Safari Zone'),
('Power Plant');

INSERT INTO PokemonSpecies (speciesName, pokedexEntry, pokemonType1, pokemonType2) VALUES 
('Pikachu', 25, 'Electric', NULL),
('Charizard', 6, 'Fire', 'Flying'),
('Bulbasaur', 1, 'Grass', 'Poison'),
('Squirtle', 7, 'Water', NULL),
('Mewtwo', 150, 'Psychic', NULL);

INSERT INTO Pokemon (level, speciesName, employeeID) VALUES 
(15, 'Pikachu', 2),
(36, 'Charizard', 3),
(5, 'Bulbasaur', 4),
(12, 'Squirtle', 5),
(70, 'Mewtwo', 1);

INSERT INTO Orders (customerID, pokemonSpecies, minLevel, maxLevel, meetupLocation, meetupDate, priceOffered, Status) VALUES 
((SELECT Customers.customerID FROM Customers WHERE Customers.name = "Ash Ketchum"), 'Pikachu', 10, 20, 1, '2023-06-15', 500, 1),
((SELECT Customers.customerID FROM Customers WHERE Customers.name = "Misty Waterflower"), 'Charizard', 30, 40, 2, '2023-06-20', 1500, 2),
((SELECT Customers.customerID FROM Customers WHERE Customers.name = "Brock Harrison"), 'Bulbasaur', 1, 10, 3, '2023-06-25', 300, 1),
((SELECT Customers.customerID FROM Customers WHERE Customers.name = "Gary Oak"), 'Squirtle', 10, 15, 4, '2023-07-01', 400, 3),
((SELECT Customers.customerID FROM Customers WHERE Customers.name = "Professor Oak"), 'Mewtwo', 60, 80, 5, '2023-07-10', 5000, 0);

INSERT INTO EmployeesOrders (orderID, employeeID) VALUES 
(1, (SELECT employeeID FROM Employees WHERE codeName = "Jessie")),
(1, (SELECT employeeID FROM Employees WHERE codeName = "James")),
(2, (SELECT employeeID FROM Employees WHERE codeName = "James")),
(3, (SELECT employeeID FROM Employees WHERE codeName = "Meowth")),
(4, (SELECT employeeID FROM Employees WHERE codeName = "Giovanni"));

SET FOREIGN_KEY_CHECKS=1;
COMMIT;