import fs from 'fs';
import path from 'path';
import Sentiment from 'sentiment';
import keyword_extractor from 'keyword-extractor';

// Initialize the sentiment analyzer
const sentiment = new Sentiment();

// Define input/output paths
const dataDir = path.join(__dirname, '../data');
const outputDir = path.join(__dirname, '../analysis');

// Analzye sentiment of a block of text
function analyzeSentiment(text: string) {
    const result = sentiment.analyze(text);
    const sentimentScore = result.score;

    // Classify sentiment based on score
    const label = sentimentScore > 1 ? 'positive' : sentimentScore < -1 ? 'negative' : 'neutral';

    // Return sentiment score and label
    return {sentimentScore, label};
}


// Add a custom blacklist of unhelpful/common words
const blacklist = new Set([
  "prepared", "remarks", "operator", "good", "afternoon", "conference",
  "today", "thank", "you", "everyone", "nvidia", "quarter", "call",
  "company", "business", "results", "financial", "year", "sequentially", 
  "nvidia's", "data", "revenue", "billion", "software", "models", "center", 
  "enterprise", "compute", "demand"
]);

function extractKeywords(text: string, topN = 5): string[] {
  const rawWords = keyword_extractor.extract(text, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false
  });

  // Filter out blacklisted words and short/meaningless terms
  const filteredWords = rawWords.filter(word =>
    word.length > 2 && !blacklist.has(word)
  );

  // Count frequency
  const freqMap = new Map<string, number>();
  filteredWords.forEach(word => {
    freqMap.set(word, (freqMap.get(word) || 0) + 1);
  });

  // Sort by frequency and return top N
  return Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(entry => entry[0]);
}

// Loop through all transcript files in the data directory
fs.readdirSync(dataDir).forEach((file) => {
    if (!file.endsWith('.json')) return;

    // Builds the full path to the file
    const filePath = path.join(dataDir, file);
    //Reads the file content
    const raw = fs.readFileSync(filePath, 'utf-8');
    // Parses the JSON content into quarter, prepared, and qa variables
    const { quarter, prepared, qa } = JSON.parse(raw);

    // Analyze sentiment and extract keywords
    const managementSentiment = analyzeSentiment(prepared); // Checked to ensure prepared string is being parsed in its entirety
    const qaSentiment = analyzeSentiment(qa); // Checked to ensure qa string is being parsed in its entirety
    const strategicFocuses = extractKeywords(prepared);

    // Build the analysis object
    const analysis = {
        quarter,
        managementSentiment,
        qaSentiment,
        strategicFocuses,
    };

    // Save the analysis result to a new JSON file
    const outputPath = path.join(outputDir, file.replace('.json', '_analysis.json'));
    fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

    // Log the analysis result to the console
    console.log(`Analysis for ${file} saved to ${outputPath}\n`);

});