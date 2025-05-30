const express = require('express');
const router = express.Router();
const db = require('../db-connector');

router.get('/', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT Customers.customerID, Customers.name, Customers.email, Customers.phoneNumber, Orders.orderID \
        FROM Customers \
        LEFT JOIN Orders ON Customers.customerID = Orders.customerID \
        ORDER BY Customers.name ASC;`;
        const [customers] = await db.query(query1);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('customers/index', { customers: customers});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


router.get('/new', (req, res) => {
  res.render('customers/new', { title: 'Add Customer' });
});

router.post('/new', async (req, res) => {
  const { name, email, phoneNumber } = req.body;
  res.redirect('/customers');
});

// router.get('/delete', (req, res) => {
//   res.render('customers/delete', { title: 'Delete a Customer' });
// });

// router.post('/delete', async (req, res) => {
//   const { name, email, phoneNumber } = req.body;
//   res.redirect('/customers');
// });

router.get('/:id/edit', async (req, res) => {
  const id = req.params.id;
  res.render('customers/edit', { title: 'Edit Customer', customer: { customerID: id, name: '', email: '', phoneNumber: '' } });
});

router.post('/:id/edit', async (req, res) => {
  const id = req.params.id;
  const { name, email, phoneNumber } = req.body;
  res.redirect('/customers');
});

module.exports = router;
