import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function AdminDashboard({ session }) {
  const [reports, setReports] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: reportData } = await supabase
      .from("reports")
      .select(`*, profiles(email, department)`)
      .order("created_at", { ascending: false });

    if (reportData) setReports(reportData);
  };

  const filteredReports = reports.filter((r) => {
    const email = r.profiles?.email || "";
    const date = new Date(r.created_at).toISOString().split("T")[0];
    return (
      email.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterDate ? date === filterDate : true)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-900">Admin Dashboard</h1>
      </div>

      <div className="bg-white p-4 rounded shadow flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Name/Email"
          className="border p-2 rounded flex-1"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-indigo-50 border-b flex justify-between items-start">
              <div>
                <h3 className="font-bold text-indigo-700">
                  {report.profiles?.email}
                </h3>
                <span className="text-xs bg-indigo-200 px-2 py-1 rounded-full text-indigo-800">
                  {report.profiles?.department}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-gray-500">
                  {new Date(report.created_at).toLocaleTimeString()}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="p-4 flex-1">
              <p className="text-gray-700 whitespace-pre-wrap">
                {report.content}
              </p>
            </div>

            {report.image_url && (
              <div className="h-48 bg-gray-200">
                <img
                  src={report.image_url}
                  alt="Proof"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
