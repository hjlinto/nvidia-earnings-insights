'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Define the structure of the sentiment data
type Sentiment = {
  sentimentScore: number;
  label: string;
};

// Define the structure of the analysis data for each quarter
type Analysis = {
  quarter: string;
  managementSentiment: Sentiment;
  qaSentiment: Sentiment;
  strategicFocuses: string[];
  prepared: string;
  qa: string;
};

export default function Home() {
  // State to hold the analysis data loaded from the API
  const [data, setData] = useState<Analysis[]>([]);

  // Fetch the analysis data from the API when the component mounts
  useEffect(() => {
    fetch('/api/analysis')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Failed to load analysis:', err));
  }, []);

  const sentimentData = data.map(entry => ({
    quarter: entry.quarter,
    managementSentiment: entry.managementSentiment.sentimentScore,
    qaSentiment: entry.qaSentiment.sentimentScore,
  }));

  return (
      <main className="p-4 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">NVIDIA Earnings Insights</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold">Sentiment Score Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sentimentData}>
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="managementSentiment" fill="#8884d8" name="Management" />
            <Bar dataKey="qaSentiment" fill="#82ca9d" name="Q&A" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold">Tone Trends Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sentimentData}>
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="managementSentiment" stroke="#8884d8" name="Management" />
            <Line type="monotone" dataKey="qaSentiment" stroke="#82ca9d" name="Q&A" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {data.map(entry => (
        <section key={entry.quarter} className="mb-12">
          <h2 className="text-lg font-bold">{entry.quarter}</h2>

          <div className="mt-2">
            <h3 className="font-semibold">Prepared Remarks</h3>
            <pre className="p-2 whitespace-pre-wrap border rounded dark:bg-gray-800 dark:text-gray-100">
              {entry.prepared}
            </pre>
          </div>

          <div className="mt-2">
            <h3 className="font-semibold">Q&A Section</h3>
            <pre className="p-2 whitespace-pre-wrap border rounded dark:bg-gray-800 dark:text-gray-100">
              {entry.qa}
            </pre>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Strategic Focuses</h3>
            <ul className="space-y-2">
              {entry.strategicFocuses.map((focus, idx) => (
                <li key={idx} className="border p-2 rounded dark:bg-gray-800 dark:text-gray-100">
                  <strong>{focus}</strong>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </main>
  );
}