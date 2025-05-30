const express = require('express');
const router = express.Router();
const db = require('../db-connector');

router.get('/', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT Locations.locationID, Locations.locationName \
        FROM Locations \
        ORDER BY Locations.locationID;`;
        const [locations] = await db.query(query1);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('locations/index', { locations: locations});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


router.get('/new', (req, res) => {
  res.render('locations/new', { title: 'Add Location' });
});

router.post('/new', async (req, res) => {
  const { locationName } = req.body;
  res.redirect('/locations');
});

router.get('/:id/edit', async (req, res) => {
  const id = req.params.id;
  res.render('locations/edit', { title: 'Edit Location', location: { locationID: id, locationName: '' } });
});

router.post('/:id/edit', async (req, res) => {
  const id = req.params.id;
  const { locationName } = req.body;
  res.redirect('/locations');
});

router.post('/:id/delete', async (req, res) => {
  const id = req.params.id;
  res.redirect('/locations');
});

module.exports = router;
