#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

// Get all unused @ts-expect-error directives
const output = execSync('pnpm type-check 2>&1 | grep "TS2578"', { encoding: 'utf-8' });
const lines = output.trim().split('\n');

// Group by file
const fileMap = new Map();
lines.forEach(line => {
  const match = line.match(/^(.+?)\((\d+),/);
  if (match) {
    const [, filePath, lineNum] = match;
    if (!fileMap.has(filePath)) {
      fileMap.set(filePath, []);
    }
    fileMap.get(filePath).push(parseInt(lineNum));
  }
});

// Process each file
let totalRemoved = 0;
fileMap.forEach((lineNumbers, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const contentLines = content.split('\n');

    // Sort line numbers in descending order to remove from bottom to top
    const sortedLines = lineNumbers.sort((a, b) => b - a);

    sortedLines.forEach(lineNum => {
      const idx = lineNum - 1; // Convert to 0-based index
      if (idx >= 0 && idx < contentLines.length) {
        console.log(`Removing line ${lineNum} from ${filePath}`);
        contentLines.splice(idx, 1);
        totalRemoved++;
      }
    });

    fs.writeFileSync(filePath, contentLines.join('\n'));
    console.log(`✓ Updated ${filePath} (removed ${lineNumbers.length} lines)`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
});

console.log(`\n✅ Done! Removed ${totalRemoved} unused @ts-expect-error directives from ${fileMap.size} files.`);
