# markdown-to-anki

Convert a folder of Markdown flashcards into an Anki TSV import file.

```sh
npm install
npm start -- ./cards
```

By default, the deck name is the folder name. Override it with `--deck`.
By default, the output file is the deck name with a `.tsv` extension.

```sh
npm start -- ./cards --deck "Programming" --output programming.tsv
```

When installed from npm, run it with `npx`:

```sh
npx markdown-to-anki ./cards
```

Calling it without a folder prints the help menu.

Each Markdown file should contain front and back content separated by a `---`
line. YAML frontmatter is optional, may be blank, or may contain optional
`tags`. Card IDs are generated from the deck name and Markdown filename.

```md
---
tags:
  - web
  - html
---

What is HTML?

---

HyperText Markup Language
```

No frontmatter is also valid:

```md
What is HTML?

---

HyperText Markup Language
```

Options:

```text
folder                  folder containing Markdown flashcard files
-d, --deck <name>       deck name; defaults to the folder name
-o, --output <file>     TSV output file; defaults to <deck>.tsv
--max-depth <number>    maximum folder depth to scan
```
