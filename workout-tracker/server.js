const express = require('express'); // Import express
const app = express(); // Initialize the express app
const bodyParser = require('body-parser'); // Import body-parser for parsing request bodies

app.use(bodyParser.json()); // Middleware to parse JSON bodies

let exercises = []; // In-memory storage for exercises

// Get all exercises
app.get('/exercises', (req, res) => {
    res.json(exercises); // Send the exercises as a JSON response
});

// Add a new exercise
app.post('/exercises', (req, res) => {
    const { name, reps, sets } = req.body;
    exercises.push({ name, reps, sets }); // Add the new exercise to the list
    res.json({ message: 'Exercise added!' }); // Send a success message
});

// Serve static files from the 'public' folder (for frontend)
app.use(express.static('public'));

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
