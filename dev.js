const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const sass = require('node-sass');
const path = require('path');
const app = express();
const port = 5000;
// const browsersync = require('browser-sync');

// Define a pasta 'public' como a pasta static do express
app.use(express.static(path.join(__dirname, 'public')));

// Conecta com mongoose
mongoose.connect('mongodb://localhost/budget-management')
  .then(() => console.log('Banco de dados conectado'))
  .catch((err) => console.log(err));

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