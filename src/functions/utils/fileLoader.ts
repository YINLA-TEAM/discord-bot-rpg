import fs from "fs";
import path from "path";

export function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, arrayOfFiles);
    } else if (filePath.endsWith(".ts")) {
      arrayOfFiles.push(filePath);
    }
  }
  return arrayOfFiles;
}
