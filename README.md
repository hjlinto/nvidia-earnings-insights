# 📊 NVIDIA Earnings Transcript Insights

An AI-powered transcript analysis tool that processes NVIDIA's quarterly earnings calls to extract management tone, Q&A sentiment, and major strategic focuses using natural language processing (NLP) and large language models (LLMs). The application is built with a frontend interface for visualizing trends across quarters and full transcript review.

---

## Live Demo

[Check out the deployed app on Vercel](https://nvidia-earnings-insights-eij0j59s7-hjlintos-projects.vercel.app/)

---

## Features

- **Sentiment Analysis** of prepared remarks and Q&A sessions  
- **LLM-based Extraction** of top 5 quarterly strategic focuses  
- **Static Charts** to compare tone and sentiment across time  
- **Quarterly Transcript Viewer** with prepared remarks and Q&A sections
- **Frontend deployed on Vercel**, optimized for responsiveness and readability  

---

## Developer Contributions

This project was independently developed and includes:

- Custom backend script that preprocesses raw earnings transcripts into structured JSON format with:
  - Sentiment scoring using a lexicon-based model
  - LLM interaction using Ollama to extract quarterly focuses
- Frontend built in React (Next.js) to:
  - Display bar and line charts via Recharts
  - Render transcripts, sentiments, and LLM responses dynamically
  - Fetch and display all data from a local API endpoint
- Deployment via Vercel, using GitHub integration and `/frontend` project root

---

## Technologies & AI Tools Used

- **TypeScript** (Node.js for backend, Next.js for frontend)  
- **Sentiment** (`sentiment` NPM package using AFINN-based lexicon model)  
- **Ollama** (local LLM hosting, using `llama3` model)  
- **Recharts** (charting library for visualizations)  
- **Tailwind CSS** (styling and dark mode support)  
- **Vercel** (cloud deployment)  
- **Manual JSON transcript preprocessing** from public sources  

---

## Assumptions & Limitations

- A scraper is included as part of the application; however, it was not used for this deployment due to time constraints in identifying a reliable source that allows scraping of full, transcribed earnings calls for NVIDIA
- The LLM (LLaMA3 via Ollama) provided high-quality strategic focal points, but lacked the formatting precision of advanced paid APIs, making it difficult to enforce a clean, uniform JSON schema for frontend display
- LLM output may vary slightly per run due to generative variability  
- Backend is not cloud-hosted — all JSON files are pre-generated and read statically    

---

## Project Structure

```
.
├── backend/                           # Backend scripts and data processing
│   ├── analysis/                      # Output: processed sentiment + strategic focus JSONs
│   │   ├── q1_transcript_analysis.json
│   │   ├── q2_transcript_analysis.json
│   │   ├── q3_transcript_analysis.json
│   │   └── q4_transcript_analysis.json
│   ├── data/                          # Input: manually structured raw transcripts
│   │   ├── q1_transcript.json
│   │   ├── q2_transcript.json
│   │   ├── q3_transcript.json
│   │   └── q4_transcript.json
│   ├── routes/
│   │   └── analysis.ts                # Express route for serving analysis JSON
│   ├── scripts/
│   │   ├── analyzeTranscripts.ts      # Runs sentiment + LLM analysis and writes output
│   │   └── scrapeTranscripts.ts       # (Optional) scraper script not used in final version
│   ├── server.ts                      # Entry point for backend Express server
│   ├── package.json                   # Backend dependencies and scripts
│   ├── tsconfig.json                  # TypeScript configuration
│   └── .env                           # Environment variables (e.g., API keys)
│
├── frontend/                          # Next.js frontend app
│   ├── public/                        # Public assets (empty or holds precomputed data)
│   ├── src/
│   │   └── app/
│   │       ├── api/
│   │       │   └── analysis/route.ts  # API route to fetch preprocessed analysis data
│   │       ├── layout.tsx             # Root layout component
│   │       ├── page.tsx               # Main UI rendering transcripts and charts
│   │       ├── globals.css            # Global styles including Tailwind CSS
│   │       └── favicon.ico
│   ├── next.config.ts                 # Next.js config
│   ├── postcss.config.mjs             # Tailwind/PostCSS config
│   ├── tsconfig.json                  # TypeScript config
│   ├── package.json                   # Frontend dependencies and scripts
│   └── README.md                      # Frontend-specific documentation (optional)
│
├── package.json                       # (optional) shared root config if needed
└── node_modules/                      # Installed dependencies (auto-generated)
```


---

## How to Run Locally

1. Clone the repository
```bash
git clone https://github.com/hjlinto/nvidia-earnings-insights.git
```
2. Run the backend script to generate analysis files
```bash
cd backend
npm install
npx ts-node scripts/analyzeScripts.ts
```
3. Start the frontend development server
```bash
cd ../frontend
npm install
npm run dev
```
4. Open browser and navigate to: http://localhost:3000/

---

## Reflections

- In a future version, I’d consider hosting the backend as a cloud microservice (e.g., Render or Railway) to allow dynamic, on-demand analysis and expansion to other companies or transcript sources.
- A more advanced LLM with structured output support (like OpenAI’s function calling or Anthropic’s JSON mode) could improve frontend integration.

---

## Author

Created by: Hunter J Linton  


