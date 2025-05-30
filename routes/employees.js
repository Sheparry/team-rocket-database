const express = require('express');
const router = express.Router();
const db = require('../db-connector');

router.get('/', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT Employees.employeeID, Employees.codeName, Employees.burnerPhone, Employees.reportsTo as SupieriorID, (SELECT Employees.codeName FROM Employees WHERE Employees.employeeID = SupieriorID) as SupieriorName, Locations.locationName \
        FROM Employees \
        INNER JOIN Locations ON Employees.primaryLocation = Locations.locationID \
        ORDER BY Employees.employeeID ASC;`;
        const [employees] = await db.query(query1);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('employees/index', { employees: employees});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


router.get('/new', (req, res) => {
  res.render('employees/new', { title: 'Add Employee' });
});

router.post('/new', async (req, res) => {
  const { codeName, burnerPhone, reportsTo, primaryLocation } = req.body;
  res.redirect('/employees');
});

router.get('/:id/edit', async (req, res) => {
  const id = req.params.id;
  res.render('employees/edit', {
    title: 'Edit Employee',
    employee: { employeeID: id, codeName: '', burnerPhone: '', reportsTo: '', primaryLocation: '' }
  });
});

router.post('/:id/edit', async (req, res) => {
  const id = req.params.id;
  const { codeName, burnerPhone, reportsTo, primaryLocation } = req.body;
  res.redirect('/employees');
});

router.post('/:id/delete', async (req, res) => {
  const id = req.params.id;
  res.redirect('/employees');
});

module.exports = router;
