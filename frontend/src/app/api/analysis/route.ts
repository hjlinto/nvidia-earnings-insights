import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Define the GET API route to fetch analysis results
export async function GET() {

  console.log('CWD:', process.cwd());

  // Build the path to the analysis directory
  const analysisDir = path.join(process.cwd(), '../backend/analysis');

  console.log('Analysis Directory:', analysisDir);
  
  // Read all JSON files in the analysis directory
  const files = fs.readdirSync(analysisDir).filter(file => file.endsWith('_analysis.json'));

  // Read and parse each JSON file into an object
  const results = files.map(file => {
    const fullPath = path.join(analysisDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content);
  });

  // Return the results as a JSON response
  return NextResponse.json(results);
}
