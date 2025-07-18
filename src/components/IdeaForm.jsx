import React, { useState } from 'react';

const IdeaForm = ({ onResult }) => {
  const [idea, setIdea] = useState({
    title: '',
    problem: '',
    solution: '',
    audience: '',
    monetization: '',
    competitors: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setIdea({ ...idea, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const prompt = `You're an expert startup evaluator.

Evaluate this startup idea:
Title: ${idea.title}
Problem: ${idea.problem}
Solution: ${idea.solution}
Target Audience: ${idea.audience}
Monetization Strategy: ${idea.monetization}
Known Competitors: ${idea.competitors}

Give a score (0–100) and detailed feedback across:
1. Problem Relevance
2. Uniqueness
3. Market Potential
4. Monetization
5. Technical Feasibility

End with a one-line verdict.`;
console.log(prompt)

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const text = data.result;

      const scoreMatch = text.match(/score\s*[:\-]?\s*(\d{1,3})/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

      onResult({ score, feedback: text });
    } catch (error) {
      console.error('API call failed:', error);
      alert('Error evaluating idea. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-[#0e0e0e] p-8 rounded-2xl shadow-lg border border-gray-800"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">
          Validate Your Startup Idea
        </h2>

        {Object.entries(idea).map(([field, value]) => (
          <div key={field} className="mb-4">
            <label className="block text-sm text-gray-300 capitalize mb-1">
              {field.replace('_', ' ')}
            </label>
            <textarea
              name={field}
              value={value}
              onChange={handleChange}
              placeholder={`Enter ${field}...`}
              rows={field === 'problem' || field === 'solution' ? 3 : 2}
              className="w-full p-3 bg-[#1a1a1a] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition text-white font-semibold py-3 rounded-lg"
        >
          {loading ? 'Evaluating Idea...' : 'Validate with AI'}
        </button>
      </form>
    </div>
  );
};

export default IdeaForm;
