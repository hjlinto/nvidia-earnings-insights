import express from 'express';
import cors from 'cors';
import analysisRouter from './routes/analysis';

// Create an Express application
const app = express();

// Define the port on which the server will listen
const PORT = 4000;

// Enable CORS to allow frontend request from other origins
app.use(cors());

// Mount the analysis route under /api/analysis
app.use('/api/analysis', analysisRouter);

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
