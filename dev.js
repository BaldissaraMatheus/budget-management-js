const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 5000;
// const browsersync = require('browser-sync');

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// Index Route
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Running application on port ${port}`);
});