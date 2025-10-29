#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Recursively find all files matching extensions in a directory
 * @param {string} dir - Directory to search
 * @param {string[]} extensions - File extensions to match (e.g., ['.md', '.mdx'])
 * @returns {string[]} - Array of file paths
 */
function findFiles(dir, extensions = ['.md', '.mdx']) {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    });
  }

  if (fs.existsSync(dir)) {
    traverse(dir);
  }

  return files;
}

/**
 * Move directory contents from source to destination
 * @param {string} sourceDir - Source directory
 * @param {string} destDir - Destination directory
 */
function moveDirectoryContents(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) {
    console.warn(`⚠️  Source directory not found: ${sourceDir}`);
    return;
  }

  // Ensure destination directory exists
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(sourceDir);
  let movedCount = 0;

  entries.forEach(entry => {
    const sourcePath = path.join(sourceDir, entry);
    const destPath = path.join(destDir, entry);

    fs.renameSync(sourcePath, destPath);
    movedCount++;
  });

  console.log(`📁 Moved ${movedCount} items from ${sourceDir} to ${destDir}`);
}

/**
 * Remove directory and all its contents
 * @param {string} dir - Directory to remove
 */
function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`🗑️  Removed directory: ${dir}`);
  }
}

/**
 * Create directory (and parent directories if needed)
 * @param {string} dir - Directory to create
 */
function createDirectory(dir) {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`📁 Created directory: ${dir}`);
}

/**
 * Copy file from source to destination
 * @param {string} sourceFile - Source file path
 * @param {string} destFile - Destination file path
 */
function copyFile(sourceFile, destFile) {
  // Ensure destination directory exists
  const destDir = path.dirname(destFile);
  fs.mkdirSync(destDir, { recursive: true });

  fs.copyFileSync(sourceFile, destFile);
  console.log(`📋 Copied: ${sourceFile} → ${destFile}`);
}

/**
 * Rename/move a file
 * @param {string} oldPath - Current file path
 * @param {string} newPath - New file path
 */
function renameFile(oldPath, newPath) {
  if (fs.existsSync(oldPath)) {
    // Ensure destination directory exists
    const destDir = path.dirname(newPath);
    fs.mkdirSync(destDir, { recursive: true });

    fs.renameSync(oldPath, newPath);
    console.log(`🔄 Renamed: ${oldPath} → ${newPath}`);
  } else {
    console.warn(`⚠️  File not found for rename: ${oldPath}`);
  }
}

module.exports = {
  findFiles,
  moveDirectoryContents,
  removeDirectory,
  createDirectory,
  copyFile,
  renameFile
};
