import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

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
    <div className="w-full bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-700">Daily Reporting App</h1>

      {user && (
        <div className="flex items-center gap-3">
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
      )}
    </div>
  );
}
