const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

let users = {};
let scores = {};
let submissions = {};

function loadUsers() {
    try {
        users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
    } catch (error) {
        console.log('No users.json found. Starting with an empty user list.');
    }
}

function saveUsers() {
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), 'utf8');
}

function loadScores() {
    try {
        scores = JSON.parse(fs.readFileSync(path.join(__dirname, 'scores.json'), 'utf8'));
    } catch (error) {
        console.log('No scores.json found. Starting fresh.');
    }
}

function saveScores() {
    fs.writeFileSync(path.join(__dirname, 'scores.json'), JSON.stringify(scores, null, 2), 'utf8');
}

function loadSubmissions() {
    try {
        submissions = JSON.parse(fs.readFileSync(path.join(__dirname, 'submissions.json'), 'utf8'));
    } catch (error) {
        console.log('No submissions.json found. Starting fresh.');
    }
}

function saveSubmissions() {
    fs.writeFileSync(path.join(__dirname, 'submissions.json'), JSON.stringify(submissions, null, 2), 'utf8');
}

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secretMotus',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

let words, wordOfDay;

function loadWords() {
    words = fs.readFileSync(path.join(__dirname, 'data', 'liste_francais_utf8.txt'), 'utf8').split('\n');
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
    if (users[req.body.login] === req.body.password) {
        req.session.user = req.body.login;
        res.redirect('/');
    } else {
        res.send('Identifiant ou mot de passe incorrect.');
    }
});

app.post('/register', (req, res) => {
    if (req.body.password !== req.body.password2) {
        res.send('Les mots de passe ne correspondent pas.');
    } else if (users[req.body.login]) {
        res.send('Cet utilisateur existe déjà.');
    } else {
        users[req.body.login] = req.body.password;
        saveUsers();
        res.redirect('/login.html');
    }
});

app.get('/current-user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user, score: scores[req.session.user] || 0, submissions: submissions[req.session.user] || 0 });
    } else {
        res.status(401).send('Non authentifié.');
    }
});

app.post('/api/update-stats', (req, res) => {
    if (req.session.user) {
        scores[req.session.user] = req.body.score;
        submissions[req.session.user] = req.body.submissions;
        saveScores();
        saveSubmissions();
        res.json({ status: 'success', message: 'Stats updated.' });
    } else {
        res.status(401).send('Non authentifié.');
    }
});

app.use((req, res, next) => {
    if (req.session.user || req.path.startsWith('/login') || req.path.startsWith('/register')) {
        next();
    } else {
        res.redirect("/login.html");
    }
});

app.get('/all-scores', (req, res) => {
    let allScores = Object.keys(scores).map(user => ({
        user,
        score: scores[user],
        submissions: submissions[user],
        averageTry: submissions[user] ? (scores[user] / submissions[user]).toFixed(2) : 0
    }));

    allScores.sort((a, b) => b.score - a.score);

    res.json(allScores);
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    loadWords();
    loadScores();
    loadUsers();
    loadSubmissions();
});
