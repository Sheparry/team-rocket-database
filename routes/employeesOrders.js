const express = require('express');
const router = express.Router();
const db = require('../db-connector');

router.get('/', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT Orders.orderID, Employees.codeName, Employees.employeeID \
        FROM Orders \
        LEFT JOIN EmployeesOrders ON EmployeesOrders.orderID = Orders.orderID \
        LEFT JOIN Employees ON EmployeesOrders.employeeID = Employees.employeeID \
        ORDER BY Orders.orderID ASC;`;
        const [employeesOrders] = await db.query(query1);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('employeesOrders/index', { employeesOrders: employeesOrders});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

router.get('/new', (req, res) => {
  res.render('employeesOrders/new', { title: 'Assign Employee to Order' });
});

router.post('/new', async (req, res) => {
  const { orderID, employeeID } = req.body;
  res.redirect('/employeesOrders');
});

router.post('/:orderID/:employeeID/delete', async (req, res) => {
  const { orderID, employeeID } = req.params;
  res.redirect('/employeesOrders');
});

module.exports = router;
