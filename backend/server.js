const express = require('express');
const logger = require('morgan');
const path = require('path');
const connectToDb = require('./models/db'); // Connexion MongoDB

const app = express();
const port = 3000;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');

app.use(logger('dev')) // 'dev' affiche un format de log compact avec méthode, URL, et statut
app.use('/', indexRouter);
app.use(express.json());
app.use('/users', usersRouter);

app.use((req, res, next) => {
    const error = new Error('Ressource non trouvée');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

connectToDb()
    .then((db) => {
        app.locals.db = db;
        app.listen(port, () => {
            console.log(`Serveur en écoute sur http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Erreur de connexion à MongoDB :', err);
        process.exit(1);
    });


