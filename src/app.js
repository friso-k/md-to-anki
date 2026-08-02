import fs from "node:fs/promises";
import path from "node:path";
import { collectMarkdownFiles } from "./markdown-files.js";
import { parseMarkdownCard } from "./markdown-card.js";
import { createTsv } from "./tsv.js";

const assertDirectory = async (folderPath) => {
  const stats = await fs.stat(folderPath);

  if (!stats.isDirectory()) {
    throw new Error(`${folderPath} is not a directory`);
  }
};

const createCardId = (deckName, markdownFile) =>
  `${deckName}:${path.basename(markdownFile)}`;

const loadCards = async (markdownFiles, deckName) => {
  const rows = [];

  for (const markdownFile of markdownFiles) {
    const card = await parseMarkdownCard(markdownFile);
    rows.push({
      id: createCardId(deckName, markdownFile),
      ...card,
    });
  }

  return rows;
};

export const createApp = (options) => ({
  run: async () => {
    const folderPath = path.resolve(options.folder);
    const deckName = options.deckName ?? path.basename(folderPath);
    const outputFile = options.outputFile ?? `${deckName}.tsv`;

    await assertDirectory(folderPath);

    const markdownFiles = await collectMarkdownFiles(
      folderPath,
      options.maxDepth,
    );

    if (markdownFiles.length === 0) {
      throw new Error(`No Markdown files found in ${folderPath}`);
    }

    const rows = await loadCards(markdownFiles, deckName);
    const tsv = createTsv(rows, deckName);

    await fs.writeFile(outputFile, `${tsv}\n`, "utf8");
    console.log(
      `Created ${outputFile} with ${rows.length} cards in deck "${deckName}"`,
    );
  },
});
