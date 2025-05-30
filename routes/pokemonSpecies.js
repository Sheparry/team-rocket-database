const express = require('express');
const router = express.Router();
const db = require('../db-connector');

router.get('/', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT PokemonSpecies.speciesName, PokemonSpecies.pokedexEntry, PokemonSpecies.pokemonType1, \
            PokemonSpecies.pokemonType2 FROM PokemonSpecies ORDER BY PokemonSpecies.pokedexEntry ASC;`;
        const [species] = await db.query(query1);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('pokemonSpecies/index', { species: species});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


router.get('/new', (req, res) => {
  res.render('pokemonSpecies/new', { title: 'Add New Species' });
});

router.post('/new', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Cleanse data - If pokedex entry isn't a number, it becomes NULL
        
        if (isNaN(parseInt(data.create_species_pokedex)))
            data.create_species_pokedex = null;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_createSpecies(?, ?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        await db.query(query1, [
            data.create_species_name,
            data.create_species_pokedex,
            data.create_species_type1,
            data.create_species_type2,
        ]);

        console.log(`CREATE pokemon-species. ID: ${data.create_species_name} `
        );

        // Redirect the user to the updated webpage
        res.redirect('/pokemonSpecies');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// UPDATE pokemonSpecies
router.post('/edit', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // Cleanse data
        if (isNaN(parseInt(data.update_species_pokedex)))
            data.update_species_pokedex = null;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_updateSpecies(?, ?, ?, ?);';
        // const query2 = 'SELECT fname, lname FROM bsg_people WHERE id = ?;';
        await db.query(query1, [
            data.update_species_name,
            data.update_species_pokedex,
            data.update_species_type1,
            data.update_species_type2,
        ]);
        //const [[rows]] = await db.query(query2, [data.update_person_id]);

        console.log(`UPDATE pokemon-speices. ID: ${data.update_species_name} `
        );

        // Redirect the user to the updated webpage data
        res.redirect('/pokemonSpecies');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// DELETE pokemonSpecies
router.post('/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_deleteSpecies(?);`;
        await db.query(query1, [data.delete_species_name]);

        console.log(`DELETE pokemonSpecies. ID: ${data.delete_species_name} `
        );

        // Redirect the user to the updated webpage data
        res.redirect('/pokemonSpecies');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

module.exports = router;
