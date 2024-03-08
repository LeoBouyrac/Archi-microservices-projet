const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

// Utilisateurs et scores stockés en mémoire (pour l'exemple)
let users = {};
let scores = {}; // Stores users' scores
let words = [];
let wordOfDay;

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To parse JSON bodies
app.use(session({
    secret: 'secretMotus',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

function loadWords() {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'liste_francais_utf8.txt'), 'utf8');
    words = data.split('\n');
    changeWord();
}

function changeWord() {
    wordOfDay = words[Math.floor(Math.random() * words.length)].trim();
}

app.get('/word', (req, res) => {
    res.send(wordOfDay);
});

app.get('/new-word', (req, res) => {
    changeWord();
    res.send(wordOfDay);
});

app.post('/login', (req, res) => {
    const { login, password } = req.body;
    if (users[login] && users[login] === password) {
        req.session.user = login;
        res.redirect('/');
    } else {
        res.send('Identifiant ou mot de passe incorrect.');
    }
});

app.post('/register', (req, res) => {
    const { login, password, password2 } = req.body;
    if (password !== password2) {
        return res.send('Les mots de passe ne correspondent pas.');
    }
    if (users[login]) {
        return res.send('Cet utilisateur existe déjà.');
    }
    users[login] = password;
    res.redirect('/login.html');
});

app.get('/current-user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).send('Non authentifié.');
    }
});

// Endpoint to update score
app.post('/setscore', (req, res) => {
    const { user, score } = req.body;
    if (!req.session.user) {
        return res.status(401).send('Non authentifié.');
    }
    scores[user] = score;
    res.send('Score updated');
});

// Endpoint to retrieve score
// Modified /getscore endpoint in app.js

// Adjusted /getscore endpoint to use a query parameter for the user
app.get('/getscore', (req, res) => {
    const user = req.query.user; // Retrieve the username from query parameters
    if (user && scores.hasOwnProperty(user)) {
        res.json({ user: user, score: scores[user] });
    } else {
        res.status(404).send('Score not found for the specified user.');
    }
});


app.use((req, res, next) => {
    if (req.session.user || req.path === '/login.html' || req.path.includes('/register') || req.path.includes('/login')) {
        next();
    } else {
        res.redirect("/login.html");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    loadWords();
});
