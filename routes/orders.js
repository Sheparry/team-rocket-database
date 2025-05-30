const express = require('express');
const router = express.Router();
const db = require('../db-connector');

router.get('/', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT Orders.orderID, Orders.customerID, Orders.pokemonSpecies,Orders.minLevel,Orders.maxLevel,Locations.locationName AS 'location',Orders.meetupDate,Orders.priceOffered,Orders.status \
        FROM Orders \
        INNER JOIN Locations ON Orders.meetupLocation = Locations.locationID \
        ORDER BY Orders.orderID ASC;`;
        const [orders] = await db.query(query1);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('orders/index', { orders: orders});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

router.get('/new', (req, res) => {
  res.render('orders/new', { title: 'Add Order' });
});

router.post('/new', async (req, res) => {
  const { customerID, pokemonSpecies, minLevel, maxLevel, meetupLocation, meetupDate, priceOffered, status } = req.body;
  res.redirect('/orders');
});

router.get('/:id/edit', async (req, res) => {
  const id = req.params.id;
  res.render('orders/edit', {
    title: 'Edit Order',
    order: { orderID: id, customerID: '', pokemonSpecies: '', minLevel: '', maxLevel: '', meetupLocation: '', meetupDate: '', priceOffered: '', status: '' }
  });
});

router.post('/:id/edit', async (req, res) => {
  const id = req.params.id;
  const { customerID, pokemonSpecies, minLevel, maxLevel, meetupLocation, meetupDate, priceOffered, status } = req.body;
  res.redirect('/orders');
});

router.post('/:id/delete', async (req, res) => {
  const id = req.params.id;
  res.redirect('/orders');
});

module.exports = router;
