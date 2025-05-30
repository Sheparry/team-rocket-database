const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const db = require('./db-connector');

const app = express();
const PORT = 30334;

app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
  });

// Routes
app.use('/pokemonSpecies', require('./routes/pokemonSpecies'));
app.use('/locations',      require('./routes/locations'));
app.use('/customers',      require('./routes/customers'));
app.use('/employees',      require('./routes/employees'));
app.use('/orders',         require('./routes/orders'));
app.use('/pokemon',        require('./routes/pokemon'));
app.use('/employeesOrders',require('./routes/employeesOrders'));

// RESET DB
app.post('/reset', async function (req, res) {
    try {

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_loadTeamRocket();`;

        // Runs the query
        await db.query(query1, []);

        console.log(`RESET Database `
        );

        // Redirect the user to the updated webpage
        res.redirect('/');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

//Listens
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

