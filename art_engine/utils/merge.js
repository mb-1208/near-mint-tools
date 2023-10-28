const fs = require('fs');
const path = require('path');
const basePath = process.cwd();

// Define the source folders
const sourceFolder1 = `${basePath}/build/json`;
const sourceFolder2 = `${basePath}/build/images`;

// Define the destination folder
const destinationFolder = `${basePath}/build/upload`;

// Create the "upload" folder if it doesn't exist
if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder);
}

// Function to recursively copy files from sourceFolder to destinationFolder
function copyFiles(sourceFolder, destinationFolder) {
  const files = fs.readdirSync(sourceFolder);

  for (const file of files) {
    const sourceFilePath = path.join(sourceFolder, file);
    const destinationFilePath = path.join(destinationFolder, file);

    if (fs.lstatSync(sourceFilePath).isDirectory()) {
      // If it's a directory, create a corresponding directory in the destination and copy its contents
      if (!fs.existsSync(destinationFilePath)) {
        fs.mkdirSync(destinationFilePath);
      }
      copyFiles(sourceFilePath, destinationFilePath);
    } else {
      // If it's a file, copy it to the destination folder
      fs.copyFileSync(sourceFilePath, destinationFilePath);
    }
  }
}

// Merge the contents of sourceFolder1 and sourceFolder2 into the destinationFolder
copyFiles(sourceFolder1, destinationFolder);
copyFiles(sourceFolder2, destinationFolder);

console.log('Folders merged into "upload" folder.');
