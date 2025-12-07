import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Login from "./Login";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";
import Navbar from "./Navbar";

export default function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else {
        setRole(null);
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    if (data) setRole(data.role);
    setLoading(false);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!session) return <Login />;

  return role === "admin" ? (
    <div className="flex flex-col justify-between items-center mb-6">
      <Navbar />
      <AdminDashboard session={session} />
    </div>
  ) : (
    <div className="flex flex-col justify-between items-center mb-6">
      <Navbar />
      <EmployeeDashboard session={session} />
    </div>
  );
}
