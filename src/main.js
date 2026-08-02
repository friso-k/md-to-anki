#!/usr/bin/env node

import { Command } from "commander";
import { createApp } from "./app.js";

const program = new Command();

program
  .name("markdown-to-anki")
  .description("Convert Markdown flashcards to an Anki import TSV.")
  .argument("<folder>", "folder containing Markdown flashcard files")
  .option("-d, --deck <name>", "deck name; defaults to the folder name")
  .option("-o, --output <file>", "TSV output file; defaults to <deck>.tsv")
  .option("--max-depth <number>", "maximum folder depth to scan", Number);

if (process.argv.length === 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();

const options = program.opts();
const [folder] = program.args;

const app = createApp({
  folder,
  outputFile: options.output,
  deckName: options.deck,
  maxDepth: options.maxDepth ?? 1,
});

app.run().catch((error) => {
  console.error("Could not generate TSV:", error);
  process.exitCode = 1;
});
