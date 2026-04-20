
import React, { useEffect, useState } from "react";
import { generateFileMetadata } from "../utils/metadata.ts"
const ACCESS_TOKEN =  import.meta.env.VITE_ACCESS_TOKEN;

// ✅ Type for your metadata
type FileMeta = {
  id: string;
  file_name: string;
  file_size: number;
  creation_date: string;
  modification_date: string;
  file_hash: string;
};

// ✅ Type for Dropbox file
type DropboxFile = {
  ".tag": "file" | "folder";
  name: string;
  id: string;
  path_lower: string;
};

const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<FileMeta[]>([]);
  const [dropboxFiles, setDropboxFiles] = useState<DropboxFile[]>([]);

  // 📂 Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const meta = generateFileMetadata(selectedFiles);
    setMetadata(meta);
  };

  // ☁️ Upload to Dropbox
  const uploadFiles = async () => {
    for (const file of files) {
      try {
        const response = await fetch(
          "https://content.dropboxapi.com/2/files/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              "Content-Type": "application/octet-stream",
              "Dropbox-API-Arg": JSON.stringify({
                path: `/${file.name}`,
                mode: "add",
                autorename: true,
              }),
            },
            body: file,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error_summary || "Upload failed");
        }

        console.log("Uploaded:", data);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    fetchDropboxFiles();
  };

  // 📥 Fetch files from Dropbox
  const fetchDropboxFiles = async () => {
    try {
      const response = await fetch(
        "https://api.dropboxapi.com/2/files/list_folder",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_summary || "Fetch failed");
      }

      setDropboxFiles(data.entries as DropboxFile[]);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDropboxFiles();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload + Fetch Dropbox Files</h2>

      <input type="file" multiple onChange={handleFileChange} />

      <button onClick={uploadFiles} disabled={!files.length}>
        Upload Files
      </button>

      <h3>Generated Metadata</h3>
      <pre>{JSON.stringify(metadata, null, 2)}</pre>

      <h3>Files in Dropbox</h3>
      <button onClick={fetchDropboxFiles}>Refresh</button>

      <ul>
        {dropboxFiles.map((file) => (
          <li key={file.id}>
            {file.name} ({file[".tag"]})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;