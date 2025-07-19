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
          {result?.feedback && (
            <div className="px-4 md:px-8 py-6 bg-black border-t border-white shadow-inner">
              <div className="max-w-3xl mx-auto bg-[#0d0d0d] border border-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 rounded-t-xl">
                  <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-white">🧠 AI Feedback</span>
                  </h2>
                </div>
                <div className="p-6">
                  <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-200 bg-[#0a0a0a] border border-gray-700 p-4 rounded-md font-mono overflow-x-auto">
                    {result.feedback}
                  </pre>
                </div>
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
