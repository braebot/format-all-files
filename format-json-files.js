#!/usr/bin/env node

'use strict';

const fs = require('fs');

function getFilePathsFromDirs(dirs) {
  let filePaths = [];

  dirs.forEach((dir) => {
    const dirPaths = fs.readdirSync(dir);

    dirPaths.forEach((file) => {
      const fullFilePath = `${dir}/${file}`;
      const stat = fs.statSync(fullFilePath);

      if (stat && stat.isDirectory()) {
        filePaths = filePaths.concat(getFilePathsFromDirs([fullFilePath]));
      } else {
        filePaths.push(fullFilePath);
      }
    });
  });

  return filePaths;
}

const filePaths = getFilePathsFromDirs(["."]);
filePaths.filter((fileName) => fileName.endsWith(".json")).forEach((fileName) => {
  console.log(`Formatting: ${fileName}`);
  const formattedContent = JSON.stringify(JSON.parse(require('fs').readFileSync(fileName, 'utf-8')), null, 4) + "\n";

  fs.writeFile(fileName, formattedContent, function(err) {
    if(err) {
      throw new Error(err);
    }
  });
});
