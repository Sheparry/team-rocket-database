const express = require('express');
const router = express.Router();
const db = require('../db-connector');

router.get('/', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT Pokemon.pokemonID, Employees.codeName, Pokemon.level, PokemonSpecies.speciesName, PokemonSpecies.pokedexEntry, PokemonSpecies.pokemonType1, PokemonSpecies.pokemonType2 \
        FROM Pokemon \
        INNER JOIN PokemonSpecies ON Pokemon.speciesName = PokemonSpecies.speciesName \
        INNER JOIN Employees ON Employees.employeeID = Pokemon.employeeID \
        ORDER BY Pokemon.pokemonID ASC;`;
        const [pokemon] = await db.query(query1);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('pokemon/index', { pokemon: pokemon});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

router.get('/new', (req, res) => {
  res.render('pokemon/new', { title: 'Add Pokémon' });
});

router.post('/new', async (req, res) => {
  const { level, speciesName, employeeID } = req.body;
  res.redirect('/pokemon');
});

router.get('/:id/edit', async (req, res) => {
  const id = req.params.id;
  res.render('pokemon/edit', {
    title: 'Edit Pokémon',
    pokemon: { pokemonID: id, level: '', speciesName: '', employeeID: '' }
  });
});

router.post('/:id/edit', async (req, res) => {
  const id = req.params.id;
  const { level, speciesName, employeeID } = req.body;
  res.redirect('/pokemon');
});

router.post('/:id/delete', async (req, res) => {
  const id = req.params.id;
  res.redirect('/pokemon');
});

module.exports = router;
