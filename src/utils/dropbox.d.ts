/**
 * Upload un fichier unique vers Dropbox
 * @param file Le fichier à uploader
 * @param folder Chemin du dossier dans Dropbox (optionnel)
 */
export declare const uploadFileToDropbox: (file: File, folder?: string) => Promise<any>;
/**
 * Récupère la liste des fichiers d'un dossier Dropbox
 * @param path Le chemin du dossier (vide pour la racine)
 */
export declare const fetchDropboxFiles: (path?: string) => Promise<any>;
