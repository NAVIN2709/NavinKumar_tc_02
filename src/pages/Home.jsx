import React, { useState, useEffect } from "react";
import IdeaForm from "../components/IdeaForm";
import { supabase } from "../../supabaseClient";

const Home = () => {
  const [session, setSession] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Parses raw AI feedback string
  const parseFeedback = (raw) => {
    const lines = raw.split('\n').map(line => line.trim()).filter(Boolean);

    const titleLine = lines.find(line => line.startsWith('**Title:**'));
    const scoreLine = lines.find(line => line.startsWith('**Score:**'));
    const verdictLine = lines.find(line => line.startsWith('**One-line verdict:**'));

    const title = titleLine?.replace('**Title:**', '').trim();
    const score = scoreLine?.replace('**Score:**', '').trim();
    const verdict = verdictLine?.replace('**One-line verdict:**', '').trim();

    const detailedStart = lines.findIndex(l => l.startsWith('**Detailed Feedback:**'));
    const numberedSections = [];

    for (let i = detailedStart + 1; i < lines.length; i++) {
      if (/^\d+\./.test(lines[i])) {
        let section = lines[i];
        let j = i + 1;
        while (
          j < lines.length &&
          !/^\d+\./.test(lines[j]) &&
          !lines[j].startsWith('**One-line verdict:**')
        ) {
          section += ' ' + lines[j];
          j++;
        }
        numberedSections.push(section.trim());
        i = j - 1;
      }
    }

    return { title, score, verdict, details: numberedSections };
  };

  const parsed = result?.feedback ? parseFeedback(result.feedback) : null;

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <div className="flex justify-end bg-black p-4 border-b border-gray-800">
        {session && (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md shadow transition duration-200"
          >
            Logout
          </button>
        )}
      </div>

      {session ? (
        <>
          <IdeaForm onResult={setResult} />
          {parsed && (
            <div className="p-6 bg-black border-t border-white shadow-inner">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">🧠 AI Feedback</span>
              </h2>

              <div className="text-white space-y-4">
                {parsed.title && (
                  <p>
                    <span className="text-blue-400 font-medium">Title:</span>{" "}
                    {parsed.title}
                  </p>
                )}
                {parsed.score && (
                  <p>
                    <span className="text-blue-400 font-medium">Score:</span>{" "}
                    <span className="font-bold text-green-400">
                      {parsed.score}/100
                    </span>
                  </p>
                )}

                <div className="space-y-3">
                  {parsed.details.map((section, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0e0e0e] border border-gray-700 p-4 rounded-md text-sm text-gray-200 whitespace-pre-wrap"
                    >
                      {section}
                    </div>
                  ))}
                </div>

                {parsed.verdict && (
                  <div className="mt-4 text-yellow-400 text-sm font-semibold border-t border-gray-700 pt-4">
                    📝 {parsed.verdict}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="p-4 text-center text-gray-300">
          Please log in to validate your ideas.
        </p>
      )}
    </div>
  );
};

export default Home;
