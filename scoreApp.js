const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 4000;

app.use(bodyParser.json());

// Score data storage file
const SCORE_FILE = path.join(__dirname, 'scores.json');

// Initialize score file if it doesn't exist
if (!fs.existsSync(SCORE_FILE)) {
    fs.writeFileSync(SCORE_FILE, JSON.stringify({}), 'utf8');
}

// Set score API
app.post('/setscore', (req, res) => {
    const { user, score, attempts } = req.body;
    const scores = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf8'));
    
    // Calculate average attempts if user already exists
    if (scores[user]) {
        let totalAttempts = scores[user].attempts * scores[user].wordsFound + attempts;
        scores[user].wordsFound += 1;
        scores[user].attempts = totalAttempts / scores[user].wordsFound;
    } else {
        scores[user] = { wordsFound: 1, attempts: attempts };
    }

    fs.writeFileSync(SCORE_FILE, JSON.stringify(scores), 'utf8');
    res.send('Score updated');
});

// Get score API
app.get('/getscore', (req, res) => {
    const { user } = req.query;
    const scores = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf8'));
    const userScore = scores[user];
    if (userScore) {
        res.json({ user: user, ...userScore });
    } else {
        res.status(404).send('User not found');
    }
});

app.listen(port, () => {
    console.log(`Score tracking server listening at http://localhost:${port}`);
});