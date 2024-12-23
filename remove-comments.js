const fs = require('fs-extra');
const glob = require('glob');
const stripComments = require('strip-comments');
const path = require('path');

// Use terminal-kit for colored output (more reliable than chalk)
const { terminal } = require('terminal-kit');

function removeCommentsFromFile(filePath) {
  try {
    // Read file content
    const originalContent = fs.readFileSync(filePath, 'utf8');

    // Remove comments
    const contentWithoutComments = stripComments(originalContent, {
      line: true, // Remove line comments
      block: true, // Remove block comments
      keepPrototypes: false,
      preserveNewlines: true,
    });

    // Write back to the same file
    fs.writeFileSync(filePath, contentWithoutComments, 'utf8');

    terminal.green(`✓ Processed: ${filePath}\n`);
    return true;
  } catch (error) {
    terminal.red(`✗ Error processing ${filePath}: ${error.message}\n`);
    return false;
  }
}

function processFiles() {
  // Glob pattern to match JavaScript files in the project
  const pattern = 'src/**/*.{js,jsx,ts,tsx}';

  // Exclude certain directories
  const options = {
    ignore: ['**/node_modules/**', '**/.git/**', '**/.github/**'],
  };

  // Find files matching the pattern
  const files = glob.sync(pattern, options);

  if (files.length === 0) {
    terminal.yellow('⚠ No files found matching the pattern.\n');
    return;
  }

  terminal.blue(`🔍 Found ${files.length} files to process\n`);

  // Process each file
  const processedFiles = files.map((file) => {
    const fullPath = path.resolve(process.cwd(), file);
    return removeCommentsFromFile(fullPath);
  });

  // Summary
  const successCount = processedFiles.filter(Boolean).length;
  terminal.green(`\n✓ Processed ${successCount} out of ${files.length} files\n`);
}

// Run the process
processFiles();
