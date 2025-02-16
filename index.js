import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import constructMultiGG from './functions/getAccountNames.js';

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// // Set the view engine to EJS
// app.set('view engine', 'ejs');

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the single page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API endpoint to handle form submission
app.post('/process', async (req, res) => {
    const url = req.body.url;
    try {
        const multiSearchUrl = await constructMultiGG(url);
        res.json({ multiSearchUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



