// client/src/FileUpload.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const MimeDemo = () => {
  const [payload, setPayload] = useState("");
  const [contentType, setContentType] = useState("");
  const [noSniff, setNoSniff] = useState(false);
  const [extension, setExtension] = useState("html");
  const [filename, setFilename] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [savedFiles, setSavedFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:5001/files-list");
        setSavedFiles(res.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    fetchFiles();
  }, []);

  const handleSavePayload = async () => {
    try {
      const res = await axios.post("http://localhost:5001/save-payload", {
        payload,
        contentType,
        noSniff,
        extension,
        filename,
      });
      const { filename: savedFilename } = res.data;
      setPreviewUrl(`http://localhost:5001/serve/${savedFilename}`);

      const filesRes = await axios.get("http://localhost:5001/files-list");
      setSavedFiles(filesRes.data);
    } catch (err) {
      console.error(err);
      alert("Error saving payload");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        MIME Sniffing Demo
      </h2>

      {/* Upload Form */}
      <div className="space-y-4">
        {/* Filename & Extension */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <input
            type="text"
            autoComplete="off"
            placeholder="Enter filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full sm:w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={extension}
            onChange={(e) => setExtension(e.target.value)}
            className="w-full sm:w-1/4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {[
              "html",
              "txt",
              "svg",
              "png",
              "js",
              "json",
              "css",
              "xml",
              "jpg",
              "jpeg",
              "gif",
            ].map((ext) => (
              <option key={ext} value={ext}>
                .{ext}
              </option>
            ))}
          </select>
        </div>

        {/* Payload Textarea */}
        <label className="block text-gray-700 mb-1">Payload:</label>
        <div>
          <textarea
            rows={8}
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="Enter your payload here (HTML, JavaScript, etc.)"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Response Headers Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Content-Type:</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="omit">Omit header</option>
              <option value="">Default server detection</option>
              <option value="text/html">text/html</option>
              <option value="text/plain">text/plain</option>
              <option value="image/svg+xml">image/svg+xml</option>
              <option value="application/json">application/json</option>
              <option value="text/javascript">text/javascript</option>
              <option value="image/png">image/png</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={noSniff}
              onChange={(e) => setNoSniff(e.target.checked)}
              id="noSniff"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
            />
            <label htmlFor="noSniff" className="text-gray-700">
              X-Content-Type-Options: nosniff
            </label>
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleSavePayload}
          className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
        >
          Upload & Preview
        </button>
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Preview</h3>
          <div className="border rounded-md overflow-hidden">
            <iframe
              src={previewUrl}
              title="MIME Preview"
              className="w-full h-96"
            />
          </div>
        </div>
      )}

      {/* Saved Payloads List */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Saved Payloads
        </h3>
        <ul className="space-y-2">
          {savedFiles.map((file, idx) => (
            <li key={idx}>
              <button
                onClick={() =>
                  setPreviewUrl(`http://localhost:5001/serve/${file}`)
                }
                className="text-blue-600 hover:underline"
              >
                {file}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MimeDemo;
