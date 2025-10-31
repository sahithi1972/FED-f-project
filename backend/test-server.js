const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Server is working!');
});

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from backend!' });
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});