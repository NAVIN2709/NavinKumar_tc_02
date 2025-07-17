import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import logo from '/logo.png'; // Ensure this path works relative to public or src

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Signup successful. Please check your email to verify your account.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white px-4 sm:px-6 w-[100vw]">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-[#0e0e0e] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-800">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Ideate Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-center text-xl sm:text-2xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 bg-[#1a1a1a] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 bg-[#1a1a1a] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition text-white font-semibold py-3 rounded-lg"
          >
            {loading
              ? mode === 'login' ? 'Logging in...' : 'Signing up...'
              : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle Link */}
        <p className="mt-4 text-center text-sm text-gray-400">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-cyan-400 underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-purple-400 underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
