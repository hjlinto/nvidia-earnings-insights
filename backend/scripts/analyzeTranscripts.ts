import fs from 'fs';
import path from 'path';
import Sentiment from 'sentiment';
import { Ollama} from 'ollama';

// Initialize the sentiment analyzer
const sentiment = new Sentiment();
const ollama = new Ollama();

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

// Analyze Strategic Focuses using Ollama
async function analyzeStrategicFocuses(text: string) {
    const prompt = `Extract the top 5 strategic focuses or initiatives from the following text. The focuses should be relevant to the company's business and not generic terms. Please provide the focuses in a JSON array format. Ensure the format includes which number focus, the focus, and a brief description of the focus.  : ${text}`;

    const res = await ollama.chat({
        model: 'llama3',
        messages: [
            { role: 'user', content: prompt }
        ]
    });
    
    try {
        const extracted = JSON.parse(res.message.content);
        return Array.isArray(extracted) ? extracted : [res.message.content];
      } catch (error) {
        return [res.message.content];
    }
}

// Run analysis on all transcripts
(async () => {
    for (const file of fs.readdirSync(dataDir)) {
        if (!file.endsWith('.json')) continue;

        // Builds the full path to the file
        const filePath = path.join(dataDir, file);
        //Reads the file content
        const raw = fs.readFileSync(filePath, 'utf-8');
        // Parses the JSON content into quarter, prepared, and qa variables
        const { quarter, prepared, qa } = JSON.parse(raw);

        // Analyze sentiment and extract keywords
        const managementSentiment = analyzeSentiment(prepared); // Checked to ensure prepared string is being parsed in its entirety
        const qaSentiment = analyzeSentiment(qa); // Checked to ensure qa string is being parsed in its entirety
        const strategicFocuses = await analyzeStrategicFocuses(prepared);

        // Build the analysis object
        const analysis = {
        quarter,
        managementSentiment: {
            sentimentScore: managementSentiment.sentimentScore.toFixed(2),
            label: managementSentiment.label,
        },
        qaSentiment: {
            sentimentScore: qaSentiment.sentimentScore.toFixed(2),
            label: qaSentiment.label,
        },
        prepared,
        qa,
        strategicFocuses,
        };

        // Save the analysis result to a new JSON file
        const outputPath = path.join(outputDir, file.replace('.json', '_analysis.json'));
        fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

        // Log the analysis result to the console
        console.log(`Analysis for ${file} saved to ${outputPath}\n`);
    }
})();