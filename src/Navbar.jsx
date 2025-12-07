import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url")
          .eq("id", user.id)
          .single();

        setProfile(data);
      }
    };

    loadUser();
  }, []);

  return (
    <nav className="w-full bg-white shadow px-4 md:px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-700">Daily Reporting App</h1>

      {user && (
        <div className="relative">
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">
                {profile?.full_name || user.email}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold uppercase">
              {user.email?.charAt(0)}
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              className="ml-2 text-sm bg-red-500 cursor-pointer text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold uppercase focus:outline-none"
            >
              {user.email?.charAt(0)}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border z-50">
                <div className="p-3 border-b">
                  <p className="text-sm font-semibold text-gray-700">
                    {profile?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
