// 'use client';

// import { useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import Link from "next/link";

// export default function Home() {

//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleMagicLink = async () => {
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithOtp({
//       email, options: {
//         // emailRedirectTo: 'http://localhost:3000/dashboard'
//         emailRedirectTo: `${window.location.origin}/callback`
//       }
//     });

//     setLoading(false);

//     if (error) {
//       setMessage('Error: ' + error.message);
//     } else {
//       setMessage('Check your email for the magic link!');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center flex-col mt-[100px]">

//       <h1 className="text-[30px] font-[600]">Supabase Magic Link Authentication</h1>
//       <div className="flex flex-col items-center mt-10">
//         <h1 className="text-xl font-bold mb-4">Login with Magic Link</h1>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border px-4 py-2 rounded mb-2"
//         />
//         <button
//           onClick={handleMagicLink}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           disabled={loading}
//         >
//           {loading ? 'Sending...' : 'Send Magic Link'}
//         </button>
//         {message && <p className="mt-4 text-green-600">{message}</p>}
//       </div>

//       <Link href="/test">Link to test Page</Link>
//     </div>
//   );
// }


'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      setMessage('Check your email for the login link!');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h1 className='text-[20px] text-center'>Login With Magic Link</h1>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? 'Sending magic link...' : 'Send magic link'}
      </button>
      {message && <p className="text-center">{message}</p>}
    </form>
  );
}