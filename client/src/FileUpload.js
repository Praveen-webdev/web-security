import React, { useState, useEffect } from "react";
import axios from "axios";

const MimeDemo = () => {
  const [payload, setPayload] = useState("");
  const [contentType, setContentType] = useState("");
  const [customContentType, setCustomContentType] = useState("");
  const [noSniff, setNoSniff] = useState(false);
  const [extension, setExtension] = useState("txt");
  const [customExtension, setCustomExtension] = useState("");
  const [filename, setFilename] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [savedFiles, setSavedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    const finalExtension = extension === "other" ? customExtension : extension;
    const finalContentType =
      contentType === "other" ? customContentType : contentType;

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/save-payload", {
        payload,
        contentType: finalContentType,
        noSniff,
        extension: finalExtension,
        filename,
      });
      const { filename: savedFilename } = res.data;
      setPreviewUrl(`http://localhost:5001/serve/${savedFilename}`);

      const filesRes = await axios.get("http://localhost:5001/files-list");
      setSavedFiles(filesRes.data);
    } catch (err) {
      console.error(err);
      alert("Error saving payload");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            MIME Sniffing Demo
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="space-y-5">
              <h2 className="text-lg font-medium text-gray-900">
                Upload Configuration
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Enter filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[
                      "html",
                      "txt",
                      "svg",
                      "png",
                      "pdf",
                      "js",
                      "json",
                      "css",
                      "xml",
                      "jpg",
                      "jpeg",
                      "gif",
                      "other",
                    ].map((ext) => (
                      <option key={ext} value={ext}>
                        {ext === "other" ? "Other..." : `.${ext}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {extension === "other" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Extension
                  </label>
                  <input
                    type="text"
                    placeholder="Enter custom extension (without dot)"
                    value={customExtension}
                    onChange={(e) => setCustomExtension(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payload Content
                </label>
                <textarea
                  rows={8}
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  placeholder="Enter your payload here (HTML, JavaScript, etc.)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
              </div>

              <h2 className="text-lg font-medium text-gray-900">
                Server Configuration
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content-Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="omit">Omit header</option>
                  <option value="">Default server detection</option>
                  <option value="text/html">text/html</option>
                  <option value="text/plain">text/plain</option>
                  <option value="image/svg+xml">image/svg+xml</option>
                  <option value="application/json">application/json</option>
                  <option value="application/pdf">application/pdf</option>
                  <option value="text/javascript">text/javascript</option>
                  <option value="image/png">image/png</option>
                  <option value="other">Other...</option>
                </select>
              </div>

              {contentType === "other" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Content-Type
                  </label>
                  <input
                    type="text"
                    placeholder="Enter custom Content-Type"
                    value={customContentType}
                    onChange={(e) => setCustomContentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={noSniff}
                  onChange={(e) => setNoSniff(e.target.checked)}
                  id="noSniff"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="noSniff" className="text-sm text-gray-700">
                  Enable X-Content-Type-Options: nosniff
                </label>
              </div>

              <button
                onClick={handleSavePayload}
                disabled={isLoading}
                className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Upload & Preview"
                )}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {previewUrl && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Preview</h3>
                  <button
                    onClick={() => window.open(previewUrl, "_blank")}
                    className="text-sm text-black bg-slate-100 hover:bg-slate-200"
                  >
                    Open in New Tab
                  </button>
                </div>
                <div className="border rounded-md overflow-hidden bg-gray-50">
                  <iframe
                    src={previewUrl}
                    title="MIME Preview"
                    className="w-full h-[400px]"
                  />
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Saved Files</h2>
              {savedFiles.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {savedFiles.map((file, idx) => (
                    <li
                      key={idx}
                      className="py-3 flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-800 font-medium">
                        {file}
                      </span>
                      <button
                        onClick={() =>
                          setPreviewUrl(`http://localhost:5001/serve/${file}`)
                        }
                        className="text-sm decoration-0 text-white"
                      >
                        Preview
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No files uploaded yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MimeDemo;
