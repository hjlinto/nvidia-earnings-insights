// Import required libraries
import axios from 'axios'; // Fetch HTML from the web
import * as cheerio from 'cheerio'; // Parse and navigate the HTML
import * as fs from 'fs'; // Save JSON files
import * as path from 'path'; // Build OS-specific paths

// List of NVIDIA earnings call URLs to scrape and their corresponding filenames
const urls = [
    {
        url: 'https://www.fool.com/earnings/call-transcripts/2024/05/29/nvidia-nvda-q1-2025-earnings-call-transcript/',
        file: 'nvidia-q1-2025.txt'
    },
    {
        url: 'https://www.fool.com/earnings/call-transcripts/2024/08/28/nvidia-nvda-q2-2025-earnings-call-transcript/',
        file: 'nvidia-q2-2025.txt'
    },
    {
        url: 'https://www.fool.com/earnings/call-transcripts/2024/11/20/nvidia-nvda-q3-2025-earnings-call-transcript/',
        file: 'nvidia-q3-2025.txt'
    },
    {
        url: 'https://www.fool.com/earnings/call-transcripts/2025/02/26/nvidia-nvda-q4-2025-earnings-call-transcript/',
        file: 'nvidia-q4-2025.txt'
    }
];

// Function to scrape the transcript from a given URL and save it to a file
async function scrapeTranscript(url: string, filename: string) {
    // Log the URL being scraped
    console.log(`Scraping ${url}...`);
    // Download the HTML content of the page
    const { data: html } = await axios.get(url); // Receiving a 403 error. Tried using a user agent, but it didn't work. Maybe the site is blocking requests from scripts.
    // Load the HTML into Cheerio for parsing
    const $ = cheerio.load(html);
    // Extract the title of the article
    const title = $('h1').first().text().trim();
    // SeLect the content blocks of the article
    const contentBlocks = $('div[data-test-id="article-content"] p');

    // Initialize variables to store the prepared remarks and Q&A sections
    let prepared = '';
    let qa = '';
    let inPrepared = false;
    let inQA = false;

    // Iterate over each content block to extract text
    contentBlocks.each((_, el) => {
        const text = $(el).text().trim();

        // Check if the Q&A section has started
        if (text.includes('Questions & Answers')) {
            inPrepared = false;
            inQA = true;
        }

        // Check if the prepared remarks section has started
        if (text.includes('Prepared Remarks') && !inPrepared && !inQA) {
            inPrepared = true;
        }

        // Collect the text based on the current section
        if (inPrepared) prepared += text + '\n';
        else if (inQA) qa += text + '\n';
    });

    // Build the result object with the scraped data
    const result = {
        quarter: title,
        prepared,
        qa
    };
    // Write the result to a JSON file        
    const outputPath = path.join(__dirname, '../data', filename);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    // Log the success message
    console.log(`Saved: ${filename}`);
}

// Function to scrape all transcripts
async function scrapeAllTranscripts() {
    // Iterate over each URL and scrape the transcript
    for (const { url, file } of urls) {
        try {
        await scrapeTranscript(url, file);
      } catch (err) {
        console.error(`Error scraping ${url}:`, (err as Error).message);
        }
    }
}

// Execute the scraping function
scrapeAllTranscripts();
