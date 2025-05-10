import express from 'express';
import fs from 'fs';
import path from 'path';

// Create an Express router
const router = express.Router();

// Define the directory where analysis files are stored
const analysisDir = path.join(__dirname, '../analysis');

// Define a get route to serve all JSON files in the analysis directory
router.get('/', (_req, res) => {
  try {
    // Read all files in the directory with a .json extension
    const files = fs.readdirSync(analysisDir).filter(f => f.endsWith('.json'));

    //Read and parse each file into an object
    const results = files.map((file) => {
      const raw = fs.readFileSync(path.join(analysisDir, file), 'utf-8');
      return JSON.parse(raw);
    });

    // Send the array of parsed objects as the JSON response
    res.json(results);
  } catch (err) {
    // Log the error and send a 500 response
    console.error('Failed to load analysis:', err);
    res.status(500).json({ error: 'Failed to read analysis files' });
  }
});
// Export the router to be used in the main server file
export default router;
