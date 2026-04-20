// src/utils/dropboxUtils.ts

const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

/**
 * Upload un fichier unique vers Dropbox
 * @param file Le fichier à uploader
 * @param folder Chemin du dossier dans Dropbox (optionnel)
 */
export const uploadFileToDropbox = async (file: File, folder: string = "apps_files") => {
  if (!ACCESS_TOKEN) {
    throw new Error("Dropbox Access Token is missing. Check your .env file.");
  }

  try {
    const response = await fetch(
      "https://content.dropboxapi.com/2/files/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/octet-stream",
          "Dropbox-API-Arg": JSON.stringify({
            path: `/${folder}/${Date.now()}_${file.name}`,
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

    return data; // Retourne les métadonnées de Dropbox (id, path_lower, etc.)
  } catch (err) {
    console.error("Dropbox Upload Error:", err);
    throw err;
  }
};

/**
 * Récupère la liste des fichiers d'un dossier Dropbox
 * @param path Le chemin du dossier (vide pour la racine)
 */
export const fetchDropboxFiles = async (path: string = "") => {
  if (!ACCESS_TOKEN) {
    throw new Error("Dropbox Access Token is missing.");
  }

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
          path: path,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_summary || "Fetch failed");
    }

    return data.entries; // Retourne le tableau des fichiers
  } catch (error) {
    console.error("Dropbox Fetch Error:", error);
    throw error;
  }
};