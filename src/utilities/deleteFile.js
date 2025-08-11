import fs from "fs";
import path from "path";

export const deleteFile = (folderName, filename) => {
  console.log(`Folder: ${folderName}, File: ${filename}`);

  // Build full file path: uploads/<folderName>/<filename>
  const filePath = path.join("uploads", folderName, filename);

  // Check if file exists before trying to delete
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`❌ Error deleting file ${filename} in ${folderName}:`, err);
      } else {
        console.log(`✅ File deleted: ${filename} from ${folderName}`);
      }
    });
  } else {
    console.warn(`⚠️ File not found in ${folderName}: ${filename}`);
  }
};
