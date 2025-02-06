const express = require('express');
const logger = require('morgan');
const connectToDb = require('./src/database/init-db'); // Connexion MongoDB
const passport = require("./src/config/passport");
const app = express();
const port = 3000;

const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/user');
const assetsRouter = require('./src/routes/assets');

app.use(logger('dev'));
app.use(passport.initialize());

app.use(express.json());


// Ordre logique des routes
app.use(indexRouter);
app.use('/users', usersRouter);
app.use('/assets', assetsRouter);

// Gestion des erreurs 404
app.use((req, res, next) => {
    const error = new Error('Ressource non trouvée');
    error.status = 404;
    next(error);
});

// Middleware de gestion des erreurs globales
app.use((error, req, res, next) => {
    res.status(error.status && Number.isInteger(error.status) ? error.status : 500);
    res.json({
        error: {
            message: error.message || 'Erreur serveur',
        },
    });
});

// Connexion à MongoDB et démarrage du serveur
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