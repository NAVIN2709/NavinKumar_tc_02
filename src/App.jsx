import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Home from "./pages/Home";
import { supabase } from "../supabaseClient";

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return session ? (
    <Home />
  ) : (
    <div>
      <Login onLogin={() => window.location.reload()} />
    </div>
  );
};

export default App;
