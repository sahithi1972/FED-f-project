const express = require('express');
const cors = require('cors');
const path = require('path');

// Configure dotenv with explicit path
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Basic error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to WasteChef API' });
});
app.get("/api/hello", (req, res) => {
    try {
        res.json({ message: "Hello from Node + Express backend!" });
    } catch (error) {
        console.error('Error in /api/hello:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test route for your recipes
app.get("/api/test-recipe", (req, res) => {
    res.json({
        recipe: {
            name: "Test Recipe",
            ingredients: ["ingredient 1", "ingredient 2"],
            instructions: ["step 1", "step 2"]
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}/api/hello`);
});