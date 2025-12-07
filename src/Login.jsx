import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [msg, setMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMsg(error.message);
      else {
        setMsg("Check email for verification!");
        if (adminCode) await promoteToAdmin();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMsg(error.message);
    }
  };

  const promoteToAdmin = async () => {
    const { data, error } = await supabase.rpc("make_admin", {
      secret_code: adminCode,
    });
    if (error) console.error(error);
    else setMsg(data);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleAuth}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">
          {isRegistering ? "Register" : "Login"}
        </h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isRegistering && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">
              Optional: Enter code to become Admin
            </p>
            <input
              className="w-full p-2 border rounded bg-yellow-50"
              type="text"
              placeholder="Admin Secret Code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
            />
          </div>
        )}

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isRegistering ? "Sign Up" : "Sign In"}
        </button>

        <p
          className="mt-4 text-center text-sm text-blue-500 cursor-pointer"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </p>
        {msg && <p className="mt-2 text-red-500 text-sm text-center">{msg}</p>}
      </form>
    </div>
  );
}
