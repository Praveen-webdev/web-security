// client/src/FileUpload.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch uploaded files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:5001/files-list");
        setUploadedFiles(res.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    fetchFiles();
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Preview for selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    selectedFile && reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5001/upload", formData);
      console.log(res.data);

      // Refresh uploaded files list
      const filesRes = await axios.get("http://localhost:5001/files-list");
      setUploadedFiles(filesRes.data);

      // Clear selection
      setFile(null);
      setPreview(null);
      alert("File uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    }
  };

  const getFileType = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    if (["txt"].includes(ext)) return "text";
    return "other";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>File Upload</h2>
      <div style={{ marginBottom: "20px" }}>
        <input type="file" onChange={handleFileSelect} />
        {preview && (
          <div style={{ marginTop: "10px" }}>
            <h3>Selected File Preview:</h3>
            {file.type.startsWith("image/") ? (
              <img src={preview} alt="Preview" style={{ maxWidth: "300px" }} />
            ) : (
              <div>
                <p>File: {file.name}</p>
                <p>(Preview not available for this file type)</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={!file}
          style={{ marginTop: "10px" }}
        >
          Upload
        </button>
      </div>

      <div>
        <h2>Uploaded Files</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {uploadedFiles.map((filename, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {getFileType(filename) === "image" ? (
                <img
                  src={`http://localhost:5001/files/${filename}`}
                  alt="Uploaded content"
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  {getFileType(filename) === "pdf" && "📄"}
                  {getFileType(filename) === "text" && "📝"}
                  {getFileType(filename) === "other" && "📁"}
                </div>
              )}
              <div style={{ marginTop: "10px", wordBreak: "break-all" }}>
                {filename}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
