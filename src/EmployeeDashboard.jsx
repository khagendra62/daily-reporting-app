import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function EmployeeDashboard({ session }) {
  const [reports, setReports] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setReports(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = null;

    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `reports/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("report-images")
        .upload(filePath, image);

      if (uploadError) {
        console.error("Upload error:", uploadError);
      } else {
        const { data } = supabase.storage
          .from("report-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }
    }

    const { error } = await supabase.from("reports").insert({
      user_id: session.user.id,
      content: text,
      image_url: imageUrl,
    });

    if (!error) {
      setText("");
      setImage(null);
      fetchMyReports();
    }
    setUploading(false);
  };

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold w-full text-indigo-900">
        Employee Dashboard
      </h1>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Submit your daily report:</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-8"
        >
          <textarea
            className="w-full p-2 border rounded mb-4"
            rows="3"
            placeholder="What did you do today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="mb-4"
          />
          <button
            disabled={uploading}
            className="bg-green-600 text-white px-6 py-2 rounded block"
          >
            {uploading ? "Submitting..." : "Submit Report"}
          </button>
        </form>

        <h2 className="text-xl font-bold mb-4">My History</h2>
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-gray-50 p-4 rounded border flex gap-4"
            >
              <div className="flex-1">
                <p className="text-gray-600 text-xs mb-1">
                  {new Date(r.created_at).toLocaleString()}
                </p>
                <p>{r.content}</p>
              </div>
              {r.image_url && (
                <img
                  src={r.image_url}
                  alt="Report"
                  className="w-24 h-24 object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
