'use client';

import TableData from "@/components/TableData/TableData";
import GenerateJob from '@/components/GenerateJob/GenerateJob';


import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMagicLink = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
  };

  return (
    <div className="flex justify-center items-center flex-col mt-[100px]">

      <h1 className="text-[30px] font-[600]">Supabase Magic Link Authentication</h1>
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-xl font-bold mb-4">Login with Magic Link</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-4 py-2 rounded mb-2"
        />
        <button
          onClick={handleMagicLink}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
        {message && <p className="mt-4 text-green-600">{message}</p>}
      </div>
    </div>
  );
}
