import fs from "node:fs/promises";
import path from "node:path";

const MARKDOWN_EXTENSIONS = new Set([".md", ".markdown"]);

const isMarkdownFile = (filePath) =>
  MARKDOWN_EXTENSIONS.has(path.extname(filePath).toLowerCase());

export const collectMarkdownFiles = async (folderPath, maxDepth) => {
  const files = [];

  const visit = async (currentPath, depth) => {
    if (maxDepth !== undefined && depth > maxDepth) {
      return;
    }

    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    const sortedEntries = entries.sort((left, right) =>
      left.name.localeCompare(right.name),
    );

    for (const entry of sortedEntries) {
      const entryPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await visit(entryPath, depth + 1);
        continue;
      }

      if (entry.isFile() && isMarkdownFile(entryPath)) {
        files.push(entryPath);
      }
    }
  };

  await visit(folderPath, 0);
  return files;
};
