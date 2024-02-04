import fs from 'fs';
import fetch from 'node-fetch';

const createFolderAndSubFolder = (fullPath) => {
  const folderPath = fullPath.split('/').slice(0, -1).join('/');
  fs.mkdirSync(folderPath, {recursive: true});
};

const downloadFile = async (url, path) => {
  createFolderAndSubFolder(path);
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(path, buffer);
}

const saveInJsonFile = async (data, fullPath) => {
  createFolderAndSubFolder(fullPath);
  fs.writeFileSync(
      fullPath,
      JSON.stringify(data, null, 2)
  );
};

const readJsonFile = (fullPath) => {
  const data = fs.readFileSync(fullPath);
  return JSON.parse(data);
};


export { 
  createFolderAndSubFolder, 
  downloadFile,
  saveInJsonFile,
  readJsonFile
};